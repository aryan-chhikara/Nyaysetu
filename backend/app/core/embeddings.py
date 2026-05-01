from sentence_transformers import SentenceTransformer
from app.config import settings
from loguru import logger
import numpy as np


class EmbeddingModel:
    """
    Wraps sentence-transformers for generating embeddings.
    Model downloads automatically on first run (~90MB).
    """

    def __init__(self):
        logger.info(f"Loading embedding model: {settings.embedding_model}")
        self.model = SentenceTransformer(settings.embedding_model)
        self.dimension = settings.embedding_dimension
        logger.info("Embedding model loaded successfully")

    def embed_text(self, text: str) -> np.ndarray:
        """Embed a single string. Returns float32 numpy array."""
        embedding = self.model.encode(text, normalize_embeddings=True)
        return embedding.astype(np.float32)

    def embed_batch(self, texts: list[str]) -> np.ndarray:
        """Embed a list of strings efficiently. Returns 2D float32 array."""
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=True,
            batch_size=32,
            show_progress_bar=len(texts) > 50,
        )
        return embeddings.astype(np.float32)


# Singleton
embedding_model = EmbeddingModel()