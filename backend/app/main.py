import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.db.session import engine, Base, SessionLocal
from app.api.v1.router import api_router

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("brandpilot")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables automatically on startup
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    
    # Run seed data if database is empty
    try:
        from seed_data import seed_database
        db = SessionLocal()
        seed_database(db)
        db.close()
    except Exception as e:
        logger.warning(f"Seed data initialization check notice: {e}")
        
    logger.info("BrandPilot backend service initialized successfully.")
    yield
    logger.info("BrandPilot backend shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise AI-Powered Brand Governance Platform — Trust Before Publish",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/api/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "ai_engine": "Gemini 2.5 Flash (Cloud)" if settings.GEMINI_API_KEY else "Deterministic Policy & RAG Engine (Local)",
        "mode": "production-ready prototype",
        "attribution": {
            "creator": "CH. ANUHYA",
            "team": "Team ALTO"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
