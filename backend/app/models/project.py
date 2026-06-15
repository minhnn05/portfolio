import uuid
from sqlalchemy import String, Text, Boolean, Integer, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
import enum

from app.config.database import Base
from app.models.base import TimestampMixin


class ProjectStatus(str, enum.Enum):
    COMPLETED   = "completed"    
    IN_PROGRESS = "in_progress"  
    ARCHIVED    = "archived"     


class ProjectType(str, enum.Enum):
    PERSONAL   = "personal"  
    TEAM       = "team"       
    FREELANCE  = "freelance"  
    OPEN_SOURCE = "open_source"


class Project(Base, TimestampMixin):
    __tablename__ = "projects"

    # ── Primary key ──────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ── Core info ────────────────────────────────────────────────────────────
    title: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
        comment="Tên dự án",
    )
    slug: Mapped[str] = mapped_column(
        String(220),
        unique=True,
        nullable=False,
        index=True,
        comment="URL-friendly identifier, tự generate từ title",
    )
    summary: Mapped[str] = mapped_column(
        String(500),
        nullable=False,
        comment="Mô tả ngắn hiển thị trên card (≤ 500 ký tự)",
    )
    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Mô tả chi tiết dạng Markdown — hiển thị trên trang detail",
    )

    # ── Media ────────────────────────────────────────────────────────────────
    thumbnail_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="URL ảnh thumbnail (Supabase Storage hoặc Cloudinary)",
    )
    images: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
        comment="Danh sách URL ảnh screenshots của dự án",
    )
    demo_video_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="URL video demo (YouTube, Loom, ...)",
    )

    # ── Links ────────────────────────────────────────────────────────────────
    github_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="Link GitHub repo",
    )
    live_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="Link live demo / production",
    )

    # ── Tech stack & metadata ────────────────────────────────────────────────
    tech_stack: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        nullable=False,
        default=list,
        comment="Danh sách công nghệ: ['React', 'FastAPI', 'PostgreSQL']",
    )
    tags: Mapped[list[str] | None] = mapped_column(
        ARRAY(String),
        nullable=True,
        comment="Tags phân loại: ['fullstack', 'ai', 'mobile']",
    )

    # ── Classification ───────────────────────────────────────────────────────
    status: Mapped[ProjectStatus] = mapped_column(
        SAEnum(ProjectStatus, name="project_status"),
        default=ProjectStatus.COMPLETED,
        nullable=False,
    )
    project_type: Mapped[ProjectType] = mapped_column(
        SAEnum(ProjectType, name="project_type"),
        default=ProjectType.PERSONAL,
        nullable=False,
    )

    # ── Display controls ─────────────────────────────────────────────────────
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Hiển thị trên trang Home (featured section)",
    )
    is_published: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        comment="Ẩn/hiện project — False thì chỉ admin mới thấy",
    )
    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Thứ tự hiển thị — số nhỏ hơn hiện trước",
    )

    # ── Stats (optional, update thủ công hoặc qua webhook) ──────────────────
    github_stars: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        comment="Số stars GitHub (sync định kỳ)",
    )
    view_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Lượt xem trang detail",
    )

    def __repr__(self) -> str:
        return f"<Project id={self.id} title={self.title!r} status={self.status}>"