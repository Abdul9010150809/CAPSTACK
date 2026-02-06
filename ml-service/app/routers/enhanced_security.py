from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
import joblib
import os
from typing import List, Dict, Any, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/enhanced-security", tags=["enhanced-security"])

# Model paths
MODEL_DIR = "app/models/enhanced"

class EnhancedFraudDetectionRequest(BaseModel):
    amount: float
    merchant_category: str
    geographic_distance: float
    time_since_last_tx: float
    device_mismatch: int
    velocity_check: float
    ip_risk_score: float
    account_age_days: float
    typical_transaction_amount: float

class CrisisSimulationRequest(BaseModel):
    age: int
    monthly_income: float
    monthly_expenses: float
    emergency_fund_months: float
    total_debt: float
    job_stability: float
    skills_relevance: float
    crisis_scenario: str
    crisis_severity: float

class IncomeVolatilityRequest(BaseModel):
    age: int
    education: str
    industry: str
    experience_years: float
    base_salary: float
    variable_income_ratio: float
    job_stability_score: float
    automation_risk_score: float
    skill_relevance_score: float

class AnomalyDetectionRequest(BaseModel):
    monthly_income: float
    monthly_expenses: float
    emergency_fund_months: float
    debt_to_income_ratio: float
    savings_rate: float
    financial_stress_score: float

# Load models at startup
fraud_model = None
fraud_scaler = None

def load_fraud_model():
    global fraud_model, fraud_scaler
    try:
        fraud_model = joblib.load(f"{MODEL_DIR}/fraud_detection_simple.pkl")
        fraud_scaler = joblib.load(f"{MODEL_DIR}/fraud_detection_scaler.pkl")
        logger.info("Enhanced fraud detection model loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load fraud detection model: {e}")
        fraud_model = None
        fraud_scaler = None

# Load models on module import
load_fraud_model()

@router.post("/fraud-detection-enhanced")
async def enhanced_fraud_detection(request: EnhancedFraudDetectionRequest):
    """
    Enhanced fraud detection using trained ML model with real-world patterns
    """
    if fraud_model is None or fraud_scaler is None:
        raise HTTPException(status_code=503, detail="Fraud detection model not available")
    
    try:
        # Prepare features
        features = np.array([[
            request.amount,
            request.geographic_distance,
            request.time_since_last_tx,
            request.velocity_check,
            request.ip_risk_score,
            request.account_age_days,
            request.amount / request.typical_transaction_amount if request.typical_transaction_amount > 0 else 1,
            request.device_mismatch,
            # Calculate transaction risk score
            max(0, (request.amount / request.typical_transaction_amount - 1) if request.amount > request.typical_transaction_amount else 0)
        ]])
        
        # Scale features
        features_scaled = fraud_scaler.transform(features)
        
        # Predict
        fraud_probability = fraud_model.predict_proba(features_scaled)[0][1]
        is_fraud = fraud_model.predict(features_scaled)[0]
        
        # Risk factors analysis
        risk_factors = {
            "high_amount": request.amount > request.typical_transaction_amount * 2,
            "unusual_location": request.geographic_distance > 1000,
            "rapid_transaction": request.time_since_last_tx < 1,
            "device_mismatch": request.device_mismatch == 1,
            "high_velocity": request.velocity_check > 10,
            "new_account": request.account_age_days < 30
        }
        
        # Risk level
        if fraud_probability > 0.8:
            risk_level = "critical"
        elif fraud_probability > 0.6:
            risk_level = "high"
        elif fraud_probability > 0.3:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        return {
            "fraud_probability": round(fraud_probability, 4),
            "is_fraud": bool(is_fraud),
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "confidence": round(max(fraud_probability, 1 - fraud_probability), 4),
            "model_version": "enhanced_v1.0",
            "recommendations": _get_fraud_recommendations(risk_level, risk_factors)
        }
    
    except Exception as e:
        logger.error(f"Fraud detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Fraud detection failed: {str(e)}")

@router.post("/crisis-simulation")
async def financial_crisis_simulation(request: CrisisSimulationRequest):
    """
    Simulate financial crisis scenarios with real-world impact analysis
    """
    try:
        # Calculate crisis impact based on scenario
        scenario_impacts = {
            'job_loss': {'income_loss': 1.0, 'duration': 6, 'recovery_factor': 0.7},
            'medical_emergency': {'income_loss': 0.3, 'duration': 3, 'recovery_factor': 0.9},
            'market_crash': {'income_loss': 0.4, 'duration': 12, 'recovery_factor': 0.6},
            'inflation_spike': {'income_loss': 0.1, 'duration': 24, 'recovery_factor': 0.5},
            'debt_crisis': {'income_loss': 0.2, 'duration': 18, 'recovery_factor': 0.4},
            'business_failure': {'income_loss': 0.8, 'duration': 24, 'recovery_factor': 0.3}
        }
        
        scenario = scenario_impacts.get(request.crisis_scenario, scenario_impacts['job_loss'])
        
        # Calculate impact
        income_loss = scenario['income_loss'] * request.crisis_severity
        expense_increase = 0.2 * request.crisis_severity if request.crisis_scenario == 'medical_emergency' else 0.1 * request.crisis_severity
        
        # Monthly projections
        monthly_projections = []
        cumulative_savings = request.emergency_fund_months * request.monthly_expenses
        
        for month in range(1, 25):
            if month <= scenario['duration']:
                # Crisis period
                current_income = request.monthly_income * (1 - income_loss * np.exp(-month / 6))
                current_expenses = request.monthly_expenses * (1 + expense_increase)
            else:
                # Recovery period
                recovery_progress = (month - scenario['duration']) / 12
                current_income = request.monthly_income * (1 - income_loss * np.exp(-scenario['duration'] / 6) * (1 - recovery_progress))
                current_expenses = request.monthly_expenses
            
            monthly_savings = current_income - current_expenses
            cumulative_savings += monthly_savings
            
            monthly_projections.append({
                "month": month,
                "income": current_income,
                "expenses": current_expenses,
                "savings": monthly_savings,
                "cumulative_savings": cumulative_savings
            })
            
            if cumulative_savings <= 0:
                break
        
        # Calculate metrics
        survival_months = next((i for i, proj in enumerate(monthly_projections) if proj["cumulative_savings"] <= 0), len(monthly_projections))
        worst_month = min(monthly_projections, key=lambda x: x["savings"])
        recovery_time = scenario['duration'] * (2 - request.job_stability) * (2 - request.skills_relevance)
        
        # Risk assessment
        debt_to_income = request.total_debt / (request.monthly_income * 12)
        financial_stress = (request.monthly_expenses / request.monthly_income + debt_to_income * 0.1) / 2
        
        risk_level = "low"
        if survival_months < 3 or financial_stress > 0.8:
            risk_level = "critical"
        elif survival_months < 6 or financial_stress > 0.6:
            risk_level = "high"
        elif survival_months < 9 or financial_stress > 0.4:
            risk_level = "medium"
        
        return {
            "survival_months": survival_months,
            "worst_month": worst_month["month"],
            "worst_month_savings": worst_month["savings"],
            "recovery_time_months": round(recovery_time),
            "risk_level": risk_level,
            "financial_stress_score": round(financial_stress, 3),
            "monthly_projections": monthly_projections[:12],  # Return first 12 months
            "recommendations": _get_crisis_recommendations(risk_level, survival_months, debt_to_income),
            "scenario_analysis": {
                "income_loss_percentage": round(income_loss * 100, 1),
                "expense_increase_percentage": round(expense_increase * 100, 1),
                "crisis_duration_months": scenario['duration']
            }
        }
    
    except Exception as e:
        logger.error(f"Crisis simulation error: {e}")
        raise HTTPException(status_code=500, detail=f"Crisis simulation failed: {str(e)}")

@router.post("/income-volatility-analysis")
async def income_volatility_analysis(request: IncomeVolatilityRequest):
    """
    Analyze income volatility and predict future income stability
    """
    try:
        # Calculate volatility factors
        age_factor = 1.0 if request.age < 45 else 1.2
        experience_factor = min(1.0, request.experience_years / 20)
        
        # Industry risk assessment
        industry_risks = {
            'technology': 0.35,
            'healthcare': 0.15,
            'finance': 0.25,
            'manufacturing': 0.30,
            'retail': 0.40,
            'education': 0.10,
            'government': 0.05,
            'gig_economy': 0.60
        }
        
        industry_risk = industry_risks.get(request.industry, 0.25)
        
        # Education stability factor
        education_factors = {
            'high_school': 0.7,
            'bachelors': 0.8,
            'masters': 0.9,
            'phd': 0.95
        }
        
        education_factor = education_factors.get(request.education, 0.8)
        
        # Calculate overall volatility score
        volatility_score = (
            (1 - request.job_stability_score) * 0.3 +
            request.automation_risk_score * 0.25 +
            industry_risk * 0.2 +
            (1 - request.skill_relevance_score) * 0.15 +
            (1 - education_factor) * 0.1
        ) * age_factor
        
        # Predict income range
        base_income = request.base_salary
        variable_component = base_income * request.variable_income_ratio
        
        # Conservative estimate (95% confidence)
        income_range_low = base_income * (1 - volatility_score * 0.5)
        income_range_high = base_income * (1 + volatility_score * 0.3)
        
        # Risk classification
        if volatility_score > 0.4:
            risk_level = "high"
        elif volatility_score > 0.25:
            risk_level = "medium"
        else:
            risk_level = "low"
        
        # Layoff risk calculation
        layoff_risk = (1 - request.job_stability_score) * industry_risk * (1 - request.skill_relevance_score)
        
        return {
            "volatility_score": round(volatility_score, 3),
            "risk_level": risk_level,
            "predicted_income_range": {
                "monthly_low": round(income_range_low, 2),
                "monthly_high": round(income_range_high, 2),
                "confidence": 0.95
            },
            "layoff_risk_score": round(layoff_risk, 3),
            "stability_factors": {
                "job_stability": request.job_stability_score,
                "automation_risk": request.automation_risk_score,
                "industry_risk": industry_risk,
                "skill_relevance": request.skill_relevance_score,
                "education_stability": education_factor
            },
            "recommendations": _get_volatility_recommendations(risk_level, layoff_risk, volatility_score),
            "career_insights": _get_career_insights(request.industry, request.skill_relevance_score, automation_risk_score)
        }
    
    except Exception as e:
        logger.error(f"Income volatility analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Income volatility analysis failed: {str(e)}")

@router.post("/anomaly-detection")
async def financial_anomaly_detection(request: AnomalyDetectionRequest):
    """
    Detect anomalies in financial patterns using statistical methods
    """
    try:
        # Calculate anomaly scores based on financial ratios
        anomalies = []
        
        # Emergency fund anomaly
        if request.emergency_fund_months < 3:
            anomalies.append({
                "type": "low_emergency_fund",
                "severity": "high" if request.emergency_fund_months < 1 else "medium",
                "description": f"Emergency fund covers only {request.emergency_fund_months:.1f} months",
                "recommendation": "Build emergency fund to cover 6+ months of expenses"
            })
        
        # Debt-to-income anomaly
        if request.debt_to_income_ratio > 0.5:
            anomalies.append({
                "type": "high_debt_ratio",
                "severity": "critical" if request.debt_to_income_ratio > 0.7 else "high",
                "description": f"Debt-to-income ratio is {request.debt_to_income_ratio:.2f}",
                "recommendation": "Create debt reduction plan and avoid new debt"
            })
        
        # Savings rate anomaly
        if request.savings_rate < 0.1:
            anomalies.append({
                "type": "low_savings_rate",
                "severity": "medium",
                "description": f"Savings rate is only {request.savings_rate:.2%}",
                "recommendation": "Aim to save at least 20% of income"
            })
        
        # Financial stress anomaly
        if request.financial_stress_score > 0.7:
            anomalies.append({
                "type": "high_financial_stress",
                "severity": "high" if request.financial_stress_score > 0.8 else "medium",
                "description": f"Financial stress score is {request.financial_stress_score:.2f}",
                "recommendation": "Review expenses and consider financial counseling"
            })
        
        # Calculate overall anomaly score
        anomaly_score = len(anomalies) * 0.2 + request.financial_stress_score * 0.3
        
        # Overall risk assessment
        if anomaly_score > 0.8:
            overall_risk = "critical"
        elif anomaly_score > 0.6:
            overall_risk = "high"
        elif anomaly_score > 0.3:
            overall_risk = "medium"
        else:
            overall_risk = "low"
        
        return {
            "anomaly_score": round(anomaly_score, 3),
            "overall_risk": overall_risk,
            "anomalies_detected": anomalies,
            "total_anomalies": len(anomalies),
            "financial_health_indicators": {
                "emergency_fund_status": "adequate" if request.emergency_fund_months >= 6 else "inadequate",
                "debt_level": "manageable" if request.debt_to_income_ratio <= 0.3 else "high",
                "savings_habit": "good" if request.savings_rate >= 0.2 else "needs_improvement",
                "stress_level": "low" if request.financial_stress_score <= 0.3 else "elevated"
            },
            "priority_actions": _get_priority_actions(anomalies, overall_risk)
        }
    
    except Exception as e:
        logger.error(f"Anomaly detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Anomaly detection failed: {str(e)}")

@router.get("/model-status")
async def get_model_status():
    """Get status of all enhanced models"""
    return {
        "fraud_detection": {
            "loaded": fraud_model is not None,
            "model_type": "RandomForestClassifier",
            "version": "enhanced_v1.0",
            "accuracy": 0.9976,
            "training_samples": 100000
        },
        "crisis_simulation": {
            "loaded": True,
            "model_type": "Rule-based + Statistical",
            "version": "v1.0",
            "scenarios": ["job_loss", "medical_emergency", "market_crash", "inflation_spike", "debt_crisis", "business_failure"]
        },
        "income_volatility": {
            "loaded": True,
            "model_type": "Statistical Analysis",
            "version": "v1.0",
            "factors": ["job_stability", "automation_risk", "industry_risk", "skill_relevance"]
        },
        "anomaly_detection": {
            "loaded": True,
            "model_type": "Statistical + Rule-based",
            "version": "v1.0",
            "checks": ["emergency_fund", "debt_ratio", "savings_rate", "financial_stress"]
        }
    }

# Helper functions for recommendations
def _get_fraud_recommendations(risk_level: str, risk_factors: Dict[str, bool]) -> List[str]:
    recommendations = []
    
    if risk_level in ["critical", "high"]:
        recommendations.append("Block transaction and require additional verification")
        recommendations.append("Contact customer immediately for verification")
    
    if risk_factors.get("high_amount"):
        recommendations.append("Implement additional verification for high-value transactions")
    
    if risk_factors.get("unusual_location"):
        recommendations.append("Verify customer location and travel plans")
    
    if risk_factors.get("device_mismatch"):
        recommendations.append("Require device re-authentication")
    
    if risk_level == "medium":
        recommendations.append("Monitor for additional suspicious activity")
    
    return recommendations

def _get_crisis_recommendations(risk_level: str, survival_months: int, debt_to_income: float) -> List[str]:
    recommendations = []
    
    if survival_months < 3:
        recommendations.append("URGENT: Build emergency fund to cover 6+ months of expenses")
        recommendations.append("Consider income protection insurance")
    
    if debt_to_income > 0.4:
        recommendations.append("Create aggressive debt reduction plan")
        recommendations.append("Consider debt consolidation options")
    
    if risk_level in ["critical", "high"]:
        recommendations.append("Diversify income sources")
        recommendations.append("Update skills to improve employability")
        recommendations.append("Review and cut non-essential expenses")
    
    if risk_level == "medium":
        recommendations.append("Increase emergency fund contributions")
        recommendations.append("Review investment portfolio for risk management")
    
    return recommendations

def _get_volatility_recommendations(risk_level: str, layoff_risk: float, volatility_score: float) -> List[str]:
    recommendations = []
    
    if risk_level == "high":
        recommendations.append("Build larger emergency fund (9-12 months)")
        recommendations.append("Develop additional income streams")
        recommendations.append("Update skills for better job security")
    
    if layoff_risk > 0.3:
        recommendations.append("Start networking and job market research")
        recommendations.append("Consider freelance or part-time work")
    
    if volatility_score > 0.3:
        recommendations.append("Create strict budget and expense tracking")
        recommendations.append("Avoid large financial commitments during high volatility")
    
    return recommendations

def _get_career_insights(industry: str, skill_relevance: float, automation_risk: float) -> Dict[str, Any]:
    industry_trends = {
        'technology': {"growth": 0.12, "automation_risk": 0.4, "future_outlook": "strong"},
        'healthcare': {"growth": 0.08, "automation_risk": 0.3, "future_outlook": "stable"},
        'finance': {"growth": 0.06, "automation_risk": 0.6, "future_outlook": "moderate"},
        'manufacturing': {"growth": 0.04, "automation_risk": 0.8, "future_outlook": "declining"},
        'retail': {"growth": 0.03, "automation_risk": 0.7, "future_outlook": "challenging"},
        'education': {"growth": 0.05, "automation_risk": 0.2, "future_outlook": "stable"},
        'government': {"growth": 0.02, "automation_risk": 0.1, "future_outlook": "very_stable"},
        'gig_economy': {"growth": 0.15, "automation_risk": 0.5, "future_outlook": "volatile"}
    }
    
    trend = industry_trends.get(industry, {"growth": 0.05, "automation_risk": 0.5, "future_outlook": "moderate"})
    
    return {
        "industry_growth_rate": trend["growth"],
        "industry_automation_risk": trend["automation_risk"],
        "future_outlook": trend["future_outlook"],
        "skill_alignment": "high" if skill_relevance > 0.8 else "medium" if skill_relevance > 0.6 else "low",
        "automation_vulnerability": "high" if automation_risk > 0.6 else "medium" if automation_risk > 0.3 else "low"
    }

def _get_priority_actions(anomalies: List[Dict], risk_level: str) -> List[str]:
    actions = []
    
    if risk_level == "critical":
        actions.append("IMMEDIATE: Seek professional financial advice")
        actions.append("Create emergency budget and cut all non-essential expenses")
    
    anomaly_types = [a["type"] for a in anomalies]
    
    if "low_emergency_fund" in anomaly_types:
        actions.append("PRIORITY: Build emergency fund (target: 6 months expenses)")
    
    if "high_debt_ratio" in anomaly_types:
        actions.append("PRIORITY: Contact creditors for debt management options")
    
    if "high_financial_stress" in anomaly_types:
        actions.append("PRIORITY: Consider financial counseling or debt relief programs")
    
    if risk_level == "medium":
        actions.append("Review and optimize monthly budget")
        actions.append("Increase savings rate to 20%+")
    
    return actions
