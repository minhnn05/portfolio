import uuid
from sqlalchemy import String, Integer, Enum as SAEnum, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column
import enum
from app.config.database import Base
from app.models.base import TimestampMixin

class SkillCategory(str, enum.Enum):
    FRONTEND   = "frontend"    
    BACKEND    = "backend"     
    DATABASE   = "database"   
    DEVOPS     = "devops"      
    LANGUAGE   = "language"   
    TOOL       = "tool"        
    AI_ML      = "ai_ml"      
    OTHER      = "other"      


class ProficiencyLevel(str, enum.Enum):
    BEGINNER     = "beginner"     
    INTERMEDIATE = "intermediate"  
    ADVANCED     = "advanced"     
    EXPERT       = "expert"       


class Skill(Base, TimestampMixin):
    __tablename__ = "skills"
    __table_args__ = (
        CheckConstraint(
            "proficiency_percent >= 0 AND proficiency_percent <= 100",
            name="ck_skill_proficiency_percent",
        ),
    )

    # ── Primary key ──────────────────────────────────────────────────────────
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # ── Core info ────────────────────────────────────────────────────────────
    name: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False,
        comment="Tên công nghệ: 'React', 'FastAPI', 'PostgreSQL'",
    )
    category: Mapped[SkillCategory] = mapped_column(
        SAEnum(SkillCategory, name="skill_category"),
        nullable=False,
        index=True,
        comment="Nhóm kỹ năng để group trên trang Skills",
    )
    proficiency: Mapped[ProficiencyLevel] = mapped_column(
        SAEnum(ProficiencyLevel, name="proficiency_level"),
        default=ProficiencyLevel.INTERMEDIATE,
        nullable=False,
        comment="Mức độ thành thạo — hiển thị dạng badge trên FE",
    )

    # ── Display ──────────────────────────────────────────────────────────────
    proficiency_percent: Mapped[int] = mapped_column(
        Integer,
        default=50,
        nullable=False,
        comment="Phần trăm thành thạo 0-100 — dùng cho progress bar trên FE",
    )
    icon_url: Mapped[str | None] = mapped_column(
        String(500),
        nullable=True,
        comment="URL icon SVG (devicons, simple-icons) hoặc Supabase Storage",
    )
    icon_name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True,
        comment="Tên icon theo devicons convention: 'react', 'python', 'postgresql'",
    )
    color: Mapped[str | None] = mapped_column(
        String(7),
        nullable=True,
        comment="Hex color code brand: '#61DAFB' cho React, '#3776AB' cho Python",
    )
    sort_order: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
        comment="Thứ tự trong nhóm — số nhỏ hơn hiện trước",
    )

    # ── Extra context ────────────────────────────────────────────────────────
    years_of_experience: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        comment="Số năm kinh nghiệm với công nghệ này",
    )
    description: Mapped[str | None] = mapped_column(
        String(300),
        nullable=True,
        comment="Mô tả ngắn: đã dùng ở đâu, làm gì với công nghệ này",
    )

    def __repr__(self) -> str:
        return f"<Skill name={self.name!r} category={self.category} proficiency={self.proficiency}>"