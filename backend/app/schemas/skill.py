from __future__ import annotations
import re
import uuid
from datetime import datetime
from typing import Annotated
from pydantic import BaseModel, Field, field_validator
from app.models.skill import ProficiencyLevel, SkillCategory

_HEX_COLOR_RE = re.compile(r"^#[0-9A-Fa-f]{6}$")

class SkillBase(BaseModel):
    name: Annotated[str, Field(min_length=1, max_length=100)]
    category: SkillCategory
    proficiency: ProficiencyLevel = ProficiencyLevel.INTERMEDIATE
    proficiency_percent: Annotated[int, Field(ge=0, le=100)] = 50
    icon_url: str | None = Field(None, max_length=500)
    icon_name: str | None = Field(None, max_length=100)
    color: str | None = Field(
        None,
        max_length=7,
        description="Hex color code, ví dụ: '#61DAFB'",
    )
    sort_order: int = Field(0, ge=0)
    years_of_experience: int | None = Field(None, ge=0, le=50)
    description: str | None = Field(None, max_length=300)

    @field_validator("name", mode="before")
    @classmethod
    def clean_name(cls, v: str) -> str:
        return v.strip()

    @field_validator("color", mode="before")
    @classmethod
    def validate_color(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        if not v:
            return None
        if not _HEX_COLOR_RE.match(v):
            raise ValueError("color phải là hex code hợp lệ, ví dụ: '#61DAFB'")
        return v

    @field_validator("icon_name", mode="before")
    @classmethod
    def clean_icon_name(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip().lower()
        return v if v else None


# ── Create ────────────────────────────────────────────────────────────────────
class SkillCreate(SkillBase):
    pass

# ── Update ────────────────────────────────────────────────────────────────────
class SkillUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=100)
    category: SkillCategory | None = None
    proficiency: ProficiencyLevel | None = None
    proficiency_percent: int | None = Field(None, ge=0, le=100)
    icon_url: str | None = Field(None, max_length=500)
    icon_name: str | None = Field(None, max_length=100)
    color: str | None = Field(None, max_length=7)
    sort_order: int | None = Field(None, ge=0)
    years_of_experience: int | None = Field(None, ge=0, le=50)
    description: str | None = Field(None, max_length=300)

    @field_validator("color", mode="before")
    @classmethod
    def validate_color(cls, v: str | None) -> str | None:
        if v is None:
            return None
        v = v.strip()
        if not v:
            return None
        if not _HEX_COLOR_RE.match(v):
            raise ValueError("color phải là hex code hợp lệ, ví dụ: '#61DAFB'")
        return v

# ── Response ──────────────────────────────────────────────────────────────────
class SkillResponse(SkillBase):
    id: uuid.UUID
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}

class SkillGroupResponse(BaseModel):
    category: SkillCategory
    skills: list[SkillResponse]