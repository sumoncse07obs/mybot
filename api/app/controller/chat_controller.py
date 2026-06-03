from datetime import datetime

from fastapi import HTTPException
from openai import AsyncOpenAI
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.controller.api_key_controller import hash_api_key
from app.models.api_key_model import ApiKey
from app.models.chat_conversation_model import ChatConversation
from app.models.chat_message_model import ChatMessage
from app.models.resource_chunk_model import ResourceChunk
from app.models.resource_model import Resource
from app.models.user_model import User
from app.schemas.chat_schema import ChatRequest
from app.services.embedding_service import create_embedding
from app.services.secret_crypto import decrypt_secret
from app.settings.dbdriver import settings


DEFAULT_SYSTEM_PROMPT = (
    "You are a helpful website chat assistant. "
    "Answer clearly and use the provided knowledge base context when it is relevant. "
    "Use the conversation history when it helps. "
    "If the context does not contain the answer, say what you know and ask a helpful follow-up."
)


async def resolve_chat_api_key(raw_key: str, db: AsyncSession) -> ApiKey:
    key_hash = hash_api_key(raw_key)

    result = await db.execute(
        select(ApiKey).where(
            ApiKey.key_hash == key_hash,
            ApiKey.is_active.is_(True),
        )
    )
    api_key = result.scalar_one_or_none()

    if not api_key:
        raise HTTPException(status_code=401, detail="Invalid or inactive API key")

    return api_key


async def resolve_api_key_owner(api_key: ApiKey, db: AsyncSession) -> User:
    if not api_key.created_by_id:
        raise HTTPException(status_code=403, detail="API key has no owner")

    result = await db.execute(select(User).where(User.id == api_key.created_by_id))
    user = result.scalar_one_or_none()

    if not user or not user.is_active:
        raise HTTPException(status_code=403, detail="Account not found or inactive")

    return user


def resolve_openai_key(user: User) -> str:
    if user.openai_api_key:
        try:
            return decrypt_secret(user.openai_api_key)
        except ValueError:
            raise HTTPException(status_code=422, detail="Stored OpenAI key could not be decrypted")

    if settings.OPENAI_API_KEY:
        return settings.OPENAI_API_KEY

    raise HTTPException(status_code=500, detail="OpenAI API key is not configured")


async def retrieve_context(
    message: str,
    owner: User,
    db: AsyncSession,
    limit: int,
) -> list[dict]:
    query_embedding = await create_embedding(message)
    distance = ResourceChunk.embedding.cosine_distance(query_embedding)

    result = await db.execute(
        select(
            ResourceChunk,
            Resource.title.label("resource_title"),
            Resource.resource_type.label("resource_type"),
            distance.label("distance"),
        )
        .join(Resource, Resource.id == ResourceChunk.resource_id)
        .where(Resource.created_by_id == owner.id)
        .where(Resource.is_active.is_(True))
        .where(Resource.is_indexed.is_(True))
        .where(ResourceChunk.embedding.is_not(None))
        .order_by(distance)
        .limit(limit)
    )

    matches = []

    for chunk, resource_title, resource_type, distance_value in result.all():
        distance_float = float(distance_value)
        matches.append(
            {
                "resource_id": chunk.resource_id,
                "resource_title": resource_title,
                "resource_type": resource_type,
                "content": chunk.content,
                "score": max(0, 1 - distance_float),
            }
        )

    return matches


def build_context_text(matches: list[dict]) -> str:
    if not matches:
        return "No indexed knowledge base context was found."

    blocks = []

    for index, match in enumerate(matches, start=1):
        blocks.append(
            "\n".join(
                [
                    f"[Context {index}]",
                    f"Title: {match['resource_title']}",
                    f"Type: {match['resource_type']}",
                    f"Content: {match['content']}",
                ]
            )
        )

    return "\n\n".join(blocks)


def build_system_prompt(api_key: ApiKey, context_text: str) -> str:
    persona_prompt = api_key.system_prompt or DEFAULT_SYSTEM_PROMPT

    return "\n\n".join(
        [
            persona_prompt.strip(),
            "Use the following knowledge base context when relevant.",
            context_text,
            "Rules:",
            "- Be concise, helpful, and natural.",
            "- Use conversation history when it is useful.",
            "- Do not mention internal resource IDs unless the user asks.",
            "- If the context is not enough, say so honestly.",
        ]
    )


def make_conversation_title(message: str) -> str:
    title = " ".join(message.strip().split())

    if len(title) > 120:
        return f"{title[:117].rstrip()}..."

    return title or "New conversation"


async def resolve_conversation(data: ChatRequest, api_key: ApiKey, owner: User, db: AsyncSession) -> ChatConversation:
    external_user_id = (data.external_user_id or "anonymous").strip() or "anonymous"

    if data.conversation_id:
        try:
            conversation_id = int(data.conversation_id)
        except (TypeError, ValueError):
            conversation_id = 0

        if conversation_id > 0:
            result = await db.execute(
                select(ChatConversation).where(
                    ChatConversation.id == conversation_id,
                    ChatConversation.api_key_id == api_key.id,
                    ChatConversation.created_by_id == owner.id,
                )
            )
            conversation = result.scalar_one_or_none()

            if conversation:
                return conversation

    conversation = ChatConversation(
        api_key_id=api_key.id,
        created_by_id=owner.id,
        external_user_id=external_user_id,
        title=make_conversation_title(data.message),
        last_message_at=datetime.utcnow(),
    )

    db.add(conversation)
    await db.flush()

    return conversation

async def load_recent_messages(conversation_id: int, db: AsyncSession, limit: int = 8) -> list[dict]:
    result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.conversation_id == conversation_id)
        .order_by(ChatMessage.id.desc())
        .limit(limit)
    )

    rows = list(reversed(result.scalars().all()))

    return [
        {
            "role": "assistant" if message.role == "assistant" else "user",
            "content": message.content,
        }
        for message in rows
    ]


async def chat_with_api_key(data: ChatRequest, db: AsyncSession):
    api_key = await resolve_chat_api_key(data.api_key, db)
    owner = await resolve_api_key_owner(api_key, db)
    openai_key = resolve_openai_key(owner)

    conversation = await resolve_conversation(data, api_key, owner, db)
    recent_messages = await load_recent_messages(conversation.id, db)

    user_message = ChatMessage(
        conversation_id=conversation.id,
        api_key_id=api_key.id,
        created_by_id=owner.id,
        role="user",
        content=data.message,
    )
    db.add(user_message)
    await db.flush()

    matches = await retrieve_context(
        message=data.message,
        owner=owner,
        db=db,
        limit=data.limit,
    )

    system_prompt = build_system_prompt(
        api_key=api_key,
        context_text=build_context_text(matches),
    )

    client = AsyncOpenAI(api_key=openai_key)

    response = await client.chat.completions.create(
        model=settings.CHAT_MODEL,
        temperature=api_key.temperature,
        messages=[
            {"role": "system", "content": system_prompt},
            *recent_messages,
            {"role": "user", "content": data.message},
        ],
    )

    answer = response.choices[0].message.content or ""

    assistant_message = ChatMessage(
        conversation_id=conversation.id,
        api_key_id=api_key.id,
        created_by_id=owner.id,
        role="assistant",
        content=answer,
    )
    db.add(assistant_message)

    now = datetime.utcnow()
    conversation.last_message_at = now
    conversation.updated_at = now

    await db.commit()
    await db.refresh(conversation)

    return {
        "answer": answer,
        "api_key_id": api_key.id,
        "conversation_id": conversation.id,
        "display_name": api_key.display_name,
        "avatar_url": api_key.avatar_url,
        "welcome_message": api_key.welcome_message,
        "used_resources": matches,
    }