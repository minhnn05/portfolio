from __future__ import annotations
import uuid
from fastapi import APIRouter, Depends
from fastapi.responses import Response
from app.config.database import get_db
from app.middleware.auth_middleware import require_admin
from app.models.skill import Skill, SkillCategory
from app.schemas.skill import (
    SkillCreate,
    SkillGroupResponse,
    SkillResponse,
    SkillUpdate,
)
from app.services import skill_service
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

# ── Public ────────────────────────────────────────────────────────────────────
@router.get(
    "",
    response_model=list[SkillResponse],
    summary="Tất cả skills",
)
async def list_skills(
    db: AsyncSession = Depends(get_db),
) -> list[Skill]:
    return await skill_service.get_all_skills(db)


@router.get(
    "/grouped",
    response_model=list[SkillGroupResponse],
    summary="Skills gom nhóm theo category",
    description="Dùng cho trang Skills — FE nhận dạng grouped để render từng section.",
)
async def grouped_skills(
    db: AsyncSession = Depends(get_db),
) -> list[SkillGroupResponse]:
    return await skill_service.get_skills_grouped(db)


# ── Admin ─────────────────────────────────────────────────────────────────────
@router.post(
    "/admin",
    response_model=SkillResponse,
    status_code=201,
    summary="[Admin] Tạo skill mới",
    dependencies=[Depends(require_admin)],
)
async def create_skill(
    body: SkillCreate,
    db: AsyncSession = Depends(get_db),
) -> Skill:
    return await skill_service.create_skill(db, body)


@router.get(
    "/admin/{skill_id}",
    response_model=SkillResponse,
    summary="[Admin] Chi tiết skill theo ID",
    dependencies=[Depends(require_admin)],
)
async def admin_get_skill(
    skill_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Skill:
    return await skill_service.get_skill_by_id(db, skill_id)

@router.put(
    "/admin/{skill_id}",
    response_model=SkillResponse,
    summary="[Admin] Cập nhật skill",
    dependencies=[Depends(require_admin)],
)
async def update_skill(
    skill_id: uuid.UUID,
    body: SkillUpdate,
    db: AsyncSession = Depends(get_db),
) -> Skill:
    return await skill_service.update_skill(db, skill_id, body)


@router.delete(
    "/admin/{skill_id}",
    status_code=204,
    summary="[Admin] Xóa skill",
    dependencies=[Depends(require_admin)],
)
async def delete_skill(
    skill_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Response:
    await skill_service.delete_skill(db, skill_id)
    return Response(status_code=204)

@router.patch(
    "/admin/sort-order",
    status_code=204,
    summary="[Admin] Cập nhật sort order hàng loạt",
    description="Body: list of `{id: uuid, sort_order: int}` — dùng sau khi drag-and-drop.",
    dependencies=[Depends(require_admin)],
)
async def bulk_sort_order(
    body: list[dict],
    db: AsyncSession = Depends(get_db),
) -> Response:
    await skill_service.bulk_update_sort_order(db, body)
    return Response(status_code=204)