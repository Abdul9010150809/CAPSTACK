from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import joblib
import os
from typing import List, Dict, Any

app = FastAPI(title="CAPSTACK ML Service", version="1.0.0")

# Load ML models (create dummy models if not exist)
MODEL_DIR = "app/models"
os.makedirs(MODEL_DIR, exist_ok=True)

class RiskScoreRequest(BaseModel):
    income: float
    expenses: float
    savings: float
    debt: float

class AllocationOptimizationRequest(BaseModel):
    income: float
    expenses: float
    emergency_fund: float
    debt: float
    age: int
    risk_tolerance: str  # low, medium, high
    job_stability: float  # 1-10
    market_conditions: str  # bull, bear, neutral
    inflation_rate: float

class PredictiveAnalyticsRequest(BaseModel):
    user_data: Dict[str, Any]
    prediction_type: str  # survival_probability, layoff_risk, savings_trajectory
    time_horizon: str  # 30day, 60day, 90day

@app.get("/")
def read_root():
    return {"message": "CAPSTACK ML Service", "version": "1.0.0"}

@app.post("/risk-score")
def calculate_risk_score(request: RiskScoreRequest):
    """Calculate financial risk score"""
    try:
        # Simple rule-based calculation (can be replaced with ML model)
        expense_ratio = request.expenses / request.income if request.income > 0 else 1
        savings_ratio = request.savings / request.income if request.income > 0 else 0
        debt_ratio = request.debt / request.income if request.income > 0 else 1

        # Weighted risk score
        risk_score = (expense_ratio * 0.5 + (1 - savings_ratio) * 0.3 + debt_ratio * 0.2) * 100
        risk_score = min(max(risk_score, 0), 100)

        level = "low" if risk_score < 30 else "medium" if risk_score < 70 else "high"

        return {
            "risk_score": round(risk_score, 2),
            "level": level,
            "factors": {
                "expense_ratio": round(expense_ratio * 100, 2),
                "savings_ratio": round(savings_ratio * 100, 2),
                "debt_ratio": round(debt_ratio * 100, 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk calculation failed: {str(e)}")

@app.post("/allocation-optimize")
def optimize_asset_allocation(request: AllocationOptimizationRequest):
    """AI-powered asset allocation optimization"""
    try:
        # Extract features
        income = request.income
        expenses = request.expenses
        emergency_fund = request.emergency_fund
        debt = request.debt
        age = request.age
        risk_tolerance = request.risk_tolerance
        job_stability = request.job_stability
        market_conditions = request.market_conditions
        inflation_rate = request.inflation_rate

        # Base allocation percentages
        base_allocation = {
            "sip_percentage": 30.0,
            "stocks_percentage": 15.0,
            "bonds_percentage": 20.0,
            "lifestyle_percentage": 25.0,
            "emergency_fund_percentage": 10.0
        }

        reasoning = []

        # Adjust based on age
        if age < 30:
            base_allocation["sip_percentage"] += 5
            base_allocation["stocks_percentage"] += 3
            base_allocation["lifestyle_percentage"] -= 8
            reasoning.append("Age < 30: Increased long-term investment allocation")
        elif age > 50:
            base_allocation["sip_percentage"] -= 5
            base_allocation["stocks_percentage"] -= 5
            base_allocation["bonds_percentage"] += 10
            reasoning.append("Age > 50: More conservative allocation")

        # Adjust based on risk tolerance
        if risk_tolerance == "low":
            base_allocation["stocks_percentage"] = max(10, base_allocation["stocks_percentage"] - 5)
            base_allocation["bonds_percentage"] += 5
            reasoning.append("Low risk tolerance: Conservative allocation")
        elif risk_tolerance == "high":
            base_allocation["stocks_percentage"] = min(20, base_allocation["stocks_percentage"] + 5)
            base_allocation["bonds_percentage"] -= 5
            reasoning.append("High risk tolerance: Aggressive allocation")

        # Adjust based on job stability
        if job_stability < 5:
            base_allocation["emergency_fund_percentage"] += 5
            base_allocation["lifestyle_percentage"] -= 5
            reasoning.append("Low job stability: Prioritize emergency fund")

        # Adjust based on market conditions
        if market_conditions == "bull":
            base_allocation["stocks_percentage"] += 3
            base_allocation["bonds_percentage"] -= 3
            reasoning.append("Bull market: Increased equity exposure")
        elif market_conditions == "bear":
            base_allocation["stocks_percentage"] -= 3
            base_allocation["bonds_percentage"] += 3
            reasoning.append("Bear market: Reduced equity exposure")

        # Adjust for emergency fund adequacy
        monthly_expenses = expenses
        current_months = emergency_fund / monthly_expenses if monthly_expenses > 0 else 0
        target_months = 6

        if current_months < target_months:
            additional_emergency = min(10, (target_months - current_months) * 2)
            base_allocation["emergency_fund_percentage"] += additional_emergency
            base_allocation["lifestyle_percentage"] -= additional_emergency
            reasoning.append(f"Emergency fund needs {target_months - current_months:.1f} more months coverage")

        # Adjust for debt burden
        debt_to_income = debt / (income * 12) if income > 0 else 1
        if debt_to_income > 0.5:
            base_allocation["lifestyle_percentage"] -= 5
            base_allocation["emergency_fund_percentage"] += 5
            reasoning.append("High debt burden: Conservative spending")

        # Ensure percentages sum to 100
        total = sum(base_allocation.values())
        if abs(total - 100) > 0.1:
            # Normalize to 100%
            factor = 100 / total
            for key in base_allocation:
                base_allocation[key] *= factor

        return {
            **base_allocation,
            "reasoning": reasoning,
            "confidence": 0.85,  # AI confidence score
            "market_context": market_conditions,
            "risk_adjustment": risk_tolerance
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Allocation optimization failed: {str(e)}")

@app.post("/predictive-analytics")
def predictive_analytics(request: PredictiveAnalyticsRequest):
    """Generate predictive analytics"""
    try:
        prediction_type = request.prediction_type
        time_horizon = request.time_horizon
        user_data = request.user_data

        # Mock predictions (replace with actual ML models)
        if prediction_type == "survival_probability":
            # Predict financial survival probability
            base_probability = 0.8
            factors = []

            # Adjust based on data
            if user_data.get("emergency_months", 0) < 3:
                base_probability -= 0.2
                factors.append("Low emergency fund")
            if user_data.get("debt_ratio", 0) > 0.5:
                base_probability -= 0.15
                factors.append("High debt ratio")
            if user_data.get("savings_rate", 0) < 10:
                base_probability -= 0.1
                factors.append("Low savings rate")

            return {
                "prediction_type": prediction_type,
                "time_horizon": time_horizon,
                "predicted_value": max(0.1, base_probability),
                "confidence_score": 0.75,
                "factors": factors,
                "recommendations": [
                    "Build emergency fund to 6 months",
                    "Reduce debt-to-income ratio below 50%",
                    "Increase savings rate to 20%+"
                ]
            }

        elif prediction_type == "layoff_risk":
            # Predict job loss risk
            industry_risk = {"IT": 0.15, "Manufacturing": 0.25, "Retail": 0.35}.get(user_data.get("industry", "IT"), 0.2)
            experience_factor = max(0.5, user_data.get("experience_years", 1) / 10)

            risk_score = industry_risk / experience_factor

            return {
                "prediction_type": prediction_type,
                "time_horizon": time_horizon,
                "predicted_value": min(0.9, risk_score),
                "confidence_score": 0.7,
                "factors": ["Industry risk", "Experience level"],
                "recommendations": [
                    "Build emergency fund",
                    "Diversify income sources",
                    "Update resume and skills"
                ]
            }

        elif prediction_type == "savings_trajectory":
            # Predict future savings
            current_savings = user_data.get("current_savings", 0)
            monthly_savings = user_data.get("monthly_savings", 0)
            expected_growth = user_data.get("expected_return", 7) / 100 / 12  # Monthly

            months = 12 if time_horizon == "12month" else 6 if time_horizon == "6month" else 3

            future_value = current_savings
            for _ in range(months):
                future_value = (future_value + monthly_savings) * (1 + expected_growth)

            return {
                "prediction_type": prediction_type,
                "time_horizon": time_horizon,
                "predicted_value": future_value,
                "confidence_score": 0.8,
                "factors": ["Current savings", "Monthly contribution", "Expected returns"],
                "recommendations": [
                    "Increase monthly savings",
                    "Consider higher return investments",
                    "Automate savings transfers"
                ]
            }

        else:
            raise HTTPException(status_code=400, detail=f"Unknown prediction type: {prediction_type}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Predictive analytics failed: {str(e)}")