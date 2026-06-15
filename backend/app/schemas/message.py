from __future__ import annotations
import uuid
from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models.message import MessageStatus

# ── Contact form (public) ─────────────────────────────────────────────────────
class ContactFormRequest(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=150)]
    email: EmailStr
    company: str | None = Field(None, max_length=200)
    phone: str | None = Field(None, max_length=20)
    subject: Annotated[str, Field(min_length=1, max_length=300)]
    body: Annotated[str, Field(min_length=10, max_length=5000)]

    @field_validator("name", "subject", "body", mode="before")
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        return v.strip()

    @field_validator("phone", mode="before")
    @classmethod
    def clean_phone(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v if v else None

    @field_validator("company", mode="before")
    @classmethod
    def clean_company(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v if v else None


class ContactFormResponse(BaseModel):
    message: str = "Tin nhắn của bạn đã được gửi thành công!"
    success: bool = True


# ── Admin schemas ─────────────────────────────────────────────────────────────
class MessageResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    company: str | None
    phone: str | None
    subject: str
    body: str
    status: MessageStatus
    is_starred: bool
    replied_at: datetime | None
    reply_note: str | None
    ip_address: str | None
    user_agent: str | None
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class MessageStatusUpdate(BaseModel):
    status: MessageStatus

class MessageStarUpdate(BaseModel):
    is_starred: bool

class MessageReplyUpdate(BaseModel):
    reply_note: str | None = Field(None, max_length=2000)

class MessageListResponse(BaseModel):
    items: list[MessageResponse]
    total: int
    unread_count: int
    page: int
    page_size: int
    total_pages: int