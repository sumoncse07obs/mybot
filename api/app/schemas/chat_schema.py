from typing import Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    api_key: str
    message: str = Field(min_length=1)
    external_user_id: Optional[str] = None
    conversation_id: Optional[str] = None
    limit: int = Field(default=6, ge=1, le=12)


class ChatResourceMatch(BaseModel):
    resource_id: int
    resource_title: str
    resource_type: str
    content: str
    score: float


class ChatResponse(BaseModel):
    answer: str
    api_key_id: int
    conversation_id: int
    display_name: Optional[str] = None
    avatar_url: Optional[str] = None
    welcome_message: Optional[str] = None
    used_resources: list[ChatResourceMatch] = Field(default_factory=list)