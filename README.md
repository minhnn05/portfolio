# Nguyễn Nhật Minh — Portfolio

Personal portfolio website của **Nguyễn Nhật Minh** — Software Engineer với focus vào AI/GenAI.

**Live:** [localhost:3000](http://localhost:3000) · **API:** [localhost:8000/docs](http://localhost:8000/docs)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4, React Router v7 |
| Backend | FastAPI, SQLAlchemy (async), Alembic |
| Database | PostgreSQL (Supabase) |
| Auth | JWT (python-jose), bcrypt |
| Storage | Supabase Storage |
| Deployment | Docker, Docker Compose, Nginx |

---

## Project Structure

```
portfolio/
├── backend/                    # FastAPI application
│   ├── app/
│   │   ├── config/             # Database, settings, rate limiter
│   │   ├── middleware/         # JWT auth middleware
│   │   ├── models/             # SQLAlchemy models
│   │   ├── routers/            # API route handlers
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   └── utils/              # Security, slug helpers
│   ├── alembic/                # Database migrations
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/                   # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # MarkdownEditor, Sidebar
│   │   │   ├── blog/           # BlogCard, BlogFilter, TagBadge
│   │   │   ├── common/         # Navbar, Footer, Logo, SEO, LoadingSpinner
│   │   │   ├── contact/        # ContactForm
│   │   │   ├── home/           # HeroSection, FeaturedProjects, FeaturedBlogs, SkillsPreview
│   │   │   ├── projects/       # ProjectCard, ProjectFilter
│   │   │   └── skills/         # SkillGroup, TechBadge
│   │   ├── hooks/              # useProjects, useBlogs, useSkills, useAuth
│   │   ├── pages/
│   │   │   ├── admin/          # Dashboard, Projects, Blogs, Skills, Messages + Form pages
│   │   │   └── public/         # Home, Projects, Blog, Skills, About, Contact, 404
│   │   ├── router/             # AppRouter, ProtectedRoute
│   │   ├── services/           # API service layer (axios)
│   │   └── store/              # Zustand auth store
│   ├── Dockerfile
│   └── nginx.conf
└── docker-compose.yml
```

---

## Quick Start

### Chạy với Docker (recommended)

```bash
# Clone repo
git clone https://github.com/nNm205/portfolio.git
cd portfolio

# Copy và điền thông tin vào .env
cp backend/.env.example backend/.env

# Build và chạy toàn bộ stack
docker compose up -d --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

```bash
# Xem logs
docker compose logs -f

# Tắt
docker compose down
```

### Chạy Dev Mode (hot-reload)

```bash
# Backend + Frontend Vite dev server (port 5173)
docker compose --profile dev up --build
```

### Chạy thủ công

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Copy `backend/.env.example` → `backend/.env` và điền các giá trị:

```env
# App
DEBUG=True
SECRET_KEY=<random-secret-key>

# Admin credentials
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your-password

# Supabase
SUPABASE_URL=https://<project>.supabase.co
SUPABASE_KEY=<anon-key>
SUPABASE_SERVICE_KEY=<service-key>

# Database (Supabase session pooler — port 5432)
DATABASE_URL=postgresql+asyncpg://<user>:<pass>@<host>:5432/postgres

# Email (Gmail SMTP với App Password)
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=<app-password>
MAIL_FROM=your@gmail.com

# CORS
FRONTEND_URL=http://localhost:5173
```

> ⚠️ Dùng **port 5432** (session pooler), không phải 6543 (transaction pooler) để tránh lỗi `DuplicatePreparedStatementError` với asyncpg.

---

## API Endpoints

### Public

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/projects` | Danh sách projects (filter, pagination) |
| GET | `/api/projects/featured` | Featured projects cho Home |
| GET | `/api/projects/{slug}` | Chi tiết project |
| GET | `/api/blogs` | Danh sách blog posts |
| GET | `/api/blogs/featured` | Featured blogs cho Home |
| GET | `/api/blogs/{slug}` | Chi tiết blog |
| POST | `/api/blogs/{slug}/like` | Like bài viết |
| GET | `/api/skills` | Tất cả skills |
| GET | `/api/skills/grouped` | Skills nhóm theo category |
| POST | `/api/messages` | Gửi contact message |

### Admin (JWT required)

| Method | Endpoint | Mô tả |
|---|---|---|
| POST | `/api/auth/login` | Đăng nhập |
| GET | `/api/auth/me` | Thông tin admin |
| CRUD | `/api/projects/admin/*` | Quản lý projects |
| CRUD | `/api/blogs/admin/*` | Quản lý blog posts |
| CRUD | `/api/skills/admin/*` | Quản lý skills |
| GET | `/api/messages/admin` | Xem messages |

---

## Admin Panel

Truy cập admin tại `/admin/login`.

**Easter eggs để mở admin login:**
- Click logo **5 lần** trong 3 giây
- Hoặc phím tắt `Ctrl + Shift + A`

### Tính năng admin

- **Projects** — CRUD với full-page form, Markdown editor split-view (write|preview|split)
- **Blog Posts** — Viết bài với live preview, word count, estimated read time
- **Skills** — Form với progress slider, live icon preview (simpleicons), color picker
- **Messages** — Xem contact messages từ visitors

---

## Database Migrations

```bash
cd backend

# Tạo migration mới
alembic revision --autogenerate -m "describe changes"

# Chạy migrations
alembic upgrade head

# Rollback
alembic downgrade -1
```

---

## Features

- **Dark theme only** — zinc-950 base, violet accent
- **Fully responsive** — mobile → desktop
- **SEO** — meta tags, OG tags qua `<SEO />` component
- **Sitemap + robots.txt** — tại `/public/`
- **Rate limiting** — slowapi trên các public endpoints
- **JWT auth** — access token 24h, auto-logout khi 401
- **Markdown support** — blog content và project description
- **Real-time preview** — split-view Markdown editor

---

## Deployment Notes

Khi deploy production, cập nhật trong `docker-compose.yml`:

```yaml
args:
  VITE_API_URL: https://your-api-domain.com/api
```

Và trong `backend/.env`:
```env
DEBUG=False
FRONTEND_URL=https://your-frontend-domain.com
```
