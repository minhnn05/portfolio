from __future__ import annotations
import math
import uuid
from datetime import datetime, timezone
from fastapi import HTTPException, Request, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.message import Message, MessageStatus
from app.schemas.message import (
    ContactFormRequest,
    MessageListResponse,
    MessageReplyUpdate,
    MessageStarUpdate,
    MessageStatusUpdate,
)

# ── Helpers ───────────────────────────────────────────────────────────────────
async def _get_or_404(db: AsyncSession, message_id: uuid.UUID) -> Message:
    result = await db.execute(select(Message).where(Message.id == message_id))
    msg = result.scalar_one_or_none()
    if msg is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tin nhắn không tồn tại")
    return msg

# ── Public ────────────────────────────────────────────────────────────────────
async def create_message(
    db: AsyncSession,
    data: ContactFormRequest,
    request: Request | None = None,
) -> Message:
    ip_address: str | None = None
    user_agent: str | None = None

    if request:
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            ip_address = forwarded_for.split(",")[0].strip()
        else:
            ip_address = request.client.host if request.client else None

        user_agent = request.headers.get("User-Agent")

    msg = Message(
        **data.model_dump(),
        ip_address=ip_address,
        user_agent=user_agent,
        status=MessageStatus.UNREAD,
    )
    db.add(msg)
    await db.flush()
    await db.refresh(msg)
    return msg


# ── Admin queries ─────────────────────────────────────────────────────────────
async def get_all_messages(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    status_filter: MessageStatus | None = None,
    starred_only: bool = False,
) -> MessageListResponse:
    stmt = select(Message)
    if status_filter:
        stmt = stmt.where(Message.status == status_filter)
    if starred_only:
        stmt = stmt.where(Message.is_starred == True)  # noqa: E712

    stmt = stmt.order_by(Message.created_at.desc())

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    unread_result = await db.execute(
        select(func.count()).where(Message.status == MessageStatus.UNREAD)
    )
    unread_count = unread_result.scalar_one()

    offset = (page - 1) * page_size
    messages = (await db.execute(stmt.offset(offset).limit(page_size))).scalars().all()

    return MessageListResponse(
        items=messages,
        total=total,
        unread_count=unread_count,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )

async def get_message_by_id(db: AsyncSession, message_id: uuid.UUID) -> Message:
    msg = await _get_or_404(db, message_id)
    if msg.status == MessageStatus.UNREAD:
        msg.status = MessageStatus.READ
        await db.flush()
    return msg


async def update_status(
    db: AsyncSession,
    message_id: uuid.UUID,
    data: MessageStatusUpdate,
) -> Message:
    msg = await _get_or_404(db, message_id)
    msg.status = data.status

    if data.status == MessageStatus.REPLIED and msg.replied_at is None:
        msg.replied_at = datetime.now(timezone.utc)
    await db.flush()
    await db.refresh(msg)
    return msg

async def update_star(
    db: AsyncSession,
    message_id: uuid.UUID,
    data: MessageStarUpdate,
) -> Message:
    msg = await _get_or_404(db, message_id)
    msg.is_starred = data.is_starred
    await db.flush()
    await db.refresh(msg)
    return msg

async def update_reply(
    db: AsyncSession,
    message_id: uuid.UUID,
    data: MessageReplyUpdate,
) -> Message:
    msg = await _get_or_404(db, message_id)
    msg.reply_note = data.reply_note
    msg.replied_at = datetime.now(timezone.utc)
    msg.status = MessageStatus.REPLIED
    await db.flush()
    await db.refresh(msg)
    return msg

async def delete_message(db: AsyncSession, message_id: uuid.UUID) -> None:
    msg = await _get_or_404(db, message_id)
    await db.delete(msg)
    await db.flush()