from __future__ import annotations
import math
import uuid
from fastapi import HTTPException, status
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.blog import Blog, BlogStatus
from app.schemas.blog import BlogCreate, BlogListResponse, BlogUpdate
from app.utils.slug import slugify, unique_slug

# ── Helpers ───────────────────────────────────────────────────────────────────
_WORDS_PER_MINUTE = 200

def _calc_reading_time(content: str) -> int:
    return max(1, math.ceil(len(content.split()) / _WORDS_PER_MINUTE))

async def _slug_exists(db: AsyncSession, slug: str) -> bool:
    result = await db.execute(select(Blog.id).where(Blog.slug == slug))
    return result.scalar_one_or_none() is not None

async def _get_or_404(db: AsyncSession, blog_id: uuid.UUID) -> Blog:
    result = await db.execute(select(Blog).where(Blog.id == blog_id))
    blog = result.scalar_one_or_none()
    if blog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bài viết không tồn tại")
    return blog

# ── Public queries ────────────────────────────────────────────────────────────
async def get_published_blogs(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 10,
    tag: str | None = None,
    category: str | None = None,
    featured_only: bool = False,
) -> BlogListResponse:
    stmt = select(Blog).where(Blog.status == BlogStatus.PUBLISHED)

    if featured_only:
        stmt = stmt.where(Blog.is_featured == True) 
    if tag:
        stmt = stmt.where(Blog.tags.any(tag))
    if category:
        stmt = stmt.where(Blog.category == category)

    stmt = stmt.order_by(Blog.is_featured.desc(), Blog.created_at.desc())

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * page_size
    blogs = (await db.execute(stmt.offset(offset).limit(page_size))).scalars().all()

    return BlogListResponse(
        items=blogs,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )

async def get_blog_by_slug(db: AsyncSession, slug: str) -> Blog:
    result = await db.execute(
        select(Blog).where(Blog.slug == slug, Blog.status == BlogStatus.PUBLISHED)
    )
    blog = result.scalar_one_or_none()
    if blog is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bài viết không tồn tại")
    return blog


async def get_related_blogs(
    db: AsyncSession,
    blog: Blog,
    limit: int = 3,
) -> list[Blog]:
    stmt = (
        select(Blog)
        .where(
            Blog.status == BlogStatus.PUBLISHED,
            Blog.id != blog.id,
        )
        .order_by(Blog.created_at.desc())
        .limit(limit)
    )

    if blog.category:
        cat_stmt = stmt.where(Blog.category == blog.category)
        result = (await db.execute(cat_stmt)).scalars().all()
        if len(result) >= limit:
            return list(result[:limit])

    result = (await db.execute(stmt)).scalars().all()
    return list(result)

async def increment_view(db: AsyncSession, slug: str) -> None:
    await db.execute(
        update(Blog)
        .where(Blog.slug == slug)
        .values(view_count=Blog.view_count + 1)
    )
    await db.commit()

# alias used by the blogs router
increment_blog_view = increment_view


async def increment_like(db: AsyncSession, slug: str) -> int:
    await db.execute(
        update(Blog)
        .where(Blog.slug == slug, Blog.status == BlogStatus.PUBLISHED)
        .values(like_count=Blog.like_count + 1)
    )
    await db.commit()
    result = await db.execute(select(Blog.like_count).where(Blog.slug == slug))
    return result.scalar_one()


# ── Admin CRUD ────────────────────────────────────────────────────────────────
async def get_all_blogs(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
    status_filter: BlogStatus | None = None,
) -> BlogListResponse:
    stmt = select(Blog)
    if status_filter:
        stmt = stmt.where(Blog.status == status_filter)
    stmt = stmt.order_by(Blog.created_at.desc())

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * page_size
    blogs = (await db.execute(stmt.offset(offset).limit(page_size))).scalars().all()

    return BlogListResponse(
        items=blogs,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )


async def get_blog_by_id(db: AsyncSession, blog_id: uuid.UUID) -> Blog:
    return await _get_or_404(db, blog_id)


async def create_blog(db: AsyncSession, data: BlogCreate) -> Blog:
    if data.slug:
        if await _slug_exists(db, data.slug):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{data.slug}' đã tồn tại",
            )
        slug = data.slug
    else:
        slug = await unique_slug(data.title, exists_fn=lambda s: _slug_exists(db, s))

    reading_time = data.reading_time_minutes or _calc_reading_time(data.content)

    payload = data.model_dump(exclude={"slug", "reading_time_minutes"})
    blog = Blog(**payload, slug=slug, reading_time_minutes=reading_time)
    db.add(blog)
    await db.flush()
    await db.refresh(blog)
    return blog


async def update_blog(
    db: AsyncSession,
    blog_id: uuid.UUID,
    data: BlogUpdate,
) -> Blog:
    blog = await _get_or_404(db, blog_id)
    changes = data.model_dump(exclude_unset=True)

    if "slug" in changes and changes["slug"] != blog.slug:
        if await _slug_exists(db, changes["slug"]):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{changes['slug']}' đã tồn tại",
            )

    if "title" in changes and "slug" not in changes:
        changes["slug"] = await unique_slug(
            changes["title"], exists_fn=lambda s: _slug_exists(db, s)
        )

    if "content" in changes and "reading_time_minutes" not in changes:
        changes["reading_time_minutes"] = _calc_reading_time(changes["content"])

    for field, value in changes.items():
        setattr(blog, field, value)

    await db.flush()
    await db.refresh(blog)
    return blog

async def delete_blog(db: AsyncSession, blog_id: uuid.UUID) -> None:
    blog = await _get_or_404(db, blog_id)
    await db.delete(blog)
    await db.flush()