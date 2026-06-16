<div align="center">

# Nguyễn Nhật Minh — Portfolio

**Full-Stack Developer · AI / GenAI Engineer**

A full-stack portfolio website built with React + FastAPI, featuring a headless CMS-style admin panel, Markdown blogging, and a complete skills management system.

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://docs.docker.com/compose)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## Overview

Personal portfolio site with a self-hosted admin dashboard. Built from scratch — no CMS, no template. Everything from the dark-mode design system to the async backend is custom-crafted.

**Key highlights:**
- Dark-only design system with violet accent and dot-grid aesthetic
- Split-view Markdown editor for writing blog posts and project descriptions
- Full-page admin forms (no modals) with live icon/color preview for skills
- JWT auth with auto-refresh and graceful error handling
- Dockerized stack — one command to run everything

---

## Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>React 19, Vite 8, Tailwind CSS v4, React Router v7, Zustand, Axios</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>FastAPI, SQLAlchemy 2.0 (async), Alembic, Pydantic v2, slowapi</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>PostgreSQL via Supabase (asyncpg, session pooler)</td>
</tr>
<tr>
<td><strong>Auth</strong></td>
<td>JWT (python-jose), bcrypt (passlib)</td>
</tr>
<tr>
<td><strong>Storage</strong></td>
<td>Supabase Storage</td>
</tr>
<tr>
<td><strong>Deployment</strong></td>
<td>Docker, Docker Compose, Nginx (Alpine)</td>
</tr>
</table>

---

## Project Structure

```
portfolio/
├── backend/
│   ├── app/
│   │   ├── config/          # database.py, settings.py, limiter.py
│   │   ├── middleware/       # JWT auth (require_admin)
│   │   ├── models/          # SQLAlchemy ORM models
│   │   ├── routers/         # projects, blogs, skills, messages, auth
│   │   ├── schemas/         # Pydantic request/response schemas
│   │   ├── services/        # business logic layer
│   │   └── utils/           # security.py, slug.py
│   ├── alembic/             # database migrations
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/        # MarkdownEditor (split-view), Sidebar
│       │   ├── blog/         # BlogCard, BlogFilter, TagBadge
│       │   ├── common/       # Navbar, Footer, Logo, SEO, LoadingSpinner
│       │   ├── contact/      # ContactForm
│       │   ├── home/         # HeroSection, FeaturedProjects, FeaturedBlogs, SkillsPreview
│       │   ├── projects/     # ProjectCard, ProjectFilter
│       │   └── skills/       # SkillGroup, TechBadge
│       ├── hooks/            # useProjects, useBlogs, useSkills, useAuth
│       ├── pages/
│       │   ├── admin/        # Dashboard, list pages + AdminProjectForm, AdminBlogForm, AdminSkillForm
│       │   └── public/       # Home, Projects, Blog, Skills, About, Contact, 404
│       ├── router/           # AppRouter, ProtectedRoute
│       ├── services/         # axios API client layer
│       └── store/            # authStore (Zustand)
│
├── docker-compose.yml
└── README.md
```

---

## Getting Started

### Option 1 — Docker (recommended)

```bash
git clone https://github.com/nNm205/portfolio.git
cd portfolio

# Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your credentials

# Start the full stack
docker compose up -d --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |

```bash
docker compose logs -f          # stream logs
docker compose down             # stop all services
docker compose down -v          # stop + remove volumes
```

### Option 2 — Dev Mode (hot-reload)

```bash
# Starts backend + Vite dev server on port 5173
docker compose --profile dev up --build
```

Frontend hot-reload at **http://localhost:5173**

### Option 3 — Manual

**Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate        # macOS / Linux
venv\Scripts\activate           # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev                     # http://localhost:5173
```

---

## Environment Variables

Copy `backend/.env.example` → `backend/.env`:

```env
# Application
APP_NAME="My Portfolio API"
DEBUG=True
SECRET_KEY=<generate with: openssl rand -hex 32>

# Admin (single-user system)
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-secure-password

# Supabase
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_KEY=<anon-public-key>
SUPABASE_SERVICE_KEY=<service-role-key>

# Database
# ⚠️  Use port 5432 (session pooler) — NOT 6543 (transaction pooler)
# Transaction pooler breaks asyncpg prepared statements
DATABASE_URL=postgresql+asyncpg://postgres.<ref>:<password>@<host>:5432/postgres

# Email — Gmail with App Password (2FA required)
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx
MAIL_FROM=your@gmail.com
MAIL_PORT=587
MAIL_SERVER=smtp.gmail.com

# CORS
FRONTEND_URL=http://localhost:5173
```

> **Gmail App Password:** Google Account → Security → 2-Step Verification → App Passwords

---

## API Reference

### Public Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | List projects — supports `?page`, `?page_size`, `?tech` filter |
| `GET` | `/api/projects/featured` | Featured projects for homepage |
| `GET` | `/api/projects/{slug}` | Project detail + increments view count |
| `GET` | `/api/blogs` | List blog posts — supports `?tag`, `?category`, `?page` |
| `GET` | `/api/blogs/featured` | Featured posts for homepage |
| `GET` | `/api/blogs/{slug}` | Blog post detail |
| `GET` | `/api/blogs/{slug}/related` | Related posts by tags |
| `POST` | `/api/blogs/{slug}/like` | Like a post (rate limited) |
| `GET` | `/api/skills` | All skills flat list |
| `GET` | `/api/skills/grouped` | Skills grouped by category |
| `POST` | `/api/messages` | Submit contact form (rate limited) |

### Admin Endpoints — `Authorization: Bearer <token>`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/login` | Get JWT token |
| `GET` | `/api/auth/me` | Current admin info |
| `GET/POST` | `/api/projects/admin/*` | Create / list all projects |
| `GET/PUT/DELETE` | `/api/projects/admin/{id}` | Read / update / delete project |
| `GET/POST` | `/api/blogs/admin/*` | Create / list all posts |
| `GET/PUT/DELETE` | `/api/blogs/admin/{id}` | Read / update / delete post |
| `POST/PUT/DELETE` | `/api/skills/admin/*` | Full CRUD for skills |
| `GET` | `/api/messages/admin` | List contact messages |

---

## Admin Panel

### Access

Navigate to `/admin/login` — or use one of the hidden shortcuts:

| Method | Action |
|--------|--------|
| Click logo **5×** within 3 seconds | Opens admin login |
| `Ctrl + Shift + A` | Opens admin login |

### Features

| Section | Capabilities |
|---------|-------------|
| **Projects** | Full CRUD — full-page form with 2-column layout (content + metadata sidebar) |
| **Blog Posts** | Write in Markdown — split-view editor with live preview, word count, read time estimate |
| **Skills** | Visual form — progress bar slider, live SimpleIcons preview, native color picker |
| **Messages** | Read-only inbox for contact form submissions |

### Markdown Editor Modes

| Mode | Description |
|------|-------------|
| `Write` | Plain textarea only |
| `Preview` | Rendered output only |
| `Split` | Editor left · live preview right — default in full-page forms |

---

## Database Migrations

```bash
cd backend

# Generate migration from model changes
alembic revision --autogenerate -m "add column X to table Y"

# Apply all pending migrations
alembic upgrade head

# Rollback one step
alembic downgrade -1

# Check current revision
alembic current
```

---

## Design System

The frontend uses a custom dark-only design system built on Tailwind CSS v4.

| Token | Value | Usage |
|-------|-------|-------|
| Background | `zinc-950` (`#09090b`) | Page background |
| Surface | `zinc-900` (`#18181b`) | Cards, modals |
| Border | `zinc-800` (`#27272a`) | Dividers, card borders |
| Primary accent | `violet-600` / `violet-500` | CTAs, active states, glows |
| Gradient | `violet-400 → cyan-400` | Hero text, logo |
| Body text | `zinc-100` | Primary content |
| Muted text | `zinc-400` / `zinc-500` | Secondary content |

**Signature patterns:**
- Dot-grid background (`radial-gradient` at `28px × 28px`) on hero sections
- Violet radial top glow on all page headers
- `rounded-2xl` cards with `hover:border-violet-500/40` + `hover:shadow-violet-950/30`
- Monospace font (`JetBrains Mono`) for section indexes and metadata

---

## Deployment

Update these values before deploying to production:

**`docker-compose.yml`**
```yaml
frontend:
  build:
    args:
      VITE_API_URL: https://api.yourdomain.com/api
```

**`backend/.env`**
```env
DEBUG=False
FRONTEND_URL=https://yourdomain.com
ALLOWED_HOSTS=["yourdomain.com", "api.yourdomain.com"]
```

---

## Contact

**Nguyễn Nhật Minh**
- Email: [minh2m5@gmail.com](mailto:minh2m5@gmail.com)
- GitHub: [github.com/nNm205](https://github.com/nNm205)
- LinkedIn: [linkedin.com/in/minh-dev](https://linkedin.com/in/minh-dev)
