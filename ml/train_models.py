import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import xgboost as xgb
import pickle
import os

# Create dummy data for Income Loss Estimator (Regression)
# Features: hours_lost, hourly_rate, trigger_severity, zone_risk_multiplier
np.random.seed(42)
n_samples = 2000

hours_lost = np.random.uniform(1, 10, n_samples)
hourly_rate = np.random.uniform(50, 150, n_samples)
trigger_severity = np.random.uniform(10, 100, n_samples)
zone_risk = np.random.choice([0.8, 1.0, 1.2], n_samples)

# Actual income lost usually = hours * rate. But weather conditions can cause a multiplier. 
# Added some noise
actual_loss = (hours_lost * hourly_rate) * zone_risk * (1 + (trigger_severity/500)) + np.random.normal(0, 50, n_samples)
# Cap loss at 0 at minimum
actual_loss = np.maximum(actual_loss, 0)

df_income = pd.DataFrame({
    'hours_lost': hours_lost,
    'hourly_rate': hourly_rate,
    'trigger_severity': trigger_severity,
    'zone_risk': zone_risk,
    'actual_loss': actual_loss
})

X_inc = df_income[['hours_lost', 'hourly_rate', 'trigger_severity', 'zone_risk']]
y_inc = df_income['actual_loss']

# Train Income Regressor
regressor = RandomForestRegressor(n_estimators=100, random_state=42)
regressor.fit(X_inc, y_inc)

print("Trained Income Regression Model. R^2:", regressor.score(X_inc, y_inc))

# Create dummy data for Fraud Detection (Anomaly / XGBoost Classifier)
# Features: gps_mock_flag, distance_from_zone_km, claim_velocity (claims per hour for city), platform_active
# Target: 1 (Fraud), 0 (Genuine)
n_fraud_samples = 5000
gps_mock = np.random.choice([0, 1], n_fraud_samples, p=[0.95, 0.05])
distance = np.random.exponential(scale=5, size=n_fraud_samples)
claim_velocity = np.random.poisson(lam=10, size=n_fraud_samples)
platform_active = np.random.choice([0, 1], n_fraud_samples, p=[0.2, 0.8])

# Define fraud rule logically for synthetic target
fraud_target = np.zeros(n_fraud_samples)
# If using mock GPS, highly likely fraud
fraud_target[gps_mock == 1] = 1
# If far from zone and not active on platform
fraud_target[(distance > 15) & (platform_active == 0)] = 1
# Coordinated attack: very high claim velocity and far from zone
fraud_target[(claim_velocity > 30) & (distance > 5)] = 1

# Introduce a little noise so the model has to learn
noise = np.random.choice([0, 1], size=n_fraud_samples, p=[0.98, 0.02])
fraud_target = (fraud_target + noise) % 2

df_fraud = pd.DataFrame({
    'gps_mock': gps_mock,
    'distance': distance,
    'claim_velocity': claim_velocity,
    'platform_active': platform_active,
    'is_fraud': fraud_target
})

X_fraud = df_fraud[['gps_mock', 'distance', 'claim_velocity', 'platform_active']]
y_fraud = df_fraud['is_fraud']

# Train XGBoost Fraud Classifier
estimator = xgb.XGBClassifier(use_label_encoder=False, eval_metric='logloss', random_state=42)
estimator.fit(X_fraud, y_fraud)

print("Trained Fraud XGBoost Model. Accuracy:", estimator.score(X_fraud, y_fraud))

# Save models
os.makedirs('models', exist_ok=True)
with open('models/income_regressor.pkl', 'wb') as f:
    pickle.dump(regressor, f)

with open('models/fraud_xgboost.pkl', 'wb') as f:
    pickle.dump(estimator, f)

print("Models saved successfully to 'models/' directory.")
