# Portfolio — Full-Stack Developer Portfolio

Trang portfolio cá nhân được xây dựng với **React + FastAPI + PostgreSQL (Supabase)**.

## Tech Stack

| Layer     | Công nghệ                                              |
|-----------|--------------------------------------------------------|
| Frontend  | React 19, Vite, Tailwind CSS v4, Zustand, React Router |
| Backend   | FastAPI, SQLAlchemy (async), Alembic, Pydantic v2      |
| Database  | PostgreSQL via Supabase                                |
| Auth      | JWT (python-jose) + bcrypt                             |
| Email     | Gmail SMTP                                             |

## Cấu trúc project

```
portfolio/
├── backend/          # FastAPI app
│   ├── app/
│   │   ├── config/   # Settings, database
│   │   ├── models/   # SQLAlchemy models
│   │   ├── schemas/  # Pydantic schemas
│   │   ├── services/ # Business logic
│   │   ├── routers/  # API routes
│   │   ├── middleware/
│   │   └── utils/
│   ├── alembic/      # DB migrations
│   └── requirements.txt
└── frontend/         # React app
    └── src/
        ├── components/
        ├── pages/
        ├── hooks/
        ├── services/ # API layer
        ├── store/    # Zustand
        └── utils/
```

## Setup

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt

# Copy và điền env vars
cp .env.example .env

# Chạy migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install

# Copy và điền env vars
cp .env.example .env

npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Biến | Mô tả |
|------|-------|
| `SECRET_KEY` | JWT secret key |
| `ADMIN_EMAIL` | Email đăng nhập admin |
| `ADMIN_PASSWORD` | Mật khẩu admin |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_KEY` | Supabase service role key |
| `DATABASE_URL` | PostgreSQL connection string (`postgresql+asyncpg://...`) |
| `MAIL_USERNAME` | Gmail username |
| `MAIL_PASSWORD` | Gmail app password |

### Frontend (`frontend/.env`)

| Biến | Mô tả |
|------|-------|
| `VITE_API_URL` | Backend API URL (e.g. `http://localhost:8000/api`) |
| `VITE_APP_NAME` | App name hiển thị |

## API Docs

Khi chạy ở chế độ DEBUG, truy cập: `http://localhost:8000/docs`

## Admin Panel

Truy cập `/admin/login` với credentials trong `.env`.
