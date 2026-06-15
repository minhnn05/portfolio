from __future__ import annotations
import uuid
from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, Field, HttpUrl, field_validator, model_validator
from app.models.project import ProjectStatus, ProjectType

def _normalize_url(v: str | None) -> str | None:
    if v is None:
        return None
    v = v.strip()
    return v if v else None


class ProjectBase(BaseModel):
    title: Annotated[str, Field(min_length=1, max_length=200)]
    summary: Annotated[str, Field(min_length=1, max_length=500)]
    description: Annotated[str, Field(min_length=1)]
    thumbnail_url: str | None = Field(None, max_length=500)
    images: list[str] | None = None
    demo_video_url: str | None = Field(None, max_length=500)
    github_url: str | None = Field(None, max_length=500)
    live_url: str | None = Field(None, max_length=500)
    tech_stack: Annotated[list[str], Field(min_length=1)] = Field(
        description="Ít nhất 1 công nghệ"
    )
    tags: list[str] | None = None
    status: ProjectStatus = ProjectStatus.COMPLETED
    project_type: ProjectType = ProjectType.PERSONAL
    is_featured: bool = False
    is_published: bool = True
    sort_order: int = Field(0, ge=0)
    github_stars: int | None = Field(None, ge=0)

    @field_validator("thumbnail_url", "demo_video_url", "github_url", "live_url", mode="before")
    @classmethod
    def clean_url(cls, v: str | None) -> str | None:
        return _normalize_url(v)

    @field_validator("tech_stack", mode="before")
    @classmethod
    def clean_tech_stack(cls, v: list[str]) -> list[str]:
        return [t.strip() for t in v if t.strip()]

    @field_validator("tags", mode="before")
    @classmethod
    def clean_tags(cls, v: list[str] | None) -> list[str] | None:
        if v is None:
            return None
        cleaned = [t.strip().lower() for t in v if t.strip()]
        return cleaned if cleaned else None


# ── Create ────────────────────────────────────────────────────────────────────
class ProjectCreate(ProjectBase):
    slug: str | None = Field(
        None,
        max_length=220,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
        description="Tự generate nếu để trống",
    )


# ── Update ────────────────────────────────────────────────────────────────────
class ProjectUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    slug: str | None = Field(None, max_length=220, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    summary: str | None = Field(None, min_length=1, max_length=500)
    description: str | None = Field(None, min_length=1)
    thumbnail_url: str | None = Field(None, max_length=500)
    images: list[str] | None = None
    demo_video_url: str | None = Field(None, max_length=500)
    github_url: str | None = Field(None, max_length=500)
    live_url: str | None = Field(None, max_length=500)
    tech_stack: list[str] | None = None
    tags: list[str] | None = None
    status: ProjectStatus | None = None
    project_type: ProjectType | None = None
    is_featured: bool | None = None
    is_published: bool | None = None
    sort_order: int | None = Field(None, ge=0)
    github_stars: int | None = Field(None, ge=0)

    @field_validator("thumbnail_url", "demo_video_url", "github_url", "live_url", mode="before")
    @classmethod
    def clean_url(cls, v: str | None) -> str | None:
        return _normalize_url(v)


# ── Response ──────────────────────────────────────────────────────────────────
class ProjectResponse(ProjectBase):
    id: uuid.UUID
    slug: str
    view_count: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}


class ProjectPublicResponse(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    summary: str
    description: str
    thumbnail_url: str | None
    images: list[str] | None
    demo_video_url: str | None
    github_url: str | None
    live_url: str | None
    tech_stack: list[str]
    tags: list[str] | None
    status: ProjectStatus
    project_type: ProjectType
    is_featured: bool
    sort_order: int
    github_stars: int | None
    view_count: int
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class ProjectListResponse(BaseModel):
    items: list[ProjectPublicResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
