import json
from pathlib import Path
from loguru import logger
from app.core.llm import llm_client
from app.pipelines.retrieval import retrieve, format_context

PROMPTS_DIR = Path(__file__).resolve().parent.parent / "prompts"

# Only be empathetic for REAL distressing personal situations
EMPATHY_KEYWORDS = [
    "robbed", "robbery", "attacked", "assault", "beaten", "raped",
    "molested", "domestic violence", "abused", "abuse", "stalking",
    "threatening", "blackmail", "extortion", "accident", "injured",
    "injury", "harassed", "harassment", "cheated", "scammed", "fraud",
    "fired", "terminated", "evicted", "arrested",
]

# Informational queries — no empathy needed
INFO_KEYWORDS = [
    "how do i file", "how to file", "what is", "how can i", "explain",
    "what are my rights", "challan", "rti", "fee", "procedure",
    "process", "steps to", "how does", "what happens", "penalty",
]

def needs_empathy(query: str) -> bool:
    q = query.lower()
    # Check if it's clearly informational first
    if any(kw in q for kw in INFO_KEYWORDS):
        return False
    # Then check for real distress keywords
    has_distress = any(kw in q for kw in EMPATHY_KEYWORDS)
    # Must also sound personal (i, my, me, we)
    is_personal = any(w in q for w in ["i was", "i got", "i am", "i've", "my ", "me ", "we were", "someone attacked", "they attacked"])
    return has_distress and is_personal

def answer_legal_query(query: str) -> dict:
    logger.info(f"Processing: '{query[:80]}'")

    chunks = retrieve(query, top_k=6)
    context = format_context(chunks)
    empathy = needs_empathy(query)

    logger.info(f"Empathy mode: {empathy}")

    if empathy:
        system_prompt = """You are NyaySetu, a warm AI legal assistant for Indian citizens.

The user is describing a real distressing personal situation. 
Start with ONE brief empathetic sentence, then immediately give practical legal guidance.
Be clear, direct, and actionable. Use numbered steps.
Include relevant helpline numbers and official websites.
Write in natural paragraphs — not JSON, not bullet soup.
Bold **key actions** and **important numbers**.
Keep it concise — 3-4 paragraphs maximum."""

        user_prompt = f"""LEGAL CONTEXT:
{context}

USER SITUATION: {query}

Respond warmly but practically. One empathy sentence, then clear numbered steps.
Include emergency numbers if relevant (Police: 100, Women: 181, Legal Aid: 15100).
Write naturally like a knowledgeable friend would."""

    else:
        system_prompt = """You are NyaySetu, an AI legal assistant for Indian citizens.

Answer like a sharp, knowledgeable lawyer giving clear practical advice.
Be direct and confident. No unnecessary fluff or filler.
Use numbered steps when giving procedures.
Bold **key terms** and **important details**.
Write in natural paragraphs — clear, concise, accurate.
3-4 paragraphs maximum."""

        user_prompt = f"""LEGAL CONTEXT:
{context}

USER QUESTION: {query}

Give a clear, direct legal answer based on the context above.
Include relevant websites, fees, timelines if mentioned in context.
Write naturally and confidently."""

    # Get natural language answer
    answer = llm_client.complete(
        prompt=user_prompt,
        system=system_prompt,
        use_fast_model=False,
    )

    # Extract citations separately using fast model
    citation_prompt = f"""Extract relevant legal citations from this context for the query.
Query: {query}
Context: {context}

Return ONLY a JSON array, nothing else:
[{{"act": "act name", "section": "section number", "relevance": "one line why relevant", "source_url": "url"}}]

Return [] if no relevant citations."""

    citations = []
    try:
        citation_raw = llm_client.complete(
            prompt=citation_prompt,
            use_fast_model=True,
            max_tokens=400,
        )
        clean = citation_raw.strip()
        start = clean.find("[")
        end = clean.rfind("]") + 1
        if start != -1 and end > start:
            citations = json.loads(clean[start:end])
    except Exception as e:
        logger.warning(f"Citation extraction failed: {e}")

    # Extract next steps from numbered lines in answer
    next_steps = []
    for line in answer.split('\n'):
        line = line.strip()
        if line and len(line) > 10 and line[0].isdigit() and ('.' in line[:3] or ')' in line[:3]):
            step = line.split('.', 1)[-1].split(')', 1)[-1].strip()
            step = step.replace('**', '').strip()
            if step and len(step) > 5:
                next_steps.append(step)

    return {
        "answer": answer,
        "citations": citations[:3],
        "next_steps": next_steps[:4],
        "confidence": 0.85 if len(chunks) >= 3 else 0.5 if chunks else 0.2,
        "disclaimer": "This is general legal information, not personal legal advice. Always consult a qualified lawyer for your specific situation.",
        "sources_used": len(chunks),
        "query": query,
    }
