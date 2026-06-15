from __future__ import annotations
import uuid
from collections import defaultdict
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.skill import Skill, SkillCategory
from app.schemas.skill import SkillCreate, SkillGroupResponse, SkillUpdate

# ── Helpers ───────────────────────────────────────────────────────────────────
async def _get_or_404(db: AsyncSession, skill_id: uuid.UUID) -> Skill:
    result = await db.execute(select(Skill).where(Skill.id == skill_id))
    skill = result.scalar_one_or_none()
    if skill is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Skill không tồn tại")
    return skill


# ── Public queries ────────────────────────────────────────────────────────────
async def get_all_skills(db: AsyncSession) -> list[Skill]:
    result = await db.execute(
        select(Skill).order_by(Skill.category.asc(), Skill.sort_order.asc(), Skill.name.asc())
    )
    return list(result.scalars().all())


async def get_skills_grouped(db: AsyncSession) -> list[SkillGroupResponse]:
    skills = await get_all_skills(db)

    groups: dict[SkillCategory, list[Skill]] = defaultdict(list)
    for skill in skills:
        groups[skill.category].append(skill)

    return [
        SkillGroupResponse(category=category, skills=skill_list)
        for category, skill_list in groups.items()
    ]


async def get_skills_by_category(db: AsyncSession, category: SkillCategory) -> list[Skill]:
    result = await db.execute(
        select(Skill)
        .where(Skill.category == category)
        .order_by(Skill.sort_order.asc(), Skill.name.asc())
    )
    return list(result.scalars().all())


# ── Admin CRUD ────────────────────────────────────────────────────────────────
async def get_skill_by_id(db: AsyncSession, skill_id: uuid.UUID) -> Skill:
    return await _get_or_404(db, skill_id)


async def create_skill(db: AsyncSession, data: SkillCreate) -> Skill:
    existing = await db.execute(
        select(Skill).where(Skill.name.ilike(data.name.strip()))
    )
    if existing.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Skill '{data.name}' đã tồn tại",
        )

    skill = Skill(**data.model_dump())
    db.add(skill)
    await db.flush()
    await db.refresh(skill)
    return skill


async def update_skill(
    db: AsyncSession,
    skill_id: uuid.UUID,
    data: SkillUpdate,
) -> Skill:
    skill = await _get_or_404(db, skill_id)
    changes = data.model_dump(exclude_unset=True)

    if "name" in changes and changes["name"].strip().lower() != skill.name.lower():
        existing = await db.execute(
            select(Skill).where(Skill.name.ilike(changes["name"].strip()))
        )
        if existing.scalar_one_or_none():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Skill '{changes['name']}' đã tồn tại",
            )

    for field, value in changes.items():
        setattr(skill, field, value)

    await db.flush()
    await db.refresh(skill)
    return skill


async def delete_skill(db: AsyncSession, skill_id: uuid.UUID) -> None:
    skill = await _get_or_404(db, skill_id)
    await db.delete(skill)
    await db.flush()


async def bulk_update_sort_order(
    db: AsyncSession,
    order: list[dict],  
) -> None:
    for item in order:
        skill = await db.get(Skill, item["id"])
        if skill:
            skill.sort_order = item["sort_order"]
    await db.flush()
