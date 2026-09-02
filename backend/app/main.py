from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .analyzer import SentimentAnalyzer

app = FastAPI(title="Sentiment Analysis API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
analyzer = SentimentAnalyzer()


class AnalyzeRequest(BaseModel):
    text: str = Field(min_length=1, max_length=2000)


class Analysis(BaseModel):
    text: str
    label: str
    confidence: float
    score: float
    contributions: list[dict[str, float | str]]


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/analyze", response_model=Analysis)
def analyze(request: AnalyzeRequest) -> Analysis:
    result = analyzer.analyze(request.text)
    return Analysis(text=request.text, **result.__dict__)


@app.post("/analyze/batch", response_model=list[Analysis])
def analyze_batch(requests: list[AnalyzeRequest]) -> list[Analysis]:
    return [analyze(request) for request in requests[:100]]
