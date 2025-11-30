# ML Service

FastAPI service for CAPSTACK AI Risk & Allocation Engine.

## Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Run service: `uvicorn app.main:app --reload`
3. API docs available at: `http://localhost:8000/docs`

## Endpoints

- `GET /`: Service health check
- `POST /risk-score`: Calculate financial risk score

## Models

- `risk_model.pkl`: Trained risk assessment model
- `survival_model.pkl`: Emergency survival prediction model
- `score_model.pkl`: Financial health scoring model

TODO: Implement actual ML model loading and prediction logic.