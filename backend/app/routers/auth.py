from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status
from app.config.settings import get_settings
from app.middleware.auth_middleware import require_admin
from app.schemas.auth import AdminInfo, LoginRequest, TokenResponse
from app.utils.security import (
    create_access_token,
    token_expires_in,
    verify_password,
)

router = APIRouter()
settings = get_settings()

@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Admin login",
    description="Đăng nhập với email và password. Trả về JWT access token.",
)
async def login(body: LoginRequest) -> TokenResponse:
    if body.email != settings.ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc password không đúng",
        )

    if body.password != settings.ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc password không đúng",
        )

    token = create_access_token(subject=body.email)
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=token_expires_in(),
    )


@router.get(
    "/me",
    response_model=AdminInfo,
    summary="Thông tin admin hiện tại",
    dependencies=[Depends(require_admin)],
)
async def me(email: str = Depends(require_admin)) -> AdminInfo:
    return AdminInfo(email=email, role="admin")