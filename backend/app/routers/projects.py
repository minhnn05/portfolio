from __future__ import annotations
import uuid
from fastapi import APIRouter, BackgroundTasks, Depends, Query
from fastapi.responses import Response
from app.config.database import get_db
from app.middleware.auth_middleware import require_admin
from app.models.project import Project
from app.schemas.project import (
    ProjectCreate,
    ProjectListResponse,
    ProjectPublicResponse,
    ProjectResponse,
    ProjectUpdate,
)
from app.services import project_service
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# ── Public ────────────────────────────────────────────────────────────────────
@router.get(
    "",
    response_model=ProjectListResponse,
    summary="Danh sách projects",
)
async def list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=50),
    tech: str | None = Query(None, description="Filter theo tech stack"),
    tag: str | None = Query(None, description="Filter theo tag"),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    return await project_service.get_published_projects(
        db, page=page, page_size=page_size, tech=tech, tag=tag
    )


@router.get(
    "/featured",
    response_model=list[ProjectPublicResponse],
    summary="Featured projects cho Home",
)
async def featured_projects(
    db: AsyncSession = Depends(get_db),
) -> list[Project]:
    result = await project_service.get_published_projects(
        db, page=1, page_size=6, featured_only=True
    )
    return result.items


@router.get(
    "/{slug}",
    response_model=ProjectPublicResponse,
    summary="Chi tiết project theo slug",
)
async def get_project(
    slug: str,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
) -> Project:
    project = await project_service.get_project_by_slug(db, slug)
    background_tasks.add_task(project_service.increment_project_view, db, slug)
    return project


# ── Admin ─────────────────────────────────────────────────────────────────────
@router.get(
    "/admin/list",
    response_model=ProjectListResponse,
    summary="[Admin] Tất cả projects",
    dependencies=[Depends(require_admin)],
)
async def admin_list_projects(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> ProjectListResponse:
    return await project_service.get_all_projects(db, page=page, page_size=page_size)

@router.post(
    "/admin",
    response_model=ProjectResponse,
    status_code=201,
    summary="[Admin] Tạo project mới",
    dependencies=[Depends(require_admin)],
)
async def create_project(
    body: ProjectCreate,
    db: AsyncSession = Depends(get_db),
) -> Project:
    return await project_service.create_project(db, body)

@router.get(
    "/admin/{project_id}",
    response_model=ProjectResponse,
    summary="[Admin] Chi tiết project theo ID",
    dependencies=[Depends(require_admin)],
)
async def admin_get_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Project:
    return await project_service.get_project_by_id(db, project_id)

@router.put(
    "/admin/{project_id}",
    response_model=ProjectResponse,
    summary="[Admin] Cập nhật project",
    dependencies=[Depends(require_admin)],
)
async def update_project(
    project_id: uuid.UUID,
    body: ProjectUpdate,
    db: AsyncSession = Depends(get_db),
) -> Project:
    return await project_service.update_project(db, project_id, body)

@router.delete(
    "/admin/{project_id}",
    status_code=204,
    summary="[Admin] Xóa project",
    dependencies=[Depends(require_admin)],
)
async def delete_project(
    project_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Response:
    await project_service.delete_project(db, project_id)
    return Response(status_code=204)