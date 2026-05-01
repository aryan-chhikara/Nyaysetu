from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache
from pathlib import Path

# Base directory — always points to backend/
BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    # ── App ──────────────────────────────────────────
    app_name: str = "NyaySetu"
    app_version: str = "0.1.0"
    debug: bool = True
    log_level: str = "INFO"

    # ── Groq LLM ─────────────────────────────────────
    groq_api_key: str = Field(..., env="GROQ_API_KEY")
    groq_model_primary: str = "llama-3.3-70b-versatile"
    groq_model_fast: str = "llama-3.1-8b-instant"
    groq_max_tokens: int = 2048
    groq_temperature: float = 0.1

    # ── Embeddings ────────────────────────────────────
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dimension: int = 384

    # ── Vector Store ──────────────────────────────────
    faiss_index_path: str = "data/index/legal.faiss"
    faiss_metadata_path: str = "data/index/metadata.pkl"

    # ── IndianKanoon ──────────────────────────────────
    indiankanoon_api_key: str = "not_configured"
    indiankanoon_base_url: str = "https://api.indiankanoon.org"
    indiankanoon_enabled: bool = False

    # ── Database (Phase 2) ────────────────────────────
    database_url: str = "postgresql+asyncpg://postgres:password@localhost:5432/nyaysetu"

    # ── Redis (Phase 2) ───────────────────────────────
    redis_url: str = "redis://localhost:6379"

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


# Single import-friendly instance
settings = get_settings()