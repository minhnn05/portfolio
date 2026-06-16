import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.config.settings import get_settings
from app.config.database import connect_db, disconnect_db, create_tables
from app.config.limiter import limiter  # shared instance — imported by routers
import app.models  # noqa: F401

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)-8s | %(name)s — %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)
settings = get_settings()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    logger.info(f"🚀 Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    logger.info(f"   Mode  : {'DEBUG' if settings.DEBUG else 'PRODUCTION'}")
    logger.info(f"   Prefix: {settings.API_PREFIX}")

    await connect_db()

    if settings.DEBUG:
        # Dev only: auto-create tables. Production uses: alembic upgrade head
        await create_tables()

    logger.info("✅ Application ready")

    yield  

    # ── Shutdown ──
    logger.info("🛑 Shutting down...")
    await disconnect_db()
    logger.info("👋 Goodbye!")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "Portfolio API — Projects, Blog, Skills, Contact & Admin endpoints. "
        "Built with FastAPI + PostgreSQL (Supabase)."
    ),
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    openapi_url="/openapi.json" if settings.DEBUG else None,
    lifespan=lifespan,
)

# Attach rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS — cho phép frontend gọi API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.FRONTEND_URL,
        "http://localhost:5173",
        "http://localhost:3000",
        "https://portfolio-five-rouge-ycscr07hu2.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Cache-Control",
        "Pragma",
        "X-Requested-With",
    ],
    expose_headers=["X-Total-Count"],
    max_age=86400,   # cache preflight 24h — giảm số lượng OPTIONS requests
)

if not settings.DEBUG:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS,
    )

# ── Routers ───────────────────────────────────────────────────────────────────
from app.routers import auth, blogs, messages, projects, skills  # noqa: E402

app.include_router(auth.router,     prefix=f"{settings.API_PREFIX}/auth",     tags=["Auth"])
app.include_router(projects.router, prefix=f"{settings.API_PREFIX}/projects", tags=["Projects"])
app.include_router(blogs.router,    prefix=f"{settings.API_PREFIX}/blogs",    tags=["Blogs"])
app.include_router(skills.router,   prefix=f"{settings.API_PREFIX}/skills",   tags=["Skills"])
app.include_router(messages.router, prefix=f"{settings.API_PREFIX}/messages", tags=["Messages"])

@app.get("/", tags=["Health"], summary="Root")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"], summary="Health check")
async def health_check():
    from sqlalchemy import text
    from app.config.database import AsyncSessionLocal

    db_status = "ok"
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
    except Exception as e:
        logger.warning(f"Health check DB failed: {e}")
        db_status = "error"

    status_code = 200 if db_status == "ok" else 503
    return JSONResponse(
        status_code=status_code,
        content={
            "status": "healthy" if db_status == "ok" else "unhealthy",
            "database": db_status,
            "version": settings.APP_VERSION,
        },
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception on {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "path": str(request.url),
        },
    )