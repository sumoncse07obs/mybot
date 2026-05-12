from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user_model import User
from app.schemas.auth_schema import RegisterRequest, LoginRequest
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
)


async def register_user(data: RegisterRequest, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == data.email))
    existing_user = result.scalar_one_or_none()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        password=hash_password(data.password),
        phone=data.phone,
        role="user",
        is_active=True,
    )

    db.add(user)
    await db.commit()
    await db.refresh(user)

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


async def login_user(data: LoginRequest, db: AsyncSession):
    result = await db.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive")

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }