from app.pipelines.generation import answer_legal_query
from loguru import logger


class RAGService:
    """
    Domain service for legal Q&A.
    Thin orchestration layer between API and pipeline.
    """

    async def ask(self, query: str) -> dict:
        """
        Process a legal question and return a cited answer.
        """
        if not query or len(query.strip()) < 5:
            return {
                "answer": "Please provide a more specific legal question.",
                "citations": [],
                "next_steps": [],
                "confidence": 0.0,
                "disclaimer": "",
                "sources_used": 0,
                "query": query,
            }

        logger.info(f"RAGService.ask | query='{query[:60]}'")

        # Run synchronous pipeline (we'll make async in Phase 2)
        import asyncio
        result = await asyncio.to_thread(answer_legal_query, query)
        return result


# Singleton
rag_service = RAGService()