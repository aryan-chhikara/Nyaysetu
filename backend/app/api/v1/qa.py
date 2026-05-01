from fastapi import APIRouter, HTTPException
from app.models.qa import QuestionRequest, QuestionResponse
from app.services.rag_service import rag_service
from loguru import logger

router = APIRouter(prefix="/qa", tags=["Legal Q&A"])


@router.post("/ask", response_model=QuestionResponse)
async def ask_legal_question(request: QuestionRequest):
    """
    Submit a legal question and receive a cited answer.
    Powered by RAG over Indian legal documents.
    """
    try:
        logger.info(f"POST /qa/ask | query='{request.query[:60]}'")
        result = await rag_service.ask(request.query)
        return QuestionResponse(**result)
    except Exception as e:
        logger.error(f"Error in /qa/ask: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/health")
async def health_check():
    """Quick health check for the QA service."""
    from app.core.vector_store import vector_store
    return {
        "status": "ok",
        "vectors_indexed": vector_store.total_vectors,
        "model": "llama-3.3-70b-versatile"
    }