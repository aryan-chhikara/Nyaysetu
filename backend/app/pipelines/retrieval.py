from app.core.embeddings import embedding_model
from app.core.vector_store import vector_store
from app.core.llm import llm_client
from loguru import logger


def expand_query(query: str) -> list[str]:
    """
    Use fast LLM to rewrite user query into 3 legal variants.
    Better query coverage = better retrieval.
    """
    prompt = f"""You are an Indian legal search expert.
Rewrite this user query into 3 different legal search phrases that would help find relevant Indian law sections.
Return ONLY a JSON array of 3 strings, nothing else.

User query: {query}

Example output: ["Payment of Wages Act salary delay", "Section 3 POWA wage recovery", "employee unpaid salary legal remedy India"]
"""
    try:
        response = llm_client.complete(prompt, use_fast_model=True, max_tokens=150)
        # Clean response and parse
        response = response.strip()
        if response.startswith("["):
            import json
            variants = json.loads(response)
            logger.info(f"Query expanded into {len(variants)} variants")
            return [query] + variants  # original + 3 variants
    except Exception as e:
        logger.warning(f"Query expansion failed, using original: {e}")

    return [query]  # fallback to original


def retrieve(query: str, top_k: int = 6) -> list[dict]:
    """
    Full retrieval pipeline:
    1. Expand query into variants
    2. Embed each variant
    3. Search FAISS for each
    4. Deduplicate and rerank by score
    Returns top_k unique chunks with metadata.
    """
    if vector_store.total_vectors == 0:
        logger.warning("Vector store is empty — no documents ingested yet")
        return []

    queries = expand_query(query)
    seen_texts = set()
    all_results = []

    for q in queries:
        embedding = embedding_model.embed_text(q)
        results = vector_store.search(embedding, top_k=top_k)

        for r in results:
            # Deduplicate by text content
            text_key = r["text"][:100]
            if text_key not in seen_texts:
                seen_texts.add(text_key)
                all_results.append(r)

    # Sort by score descending, return top_k
    all_results.sort(key=lambda x: x["score"], reverse=True)
    top_results = all_results[:top_k]

    logger.info(f"Retrieved {len(top_results)} unique chunks for query: '{query[:50]}'")
    return top_results


def format_context(chunks: list[dict]) -> str:
    """
    Format retrieved chunks into a clean context string for the LLM.
    Includes metadata breadcrumbs for citation generation.
    """
    if not chunks:
        return "No relevant legal documents found in the knowledge base."

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        part = f"""[Source {i}]
Act: {chunk.get('act_name', 'Unknown Act')}
Section: {chunk.get('section', 'N/A')}
URL: {chunk.get('source_url', 'N/A')}
Relevance Score: {chunk.get('score', 0):.3f}
Content:
{chunk.get('text', '')}
---"""
        context_parts.append(part)

    return "\n\n".join(context_parts)