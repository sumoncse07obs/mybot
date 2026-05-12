from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    password: str
    phone: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class AdminUserListResponse(BaseModel):
    id: int
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    role: str
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class AdminUserUpdateRequest(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None
    system_prompt: Optional[str] = None
    openai_api_key: Optional[str] = None


class AdminChangePasswordRequest(BaseModel):
    password: str


class AdminChangeRoleRequest(BaseModel):
    role: str