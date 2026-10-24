# BrandPilot Deployment Guide

## 1. Local Development Architecture

```
Frontend (Vite Dev Server)   --> Port 5173
Backend (FastAPI / Uvicorn) --> Port 8000 (Proxy configured in Vite)
Database                     --> SQLite (local dev) or PostgreSQL (prod)
```

### Running Backend:
```bash
cd backend
# Activate venv
.\venv\Scripts\activate
# Start Uvicorn
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### Running Frontend:
```bash
cd frontend
npm run dev
# Access http://localhost:5173
```

---

## 2. Production Deployment (Docker / Cloud Run / VPS)

### Production Environment Variables:
```env
PROJECT_NAME="BrandPilot — Trust Before Publish"
API_V1_STR="/api/v1"
SECRET_KEY="<strong-random-secret-key>"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
DATABASE_URL="postgresql://brandpilot_user:secure_password@postgres-host:5432/brandpilot_db"
GEMINI_API_KEY="<your-google-gemini-api-key>"
GEMINI_MODEL="gemini-2.5-flash"
```

### Database Migrations:
```bash
alembic upgrade head
```

### Frontend Production Build:
```bash
cd frontend
npm run build
# Serves static assets from dist/ via Nginx, Caddy, or Cloudflare Pages
```
