from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    assert client.get("/health").json() == {"status": "ok"}


def test_sentiments():
    assert client.post("/analyze", json={"text": "This is absolutely amazing"}).json()["label"] == "positive"
    assert client.post("/analyze", json={"text": "This is the worst"}).json()["label"] == "negative"
    assert client.post("/analyze", json={"text": "The package arrived today"}).json()["label"] == "neutral"


def test_negation():
    assert client.post("/analyze", json={"text": "This is not good"}).json()["label"] == "negative"
