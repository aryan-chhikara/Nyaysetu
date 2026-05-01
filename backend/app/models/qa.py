from pydantic import BaseModel, Field


class QuestionRequest(BaseModel):
    query: str = Field(
        ...,
        min_length=5,
        max_length=1000,
        description="Legal question in plain English",
        examples=["What are my rights if my employer doesn't pay my salary?"]
    )


class Citation(BaseModel):
    act: str
    section: str
    relevance: str
    source_url: str = ""


class QuestionResponse(BaseModel):
    query: str
    answer: str
    citations: list[Citation]
    next_steps: list[str]
    confidence: float
    disclaimer: str
    sources_used: int