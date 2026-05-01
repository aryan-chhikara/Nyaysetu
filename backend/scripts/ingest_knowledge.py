"""
Ingest the curated knowledge base into FAISS.
Run: python scripts/ingest_knowledge.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from loguru import logger
from app.core.embeddings import embedding_model
from app.core.vector_store import vector_store
from data.processed.legal_knowledge import KNOWLEDGE_BASE

if __name__ == "__main__":
    logger.info("Ingesting curated knowledge base...")
    logger.info(f"Current vectors in index: {vector_store.total_vectors}")

    texts = [k["text"] for k in KNOWLEDGE_BASE]
    embeddings = embedding_model.embed_batch(texts)
    vector_store.add(embeddings, KNOWLEDGE_BASE)
    vector_store.save()

    logger.success(f"✅ Added {len(KNOWLEDGE_BASE)} knowledge chunks")
    logger.success(f"Total vectors now: {vector_store.total_vectors}")