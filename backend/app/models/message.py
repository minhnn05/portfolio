import uuid
from datetime import datetime
from sqlalchemy import String, Text, Boolean, Enum as SAEnum, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
import enum
from app.config.database import Base
from app.models.base import TimestampMixin

class MessageStatus(str, enum.Enum):
    UNREAD   = "unread"   
    READ     = "read"      
    REPLIED  = "replied"   
    ARCHIVED = "archived"  
    SPAM     = "spam"     


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    # ── Primary key ──────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ── Sender info ──────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        comment="Họ tên người gửi",
    )
    email: Mapped[str] = mapped_column(
        String(320),
        nullable=False,
        index=True,
        comment="Email người gửi — validate format trên Pydantic schema",
    )
    company: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
        comment="Tên công ty / tổ chức (optional)",
    )
    phone: Mapped[str | None] = mapped_column(
        String(20),
        nullable=True,
        comment="Số điện thoại (optional)",
    )

    # ── Message content ──────────────────────────────────────────────────────
    subject: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
        comment="Tiêu đề / chủ đề tin nhắn",
    )
    body: Mapped[str] = mapped_column(
        Text,
        nullable=False,
        comment="Nội dung đầy đủ của tin nhắn",
    )

    # ── Status & tracking ────────────────────────────────────────────────────
    status: Mapped[MessageStatus] = mapped_column(
        SAEnum(MessageStatus, name="message_status"),
        default=MessageStatus.UNREAD,
        nullable=False,
        index=True,
        comment="Trạng thái xử lý — hiển thị trong admin dashboard",
    )
    is_starred: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        comment="Đánh dấu quan trọng trong admin",
    )

    # ── Reply tracking ───────────────────────────────────────────────────────
    replied_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        comment="Timestamp khi admin reply",
    )
    reply_note: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
        comment="Ghi chú nội bộ của admin (không gửi cho người dùng)",
    )

    # ── Anti-spam metadata ───────────────────────────────────────────────────
    ip_address: Mapped[str | None] = mapped_column(
        String(45),
        nullable=True,
        comment="IP người gửi — dùng để detect spam (IPv6 max 45 chars)",
    )
    user_agent: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="User-Agent header của request",
    )

    def __repr__(self) -> str:
        return f"<Message id={self.id} from={self.email!r} status={self.status}>"