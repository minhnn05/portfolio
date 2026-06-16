from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────────
    APP_NAME: str = "Portfolio API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    # ── Security ─────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # ── Admin credentials ────────────────────────────────
    ADMIN_EMAIL: str
    ADMIN_PASSWORD: str

    # ── Supabase ─────────────────────────────────────────
    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_SERVICE_KEY: str

    # ── Database (Supabase PostgreSQL) ───────────────────
    DATABASE_URL: str 

    # ── Email (Gmail SMTP) ───────────────────────────────
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str = ""
    MAIL_PORT: int = 587
    MAIL_SERVER: str = "smtp.gmail.com"

    # ── CORS ─────────────────────────────────────────────
    FRONTEND_URL: str = "http://localhost:5173"

    # ── Trusted hosts (production) ───────────────────────
    ALLOWED_HOSTS: list[str] = ["localhost", "127.0.0.1"]

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


@lru_cache
def get_settings() -> Settings:
    return Settings()