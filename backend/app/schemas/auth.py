from __future__ import annotations
from pydantic import BaseModel, EmailStr, Field

# ── Request ───────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)

# ── Response ──────────────────────────────────────────────────────────────────
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Số giây token còn hiệu lực")

class AdminInfo(BaseModel):
    email: str
    role: str = "admin"
