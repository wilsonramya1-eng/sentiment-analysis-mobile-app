# Sentiment Analysis Mobile App

A portfolio-ready, full-stack sentiment analysis project with an Expo/React Native mobile client and a FastAPI backend. The API uses a compact, explainable lexicon model, so the project runs immediately without downloading model weights.

## Highlights

- Cross-platform mobile UI (Android, iOS, and web)
- FastAPI REST API with health and batch-analysis endpoints
- Positive, neutral, and negative classification with confidence scores
- Explainable token contributions
- Automated backend tests and Docker support

## Project structure

```text
backend/   FastAPI service and tests
mobile/    Expo React Native application
```

## Quick start

### 1. Start the API

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API runs at `http://localhost:8000`; interactive documentation is at `http://localhost:8000/docs`.

### 2. Start the mobile app

```bash
cd mobile
npm install
npm start
```

Press `a` for Android, `i` for iOS, or `w` for a browser preview. For a physical phone, set `EXPO_PUBLIC_API_URL` to your computer's LAN address:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.10:8000 npm start
```

## Test

```bash
cd backend
pytest
```

## API example

```bash
curl -X POST http://localhost:8000/analyze -H "Content-Type: application/json" -d '{"text":"I love how simple this is!"}'
```

## Architecture

The client sends text to the API. The analyzer normalizes words, applies negation and intensifier rules, aggregates token scores, and returns a label, normalized confidence, and the strongest contributing terms. The model is intentionally transparent and replaceable: `SentimentAnalyzer` can later be swapped for a fine-tuned transformer while keeping the API contract stable.

## License

MIT
