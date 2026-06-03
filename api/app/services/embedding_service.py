from openai import AsyncOpenAI

from app.settings.dbdriver import settings


def get_openai_client() -> AsyncOpenAI:
    if not settings.OPENAI_API_KEY:
        raise RuntimeError("OPENAI_API_KEY is missing from .env")

    return AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def create_embedding(text: str) -> list[float]:
    client = get_openai_client()

    response = await client.embeddings.create(
        model=settings.EMBEDDING_MODEL,
        input=text,
    )

    return response.data[0].embedding


async def create_embeddings(texts: list[str]) -> list[list[float]]:
    if not texts:
        return []

    client = get_openai_client()

    response = await client.embeddings.create(
        model=settings.EMBEDDING_MODEL,
        input=texts,
    )

    return [item.embedding for item in response.data]