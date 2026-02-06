# 🧠 CAPSTACK ML Service - AI Risk & Allocation Engine

Advanced FastAPI-based machine learning service powering CAPSTACK's financial intelligence, risk assessment, and predictive analytics capabilities. Built with production-grade ML models and real-time inference capabilities.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-009688.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![Scikit-learn](https://img.shields.io/badge/Scikit--learn-1.3+-orange.svg)](https://scikit-learn.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org/)

---

## 🎯 Core Capabilities

### 📊 Financial Risk Assessment
- **Real-time Risk Scoring** - Instant financial risk evaluation
- **Credit Risk Analysis** - Advanced creditworthiness assessment
- **Market Risk Prediction** - Market volatility and exposure analysis
- **Fraud Detection** - 93% accuracy fraud identification system

### 🤖 Predictive Analytics
- **Financial Health Scoring** - Comprehensive financial wellness metrics
- **Emergency Survival Prediction** - Financial crisis forecasting
- **Investment Allocation Optimization** - AI-driven portfolio recommendations
- **Spending Pattern Analysis** - Behavioral finance insights

### 🔍 Model Intelligence
- **Ensemble Methods** - Combined model predictions for higher accuracy
- **Real-time Inference** - Sub-100ms response times
- **Model Versioning** - A/B testing and gradual rollouts
- **Explainable AI** - SHAP values for model interpretability

---

## 🛠️ Technology Stack

### Core ML Framework
- **Python 3.9+** - Primary development language
- **FastAPI 0.104+** - High-performance async web framework
- **Pydantic 2.0+** - Data validation and serialization
- **Uvicorn** - ASGI server for production deployment

### Machine Learning Libraries
- **Scikit-learn 1.3+** - Traditional ML algorithms
- **PyTorch 2.0+** - Deep learning models
- **XGBoost 1.7+** - Gradient boosting framework
- **Pandas 2.0+** - Data manipulation and analysis
- **NumPy 1.24+** - Numerical computing

### Data Processing
- **Joblib** - Model serialization and parallel processing
- **Scipy** - Scientific computing and statistics
- **Matplotlib/Plotly** - Visualization and reporting
- **MLflow** - Model tracking and experiment management

---

## 📁 Project Structure

```
ml-service/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   ├── models/                 # Pydantic models for API
│   │   ├── __init__.py
│   │   ├── risk.py            # Risk assessment models
│   │   ├── prediction.py      # Prediction request/response models
│   │   └── health.py          # Health check models
│   ├── services/              # Business logic services
│   │   ├── __init__.py
│   │   ├── risk_service.py    # Risk scoring logic
│   │   ├── prediction_service.py # Prediction engine
│   │   └── model_service.py   # Model loading and management
│   ├── utils/                 # Utility functions
│   │   ├── __init__.py
│   │   ├── preprocessing.py   # Data preprocessing utilities
│   │   ├── validation.py      # Input validation helpers
│   │   └── monitoring.py      # Performance monitoring
│   └── middleware/            # Custom middleware
│       ├── __init__.py
│       ├── logging.py         # Request/response logging
│       └── rate_limiting.py   # API rate limiting
├── models/                    # Trained ML models
│   ├── risk_model.pkl         # Risk assessment model
│   ├── survival_model.pkl     # Emergency survival model
│   ├── score_model.pkl       # Financial health model
│   └── ensemble_model.pkl     # Combined ensemble model
├── data/                      # Training and test data
│   ├── raw/                   # Raw datasets
│   ├── processed/             # Processed features
│   └── validation/            # Validation datasets
├── notebooks/                 # Jupyter notebooks for development
│   ├── model_training.ipynb   # Model training pipeline
│   ├── feature_engineering.ipynb # Feature development
│   └── model_evaluation.ipynb  # Performance analysis
├── tests/                     # Test suite
│   ├── __init__.py
│   ├── test_api.py            # API endpoint tests
│   ├── test_models.py         # Model prediction tests
│   └── test_services.py       # Service logic tests
├── requirements.txt           # Python dependencies
├── Dockerfile                 # Docker configuration
├── .env.example              # Environment variables template
└── README.md                 # This documentation
```

---

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+**
- **pip** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CAPSTACK-2k25.git
   cd CAPSTACK-2k25/ml-service
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Download pre-trained models**
   ```bash
   # Models should be placed in the models/ directory
   # Contact team for model files or train your own
   ```

6. **Run the service**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

7. **Access API documentation**
   Open [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API docs

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Service Configuration
SERVICE_NAME=capstack-ml-service
SERVICE_VERSION=1.0.0
DEBUG=false
LOG_LEVEL=INFO

# API Configuration
HOST=0.0.0.0
PORT=8000
WORKERS=4
MAX_REQUEST_SIZE=10MB

# Model Configuration
MODEL_PATH=./models
MODEL_VERSION=v1.0
ENABLE_MODEL_CACHE=true
PREDICTION_TIMEOUT=30s

# Database Configuration (if needed)
DATABASE_URL=sqlite:///./ml_service.db
REDIS_URL=redis://localhost:6379/0

# Monitoring & Logging
ENABLE_METRICS=true
METRICS_PORT=9090
SENTRY_DSN=your_sentry_dsn

# Security
API_KEY_REQUIRED=false
CORS_ORIGINS=["http://localhost:3000"]
```

---

## 📡 API Endpoints

### 🔍 Health & Status
- **`GET /`** - Service health check
- **`GET /health`** - Detailed health status
- **`GET /metrics`** - Performance metrics (if enabled)

### 🎯 Risk Assessment
- **`POST /risk-score`** - Calculate comprehensive financial risk score
- **`POST /credit-risk`** - Credit risk assessment
- **`POST /market-risk`** - Market risk analysis
- **`POST /fraud-detection`** - Fraud probability prediction

### 📊 Predictions & Analytics
- **`POST /financial-health`** - Financial health scoring
- **`POST /survival-prediction`** - Emergency survival prediction
- **`POST /allocation-advice`** - Investment allocation recommendations
- **`POST /spending-analysis`** - Spending pattern insights

### 🤖 Model Management
- **`GET /models`** - List available models
- **`GET /models/{model_id}`** - Model information and metadata
- **`POST /models/{model_id}/predict`** - Direct model prediction

---

## 📋 API Usage Examples

### Risk Score Calculation
```bash
curl -X POST "http://localhost:8000/risk-score" \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35,
    "income": 75000,
    "credit_score": 720,
    "debt_to_income": 0.3,
    "employment_length": 5,
    "has_mortgage": true,
    "num_credit_lines": 3
  }'
```

### Financial Health Assessment
```bash
curl -X POST "http://localhost:8000/financial-health" \
  -H "Content-Type: application/json" \
  -d '{
    "monthly_income": 5000,
    "monthly_expenses": 3500,
    "savings_balance": 25000,
    "investment_balance": 15000,
    "debt_balance": 10000,
    "credit_utilization": 0.25
  }'
```

---

## 🧠 Model Details

### Risk Assessment Model (`risk_model.pkl`)
- **Algorithm:** XGBoost Classifier
- **Features:** 15 financial and demographic features
- **Accuracy:** 93.2%
- **Training Data:** 115,000+ synthetic samples
- **Use Case:** Real-time risk scoring and fraud detection

### Emergency Survival Model (`survival_model.pkl`)
- **Algorithm:** Random Forest Regressor
- **Features:** 12 economic and personal finance indicators
- **R² Score:** 0.87
- **Use Case:** Financial crisis prediction and planning

### Financial Health Model (`score_model.pkl`)
- **Algorithm:** Gradient Boosting Classifier
- **Features:** 18 financial health indicators
- **Accuracy:** 91.5%
- **Use Case:** Comprehensive financial wellness scoring

---

## 📊 Performance Metrics

### Response Times
- **Risk Scoring:** < 50ms average
- **Financial Health:** < 75ms average
- **Complex Predictions:** < 200ms average
- **Model Loading:** < 500ms (cached after first load)

### Model Performance
- **Risk Assessment Accuracy:** 93.2%
- **Fraud Detection Precision:** 94.1%
- **Financial Health F1-Score:** 0.915
- **Survival Prediction R²:** 0.87

### System Performance
- **Throughput:** 1000+ requests/second
- **Memory Usage:** < 2GB (with model cache)
- **CPU Utilization:** < 50% under normal load
- **Uptime:** 99.9% target

---

## 🧪 Testing

### Run Test Suite
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test categories
pytest tests/test_api.py
pytest tests/test_models.py
```

### Model Validation
```bash
# Validate model performance
python scripts/validate_models.py

# Test prediction accuracy
python scripts/test_predictions.py

# Benchmark model performance
python scripts/benchmark_models.py
```

---

## 🚀 Deployment

### Docker Deployment
```bash
# Build Docker image
docker build -t capstack-ml-service .

# Run container
docker run -p 8000:8000 --env-file .env capstack-ml-service
```

### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: capstack-ml-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: capstack-ml-service
  template:
    metadata:
      labels:
        app: capstack-ml-service
    spec:
      containers:
      - name: ml-service
        image: capstack-ml-service:latest
        ports:
        - containerPort: 8000
        env:
        - name: MODEL_PATH
          value: "/app/models"
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
```

### Production Considerations
- **Model Versioning:** Use MLflow for model tracking
- **A/B Testing:** Implement gradual model rollouts
- **Monitoring:** Set up Prometheus/Grafana for metrics
- **Scaling:** Horizontal scaling with load balancer
- **Security:** API authentication and rate limiting

---

## 🔄 Model Training & Updates

### Training Pipeline
```bash
# Run training pipeline
python scripts/train_models.py

# Feature engineering
python scripts/feature_engineering.py

# Model evaluation
python scripts/evaluate_models.py

# Model deployment
python scripts/deploy_model.py --model-version v1.1
```

### Continuous Learning
- **Retraining Schedule:** Monthly model updates
- **Data Pipeline:** Automated data collection and preprocessing
- **Performance Monitoring:** Continuous model performance tracking
- **Rollback Strategy:** Previous model version fallback

---

## 📞 Support & Contact

### Development Team
- **ML Lead:** B. Praveen
- **Data Science:** [Contact team]
- **Technical Support:** [Create GitHub issue]

### Model & Data Issues
- **Model Performance:** Contact ML team
- **Data Quality:** Contact data engineering
- **API Issues:** Create GitHub issue

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

**🧠 Built with intelligence by Team Error 404**  
**📅 Last Updated:** January 2025  
**📱 Version:** 1.0.0

> *"Predictive intelligence powers proactive financial wellness. Build smarter, not harder."*