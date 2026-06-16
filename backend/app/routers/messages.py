import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, Query, Request
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.database import get_db
from app.config.limiter import limiter
from app.middleware.auth_middleware import require_admin
from app.models.message import Message, MessageStatus
from app.schemas.message import (
    ContactFormRequest,
    ContactFormResponse,
    MessageListResponse,
    MessageReplyUpdate,
    MessageResponse,
    MessageStarUpdate,
    MessageStatusUpdate,
)
from app.services import message_service
from app.services.email_service import notify_new_message

router = APIRouter()

# ── Public ────────────────────────────────────────────────────────────────────

@router.post(
    "",
    response_model=ContactFormResponse,
    status_code=201,
    summary="Gửi liên hệ từ contact form",
    description="Rate limited: 5 requests/minute per IP.",
)
@limiter.limit("5/minute")
async def send_message(
    request: Request,
    body: ContactFormRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> ContactFormResponse:
    msg = await message_service.create_message(db, body, request)

    # gửi email notification ở background — không block response
    background_tasks.add_task(
        notify_new_message,
        name=body.name,
        email=body.email,
        subject=body.subject,
        body=body.body,
    )

    return ContactFormResponse()


# ── Admin ─────────────────────────────────────────────────────────────────────
@router.get(
    "/admin",
    response_model=MessageListResponse,
    summary="[Admin] Danh sách tin nhắn",
    dependencies=[Depends(require_admin)],
)
async def admin_list_messages(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: MessageStatus | None = Query(None),
    starred: bool = Query(False),
    db: AsyncSession = Depends(get_db),
) -> MessageListResponse:
    return await message_service.get_all_messages(
        db,
        page=page,
        page_size=page_size,
        status_filter=status,
        starred_only=starred,
    )

@router.get(
    "/admin/{message_id}",
    response_model=MessageResponse,
    summary="[Admin] Chi tiết tin nhắn (auto-mark READ)",
    dependencies=[Depends(require_admin)],
)
async def admin_get_message(
    message_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Message:
    return await message_service.get_message_by_id(db, message_id)

@router.patch(
    "/admin/{message_id}/status",
    response_model=MessageResponse,
    summary="[Admin] Đổi trạng thái tin nhắn",
    dependencies=[Depends(require_admin)],
)
async def update_message_status(
    message_id: uuid.UUID,
    body: MessageStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> Message:
    return await message_service.update_status(db, message_id, body)

@router.patch(
    "/admin/{message_id}/star",
    response_model=MessageResponse,
    summary="[Admin] Toggle starred",
    dependencies=[Depends(require_admin)],
)
async def star_message(
    message_id: uuid.UUID,
    body: MessageStarUpdate,
    db: AsyncSession = Depends(get_db),
) -> Message:
    return await message_service.update_star(db, message_id, body)

@router.patch(
    "/admin/{message_id}/reply",
    response_model=MessageResponse,
    summary="[Admin] Lưu reply note và đánh dấu REPLIED",
    dependencies=[Depends(require_admin)],
)
async def reply_message(
    message_id: uuid.UUID,
    body: MessageReplyUpdate,
    db: AsyncSession = Depends(get_db),
) -> Message:
    return await message_service.update_reply(db, message_id, body)

@router.delete(
    "/admin/{message_id}",
    status_code=204,
    summary="[Admin] Xóa tin nhắn",
    dependencies=[Depends(require_admin)],
)
async def delete_message(
    message_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Response:
    await message_service.delete_message(db, message_id)
    return Response(status_code=204)