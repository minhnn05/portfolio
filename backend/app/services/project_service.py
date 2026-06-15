from __future__ import annotations
import math
import uuid
from typing import Sequence
from fastapi import HTTPException, status
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectListResponse, ProjectUpdate
from app.utils.slug import slugify, unique_slug

# ── Helpers ───────────────────────────────────────────────────────────────────
async def _slug_exists(db: AsyncSession, slug: str) -> bool:
    result = await db.execute(select(Project.id).where(Project.slug == slug))
    return result.scalar_one_or_none() is not None

async def _get_or_404(db: AsyncSession, project_id: uuid.UUID) -> Project:
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project không tồn tại")
    return project

# ── Public queries ────────────────────────────────────────────────────────────
async def get_published_projects(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 12,
    tech: str | None = None,
    tag: str | None = None,
    featured_only: bool = False,
) -> ProjectListResponse:
    stmt = select(Project).where(Project.is_published == True)  

    if featured_only:
        stmt = stmt.where(Project.is_featured == True)  
    if tech:
        stmt = stmt.where(Project.tech_stack.any(tech))
    if tag:
        stmt = stmt.where(Project.tags.any(tag))

    stmt = stmt.order_by(Project.sort_order.asc(), Project.created_at.desc())

    # total count
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    # paginate
    offset = (page - 1) * page_size
    projects = (await db.execute(stmt.offset(offset).limit(page_size))).scalars().all()

    return ProjectListResponse(
        items=projects,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )

async def get_project_by_slug(db: AsyncSession, slug: str) -> Project:
    result = await db.execute(
        select(Project).where(Project.slug == slug, Project.is_published == True)  
    )
    project = result.scalar_one_or_none()
    if project is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project không tồn tại")
    return project

async def increment_view(db: AsyncSession, slug: str) -> None:
    await db.execute(
        update(Project)
        .where(Project.slug == slug)
        .values(view_count=Project.view_count + 1)
    )
    await db.commit()

# ── Admin CRUD ────────────────────────────────────────────────────────────────
async def get_all_projects(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 20,
) -> ProjectListResponse:
    stmt = select(Project).order_by(Project.sort_order.asc(), Project.created_at.desc())

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = (await db.execute(count_stmt)).scalar_one()

    offset = (page - 1) * page_size
    projects = (await db.execute(stmt.offset(offset).limit(page_size))).scalars().all()

    return ProjectListResponse(
        items=projects,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=math.ceil(total / page_size) if total else 1,
    )

async def get_project_by_id(db: AsyncSession, project_id: uuid.UUID) -> Project:
    return await _get_or_404(db, project_id)

async def create_project(db: AsyncSession, data: ProjectCreate) -> Project:
    if data.slug:
        if await _slug_exists(db, data.slug):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{data.slug}' đã tồn tại",
            )
        slug = data.slug
    else:
        slug = await unique_slug(
            data.title,
            exists_fn=lambda s: _slug_exists(db, s),
        )

    payload = data.model_dump(exclude={"slug"})
    project = Project(**payload, slug=slug)
    db.add(project)
    await db.flush()
    await db.refresh(project)
    return project

async def update_project(
    db: AsyncSession,
    project_id: uuid.UUID,
    data: ProjectUpdate,
) -> Project:
    project = await _get_or_404(db, project_id)

    changes = data.model_dump(exclude_unset=True)

    if "slug" in changes and changes["slug"] != project.slug:
        if await _slug_exists(db, changes["slug"]):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Slug '{changes['slug']}' đã tồn tại",
            )

    if "title" in changes and "slug" not in changes:
        changes["slug"] = await unique_slug(
            changes["title"],
            exists_fn=lambda s: _slug_exists(db, s),
        )

    for field, value in changes.items():
        setattr(project, field, value)

    await db.flush()
    await db.refresh(project)
    return project

async def delete_project(db: AsyncSession, project_id: uuid.UUID) -> None:
    project = await _get_or_404(db, project_id)
    await db.delete(project)
    await db.flush()