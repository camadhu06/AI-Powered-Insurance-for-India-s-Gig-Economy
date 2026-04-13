from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import pandas as pd
import numpy as np

app = FastAPI(title="GigWare AI/ML Backend", description="AI services for Income Estimation and Fraud Detection")

# Load models
try:
    with open('models/income_regressor.pkl', 'rb') as f:
        income_model = pickle.load(f)
    with open('models/fraud_xgboost.pkl', 'rb') as f:
        fraud_model = pickle.load(f)
except Exception as e:
    print("Warning: Models not found. Please run train_models.py first.")
    income_model = None
    fraud_model = None

class IncomeRequest(BaseModel):
    hours_lost: float
    hourly_rate: float
    trigger_severity: float
    zone_risk: float

class FraudRequest(BaseModel):
    gps_mock: int
    distance: float
    claim_velocity: int
    platform_active: int

class RiskRequest(BaseModel):
    city: str
    historical_claims: int
    avg_weather_severity: float

@app.post("/predict/income")
async def predict_income(req: IncomeRequest):
    if not income_model:
        raise HTTPException(status_code=500, detail="Income model not loaded")
    
    # Format feature array
    X = pd.DataFrame([{
        'hours_lost': req.hours_lost,
        'hourly_rate': req.hourly_rate,
        'trigger_severity': req.trigger_severity,
        'zone_risk': req.zone_risk
    }])
    
    pred_loss = income_model.predict(X)[0]
    return {"estimated_loss": max(0, round(float(pred_loss), 2))}

@app.post("/predict/fraud")
async def predict_fraud(req: FraudRequest):
    if not fraud_model:
        raise HTTPException(status_code=500, detail="Fraud model not loaded")
    
    X = pd.DataFrame([{
        'gps_mock': req.gps_mock,
        'distance': req.distance,
        'claim_velocity': req.claim_velocity,
        'platform_active': req.platform_active
    }])
    
    # Predict probabilities (Score 0-100)
    prob_fraud = fraud_model.predict_proba(X)[0][1]
    fraud_score = round(float(prob_fraud) * 100, 2)
    
    status = "Approved"
    if fraud_score > 75:
        status = "Blocked"
    elif fraud_score > 40:
        status = "Revalidation"

    return {
        "fraud_score": fraud_score,
        "status": status,
        "details": f"Fraud probability {fraud_score}%"
    }

@app.post("/predict/risk")
async def predict_risk(req: RiskRequest):
    # Rule-based synthetic risk scoring for demonstration
    base_risk = 1.0
    if req.historical_claims > 50:
        base_risk += 0.2
    if req.avg_weather_severity > 40:
        base_risk += 0.15
    return {"zone_risk_multiplier": round(base_risk, 2)}

@app.get("/")
def health_check():
    return {"status": "ok", "message": "GigWare AI/ML Service is running."}
