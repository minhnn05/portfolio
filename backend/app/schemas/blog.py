from __future__ import annotations
import math
import uuid
from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, Field, field_validator
from app.models.blog import BlogStatus

def _estimate_reading_time(content: str) -> int:
    words = len(content.split())
    return max(1, math.ceil(words / 200))

class BlogBase(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=300)]
    excerpt: Annotated[str, Field(min_length=1, max_length=600)]
    content: Annotated[str, Field(min_length=1)]
    cover_image_url: str | None = Field(None, max_length=500)
    tags: list[str] = Field(default_factory=list)
    category: str | None = Field(None, max_length=100)
    meta_title: str | None = Field(None, max_length=70)
    meta_description: str | None = Field(None, max_length=160)
    status: BlogStatus = BlogStatus.DRAFT
    is_featured: bool = False

    @field_validator("tags", mode="before")
    @classmethod
    def clean_tags(cls, v: list[str] | None) -> list[str]:
        if not v:
            return []
        return [t.strip().lower() for t in v if t.strip()]

    @field_validator("cover_image_url", mode="before")
    @classmethod
    def clean_cover(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v if v else None

    @field_validator("category", mode="before")
    @classmethod
    def clean_category(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        return v if v else None


# ── Create ────────────────────────────────────────────────────────────────────
class BlogCreate(BlogBase):
    slug: str | None = Field(
        None,
        max_length=320,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="Tự generate từ title nếu để trống",
    )
    reading_time_minutes: int | None = Field(
        None, ge=1,
        description="Tự tính từ content (~200 words/min) nếu để trống",
    )


# ── Update ────────────────────────────────────────────────────────────────────
class BlogUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=300)
    slug: str | None = Field(None, max_length=320, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    excerpt: str | None = Field(None, min_length=1, max_length=600)
    content: str | None = Field(None, min_length=1)
    cover_image_url: str | None = Field(None, max_length=500)
    tags: list[str] | None = None
    category: str | None = Field(None, max_length=100)
    reading_time_minutes: int | None = Field(None, ge=1)
    meta_title: str | None = Field(None, max_length=70)
    meta_description: str | None = Field(None, max_length=160)
    status: BlogStatus | None = None
    is_featured: bool | None = None

    @field_validator("tags", mode="before")
    @classmethod
    def clean_tags(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return None
        return [t.strip().lower() for t in v if t.strip()]


# ── Response ──────────────────────────────────────────────────────────────────
class BlogResponse(BlogBase):
    id: uuid.UUID
    slug: str
    reading_time_minutes: int
    view_count: int
    like_count: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class BlogPublicResponse(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    excerpt: str
    content: str
    cover_image_url: str | None
    tags: list[str]
    category: str | None
    reading_time_minutes: int
    meta_title: str | None
    meta_description: str | None
    is_featured: bool
    view_count: int
    like_count: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class BlogCardResponse(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    excerpt: str
    cover_image_url: str | None
    tags: list[str]
    category: str | None
    reading_time_minutes: int
    is_featured: bool
    view_count: int
    like_count: int
    created_at: datetime
    model_config = {"from_attributes": True}

class BlogListResponse(BaseModel):
    items: list[BlogCardResponse]
    total: int
    page: int
    page_size: int
    total_pages: int