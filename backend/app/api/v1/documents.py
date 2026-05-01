from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from loguru import logger
import fitz
import tempfile
import os
from app.core.llm import llm_client
from app.pipelines.retrieval import retrieve, format_context

router = APIRouter(prefix="/documents", tags=["Document Analysis"])


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes using PyMuPDF."""
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(file_bytes)
        tmp_path = tmp.name

    try:
        doc = fitz.open(tmp_path)
        text = ""
        for page in doc:
            t = page.get_text()
            if t.strip():
                text += t + "\n"
        doc.close()
        return text.strip()
    finally:
        os.unlink(tmp_path)


@router.post("/analyze")
async def analyze_document(file: UploadFile = File(...)):
    """
    Upload a legal PDF document for AI analysis.
    Returns summary + deep legal analysis.
    """
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    logger.info(f"Analyzing document: {file.filename}")

    # Read file
    file_bytes = await file.read()
    if len(file_bytes) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 10MB.")

    # Extract text
    try:
        text = extract_text_from_pdf(file_bytes)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not extract text from PDF: {str(e)}")

    if not text or len(text) < 50:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from this PDF. It may be a scanned image. Please try a text-based PDF."
        )

    # Truncate if too long
    if len(text) > 8000:
        text = text[:8000] + "\n\n[Document truncated for analysis...]"

    logger.info(f"Extracted {len(text)} characters from {file.filename}")

    # Step 1 — Quick Summary
    summary_prompt = f"""You are NyaySetu, an AI legal assistant.
Analyze this legal document and provide a brief summary.

DOCUMENT TEXT:
{text}

Provide:
1. Document type (e.g. rental agreement, legal notice, court order, FIR, etc.)
2. Key parties involved
3. Main purpose in 2-3 sentences
4. Most important dates or deadlines mentioned

Be concise and clear. Write in plain English."""

    summary = llm_client.complete(
        prompt=summary_prompt,
        use_fast_model=True,
        max_tokens=500,
    )

    # Step 2 — Deep Legal Analysis
    analysis_prompt = f"""You are NyaySetu, an expert AI legal analyst for Indian law.
Perform a thorough legal analysis of this document.

DOCUMENT TEXT:
{text}

Analyze and provide:

**1. Document Classification**
What type of legal document is this exactly?

**2. Key Legal Provisions**
What are the most important clauses or provisions?

**3. Risk Assessment**
Are there any clauses that are unfair, illegal, or risky for the recipient?
Flag anything that violates Indian law.

**4. Rights & Obligations**
What are the rights and obligations of each party?

**5. Applicable Indian Laws**
Which Indian acts or sections apply to this document?

**6. Recommended Action**
What should the person receiving this document do?
Should they sign it, challenge it, or seek legal help?

Be thorough but clear. Use plain English. Bold **important findings**."""

    analysis = llm_client.complete(
        prompt=analysis_prompt,
        use_fast_model=False,
        max_tokens=1500,
    )

    # Get relevant legal context from our knowledge base
    search_query = f"legal document {text[:200]}"
    chunks = retrieve(search_query, top_k=3)

    citations = []
    if chunks:
        citation_prompt = f"""Based on this document analysis, what Indian laws are most relevant?
Document summary: {summary[:300]}

Context: {format_context(chunks)}

Return ONLY a JSON array:
[{{"act": "act name", "section": "section", "relevance": "why relevant", "source_url": "url"}}]
Return [] if none relevant."""

        try:
            citation_raw = llm_client.complete(
                prompt=citation_prompt,
                use_fast_model=True,
                max_tokens=300,
            )
            clean = citation_raw.strip()
            start = clean.find("[")
            end = clean.rfind("]") + 1
            if start != -1 and end > start:
                citations = __import__('json').loads(clean[start:end])
        except Exception as e:
            logger.warning(f"Citation extraction failed: {e}")

    return JSONResponse(content={
        "filename": file.filename,
        "pages": len(text.split('\n\n')),
        "summary": summary,
        "analysis": analysis,
        "citations": citations[:3],
        "disclaimer": "This is AI-generated legal analysis for informational purposes only. Always consult a qualified lawyer before taking legal action."
    })
