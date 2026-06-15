from app.schemas.auth import LoginRequest, TokenResponse, AdminInfo
from app.schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectPublicResponse,
    ProjectListResponse,
)
from app.schemas.blog import (
    BlogCreate,
    BlogUpdate,
    BlogResponse,
    BlogPublicResponse,
    BlogCardResponse,
    BlogListResponse,
)
from app.schemas.skill import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
    SkillGroupResponse,
)
from app.schemas.message import (
    ContactFormRequest,
    ContactFormResponse,
    MessageResponse,
    MessageStatusUpdate,
    MessageStarUpdate,
    MessageReplyUpdate,
    MessageListResponse,
)

__all__ = [
    # auth
    "LoginRequest",
    "TokenResponse",
    "AdminInfo",
    # project
    "ProjectCreate",
    "ProjectUpdate",
    "ProjectResponse",
    "ProjectPublicResponse",
    "ProjectListResponse",
    # blog
    "BlogCreate",
    "BlogUpdate",
    "BlogResponse",
    "BlogPublicResponse",
    "BlogCardResponse",
    "BlogListResponse",
    # skill
    "SkillCreate",
    "SkillUpdate",
    "SkillResponse",
    "SkillGroupResponse",
    # message
    "ContactFormRequest",
    "ContactFormResponse",
    "MessageResponse",
    "MessageStatusUpdate",
    "MessageStarUpdate",
    "MessageReplyUpdate",
    "MessageListResponse",
]
