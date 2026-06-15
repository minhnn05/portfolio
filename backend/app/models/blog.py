import uuid
from sqlalchemy import String, Text, Boolean, Integer, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column
import enum
from app.config.database import Base
from app.models.base import TimestampMixin

class BlogStatus(str, enum.Enum):
    DRAFT     = "draft"     
    PUBLISHED = "published"
    ARCHIVED  = "archived"   


class Blog(Base, TimestampMixin):
    __tablename__ = "blogs"

    # ── Primary key ──────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ── Core content ─────────────────────────────────────────────────────────
    title: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
        comment="Tiêu đề bài viết",
    )
    slug: Mapped[str] = mapped_column(
        String(320),
        unique=True,
        nullable=False,
        index=True,
        comment="URL-friendly — tự generate từ title, dùng trong route /blog/:slug",
    )
    excerpt: Mapped[str] = mapped_column(
        String(600),
        nullable=False,
        comment="Tóm tắt ngắn hiển thị trên blog listing card",
    )
    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Nội dung đầy đủ dạng Markdown — render bằng react-markdown trên FE",
    )

    # ── Media ────────────────────────────────────────────────────────────────
    cover_image_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="URL ảnh bìa bài viết",
    )

    # ── Taxonomy ─────────────────────────────────────────────────────────────
    tags: Mapped[list[str]] = mapped_column(
        ARRAY(String),
        nullable=False,
        default=list,
        comment="Tags phân loại: ['react', 'python', 'tutorial']",
    )
    category: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        index=True,
        comment="Category chính: 'Tutorial', 'Deep Dive', 'Career', 'Review'",
    )

    # ── Reading experience ───────────────────────────────────────────────────
    reading_time_minutes: Mapped[int] = mapped_column(
        Integer,
        default=5,
        nullable=False,
        comment="Estimated read time — tự tính từ content (~200 words/min)",
    )

    # ── SEO ──────────────────────────────────────────────────────────────────
    meta_title: Mapped[str | None] = mapped_column(
        String(70),
        nullable=True,
        comment="SEO title — mặc định dùng title nếu để trống",
    )
    meta_description: Mapped[str | None] = mapped_column(
        String(160),
        nullable=True,
        comment="SEO meta description — mặc định dùng excerpt nếu để trống",
    )

    # ── Status & display ────────────────────────────────────────────────────
    status: Mapped[BlogStatus] = mapped_column(
        SAEnum(BlogStatus, name="blog_status"),
        default=BlogStatus.DRAFT,
        nullable=False,
        index=True,
    )
    is_featured: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Pin bài viết lên đầu listing",
    )

    # ── Stats ────────────────────────────────────────────────────────────────
    view_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    like_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )

    def __repr__(self) -> str:
        return f"<Blog id={self.id} slug={self.slug!r} status={self.status}>"