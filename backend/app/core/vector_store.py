import faiss
import pickle
import numpy as np
from pathlib import Path
from loguru import logger
from app.config import settings


class VectorStore:
    """
    FAISS-backed vector store with metadata.
    Each vector maps to a metadata dict:
    {text, act_name, section, source_url, chunk_type}
    """

    def __init__(self):
        self.dimension = settings.embedding_dimension
        self.index_path = Path(settings.faiss_index_path)
        self.metadata_path = Path(settings.faiss_metadata_path)
        self.metadata: list[dict] = []

        # Ensure directories exist
        self.index_path.parent.mkdir(parents=True, exist_ok=True)

        # Load existing index or create fresh
        if self.index_path.exists() and self.metadata_path.exists():
            self._load()
        else:
            self._create_fresh()

    def _create_fresh(self):
        """Inner product index — works as cosine sim since we normalize embeddings."""
        self.index = faiss.IndexFlatIP(self.dimension)
        self.metadata = []
        logger.info("Created fresh FAISS index")

    def _load(self):
        self.index = faiss.read_index(str(self.index_path))
        with open(self.metadata_path, "rb") as f:
            self.metadata = pickle.load(f)
        logger.info(f"Loaded FAISS index | vectors={self.index.ntotal}")

    def save(self):
        faiss.write_index(self.index, str(self.index_path))
        with open(self.metadata_path, "wb") as f:
            pickle.dump(self.metadata, f)
        logger.info(f"Saved FAISS index | vectors={self.index.ntotal}")

    def add(self, embeddings: np.ndarray, metadata: list[dict]):
        """Add vectors with their metadata to the index."""
        if len(embeddings) != len(metadata):
            raise ValueError("embeddings and metadata must have same length")
        self.index.add(embeddings)
        self.metadata.extend(metadata)
        logger.info(f"Added {len(embeddings)} vectors | total={self.index.ntotal}")

    def search(self, query_embedding: np.ndarray, top_k: int = 10) -> list[dict]:
        """
        Search for top_k most similar vectors.
        Returns list of metadata dicts with added 'score' field.
        """
        if self.index.ntotal == 0:
            logger.warning("FAISS index is empty — no results")
            return []

        query = query_embedding.reshape(1, -1)
        scores, indices = self.index.search(query, min(top_k, self.index.ntotal))

        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx == -1:
                continue
            result = self.metadata[idx].copy()
            result["score"] = float(score)
            results.append(result)

        return results

    @property
    def total_vectors(self) -> int:
        return self.index.ntotal


# Singleton
vector_store = VectorStore()