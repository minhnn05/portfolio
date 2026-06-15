from __future__ import annotations
import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, Query
from fastapi.responses import Response
from app.config.database import get_db
from app.middleware.auth_middleware import require_admin
from app.models.blog import Blog, BlogStatus
from app.schemas.blog import (
    BlogCardResponse,
    BlogCreate,
    BlogListResponse,
    BlogPublicResponse,
    BlogResponse,
    BlogUpdate,
)
from app.services import blog_service
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# ── Public ────────────────────────────────────────────────────────────────────
@router.get(
    "",
    response_model=BlogListResponse,
    summary="Danh sách bài viết published",
)
async def list_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    tag: str | None = Query(None),
    category: str | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> BlogListResponse:
    return await blog_service.get_published_blogs(
        db, page=page, page_size=page_size, tag=tag, category=category
    )

@router.get(
    "/featured",
    response_model=list[BlogCardResponse],
    summary="Featured blogs",
)
async def featured_blogs(
    db: AsyncSession = Depends(get_db),
) -> list[Blog]:
    result = await blog_service.get_published_blogs(
        db, page=1, page_size=4, featured_only=True
    )
    return result.items

@router.get(
    "/{slug}",
    response_model=BlogPublicResponse,
    summary="Chi tiết bài viết theo slug",
)
async def get_blog(
    slug: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> Blog:
    blog = await blog_service.get_blog_by_slug(db, slug)
    background_tasks.add_task(blog_service.increment_blog_view, db, slug)
    return blog

@router.post(
    "/{slug}/like",
    summary="Like bài viết (anonymous)",
)
async def like_blog(
    slug: str,
    db: AsyncSession = Depends(get_db),
) -> dict:
    new_count = await blog_service.increment_like(db, slug)
    return {"like_count": new_count}

# ── Admin ─────────────────────────────────────────────────────────────────────
@router.get(
    "/admin/list",
    response_model=BlogListResponse,
    summary="[Admin] Tất cả bài viết",
    dependencies=[Depends(require_admin)],
)
async def admin_list_blogs(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    status: BlogStatus | None = Query(None),
    db: AsyncSession = Depends(get_db),
) -> BlogListResponse:
    return await blog_service.get_all_blogs(
        db, page=page, page_size=page_size, status_filter=status
    )

@router.post(
    "/admin",
    response_model=BlogResponse,
    status_code=201,
    summary="[Admin] Tạo bài viết mới",
    dependencies=[Depends(require_admin)],
)
async def create_blog(
    body: BlogCreate,
    db: AsyncSession = Depends(get_db),
) -> Blog:
    return await blog_service.create_blog(db, body)

@router.get(
    "/admin/{blog_id}",
    response_model=BlogResponse,
    summary="[Admin] Chi tiết bài viết theo ID",
    dependencies=[Depends(require_admin)],
)
async def admin_get_blog(
    blog_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Blog:
    return await blog_service.get_blog_by_id(db, blog_id)

@router.put(
    "/admin/{blog_id}",
    response_model=BlogResponse,
    summary="[Admin] Cập nhật bài viết",
    dependencies=[Depends(require_admin)],
)
async def update_blog(
    blog_id: uuid.UUID,
    body: BlogUpdate,
    db: AsyncSession = Depends(get_db),
) -> Blog:
    return await blog_service.update_blog(db, blog_id, body)

@router.delete(
    "/admin/{blog_id}",
    status_code=204,
    summary="[Admin] Xóa bài viết",
    dependencies=[Depends(require_admin)],
)
async def delete_blog(
    blog_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Response:
    await blog_service.delete_blog(db, blog_id)
    return Response(status_code=204)