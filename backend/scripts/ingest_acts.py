import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import fitz
import re
from pathlib import Path
from loguru import logger
from app.core.embeddings import embedding_model
from app.core.vector_store import vector_store

RAW_DATA_DIR = Path("data/raw")

ACTS = [
    {
        "filename": "rti_act_2005.pdf",
        "act_name": "Right to Information Act, 2005",
        "short_name": "RTI Act",
        "source_url": "https://rti.gov.in/rtiact.asp",
        "year": 2005,
    },
    {
        "filename": "ipc_1860.pdf",
        "act_name": "Indian Penal Code, 1860",
        "short_name": "IPC",
        "source_url": "https://www.indiacode.nic.in/bitstream/123456789/2263/1/A1860-45.pdf",
        "year": 1860,
    },
    {
        "filename": "consumer_protection_2019.pdf",
        "act_name": "Consumer Protection Act, 2019",
        "short_name": "Consumer Act",
        "source_url": "https://www.indiacode.nic.in/bitstream/123456789/15444/1/consumer_protection_act_2019.pdf",
        "year": 2019,
    },
    {
        "filename": "payment_of_wages_1936.pdf",
        "act_name": "Payment of Wages Act, 1936",
        "short_name": "Wages Act",
        "source_url": "https://www.indiacode.nic.in/bitstream/123456789/1562/1/194836.pdf",
        "year": 1936,
    },
    {
        "filename": "constitution_india.pdf",
        "act_name": "Constitution of India",
        "short_name": "Constitution",
        "source_url": "https://www.indiacode.nic.in/bitstream/123456789/15240/1/constitution_of_india.pdf",
        "year": 1950,
    },
]

def extract_text(pdf_path: Path) -> str:
    logger.info(f"Extracting: {pdf_path.name}")
    doc = fitz.open(str(pdf_path))
    text = ""
    for page in doc:
        t = page.get_text()
        if t.strip():
            text += t
    doc.close()
    logger.info(f"Extracted {len(text)} chars")
    return text

def chunk_text(text: str, act_info: dict) -> list[dict]:
    section_pattern = re.compile(
        r'(?=(?:Section\s+\d+|SECTION\s+\d+|\bArticle\s+\d+|\n\s*\d+\.\s+[A-Z]))',
        re.IGNORECASE
    )
    raw = section_pattern.split(text)
    sections = [s.strip() for s in raw if len(s.strip()) > 80]
    logger.info(f"Found {len(sections)} sections")

    chunks = []
    for i, sec in enumerate(sections):
        first_line = sec.split('\n')[0].strip()
        sec_num = extract_section_num(first_line) or f"Part {i+1}"

        if len(sec) > 1500:
            for j, sub in enumerate(sub_chunk(sec)):
                chunks.append({
                    "text": sub,
                    "act_name": act_info["act_name"],
                    "short_name": act_info["short_name"],
                    "section": f"{sec_num} (Part {j+1})",
                    "source_url": act_info["source_url"],
                    "year": act_info["year"],
                })
        else:
            chunks.append({
                "text": sec,
                "act_name": act_info["act_name"],
                "short_name": act_info["short_name"],
                "section": sec_num,
                "source_url": act_info["source_url"],
                "year": act_info["year"],
            })
    return chunks

def extract_section_num(text: str) -> str:
    m = re.search(r'[Ss]ection\s+(\d+[A-Za-z]?)', text)
    if m: return f"Section {m.group(1)}"
    m = re.search(r'[Aa]rticle\s+(\d+[A-Za-z]?)', text)
    if m: return f"Article {m.group(1)}"
    m = re.search(r'^(\d+[A-Za-z]?)\.\s+', text)
    if m: return f"Section {m.group(1)}"
    return ""

def sub_chunk(text: str, max_size: int = 800) -> list[str]:
    words = text.split()
    chunks, current, length = [], [], 0
    for word in words:
        current.append(word)
        length += len(word) + 1
        if length >= max_size:
            chunks.append(" ".join(current))
            overlap = int(len(current) * 0.2)
            current = current[-overlap:]
            length = sum(len(w) + 1 for w in current)
    if current:
        chunks.append(" ".join(current))
    return chunks

def ingest_act(act_info: dict) -> int:
    pdf_path = RAW_DATA_DIR / act_info["filename"]
    if not pdf_path.exists():
        logger.error(f"NOT FOUND: {pdf_path} — download it manually")
        return 0

    text = extract_text(pdf_path)
    if not text.strip():
        logger.error(f"Empty text from {pdf_path.name}")
        return 0

    chunks = chunk_text(text, act_info)
    if not chunks:
        logger.error("No chunks created")
        return 0

    logger.info(f"Embedding {len(chunks)} chunks...")
    texts = [c["text"] for c in chunks]
    embeddings = embedding_model.embed_batch(texts)
    vector_store.add(embeddings, chunks)
    vector_store.save()

    logger.success(f"✅ {act_info['act_name']} — {len(chunks)} chunks | Total: {vector_store.total_vectors}")
    return len(chunks)

if __name__ == "__main__":
    logger.info("=" * 55)
    logger.info("NyaySetu — Ingestion Pipeline")
    logger.info("=" * 55)

    # Reset index for clean rebuild
    from app.core.vector_store import VectorStore
    vector_store._create_fresh()

    total = 0
    for act in ACTS:
        logger.info(f"\n→ {act['act_name']}")
        total += ingest_act(act)

    logger.info("=" * 55)
    logger.info(f"DONE — Total vectors: {vector_store.total_vectors}")
    logger.info("=" * 55)