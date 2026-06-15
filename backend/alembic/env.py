import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# ── Thêm backend/ vào sys.path để import app ─────────────────────────────────
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# ── Load .env trước khi import settings ──────────────────────────────────────
from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"))

# ── Import Base + tất cả models để autogenerate nhận diện được ───────────────
from app.config.database import Base
import app.models  # noqa: F401 — register all models vào Base.metadata

# ── Import settings để lấy DATABASE_URL ──────────────────────────────────────
from app.config.settings import get_settings
settings = get_settings()

# ── Alembic config ────────────────────────────────────────────────────────────
config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# Alembic cần sync URL (psycopg2), không phải asyncpg
# Đổi postgresql+asyncpg:// → postgresql+psycopg2://
_db_url = settings.DATABASE_URL.replace(
    "postgresql+asyncpg://", "postgresql+psycopg2://"
).replace(
    "postgresql://", "postgresql+psycopg2://"
)
config.set_main_option("sqlalchemy.url", _db_url)


def run_migrations_offline() -> None:
    """Offline mode — generate SQL script không cần kết nối DB."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Online mode — kết nối thực tế và chạy migration."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,       # detect column type changes
            compare_server_default=True,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
