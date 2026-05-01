from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from app.config import settings
from app.api.v1 import qa, documents


# ── App Init ──────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="AI-powered Indian legal assistance system",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────
app.include_router(qa.router, prefix="/api/v1")
app.include_router(documents.router, prefix="/api/v1")

# ── Root ──────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "app": settings.app_name,
        "version": settings.app_version,
        "status": "running",
        "docs": "/docs",
    }


@app.on_event("startup")
async def startup():
    logger.info(f"{settings.app_name} v{settings.app_version} starting...")
    logger.info(f"Debug mode: {settings.debug}")
    logger.info("API ready at http://localhost:8000")