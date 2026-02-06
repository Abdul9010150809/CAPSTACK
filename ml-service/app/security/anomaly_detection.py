import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix
import joblib
from typing import Dict, List, Tuple
import json
from datetime import datetime, timedelta
import hashlib

class AnomalyDetectionEngine:
    """
    ML-based anomaly detection for fraud, intrusion, and suspicious patterns
    Trained on large-scale financial and security event datasets
    """

    def __init__(self, model_dir: str = "ml-service/app/models"):
        self.model_dir = model_dir
        self.fraud_model = None
        self.intrusion_model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            "transaction_amount",
            "transaction_frequency",
            "geographic_distance",
            "time_since_last_tx",
            "device_mismatch",
            "velocity_check",
            "ip_risk_score",
            "account_age_days",
        ]

    def train_fraud_detection_model(self, X_train, y_train, X_test, y_test):
        """
        Train Random Forest model for fraud detection
        y_train: 1 for fraud, 0 for legitimate
        """
        self.fraud_model = RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=10,
            class_weight="balanced",
            random_state=42,
            n_jobs=-1,
        )

        self.fraud_model.fit(X_train, y_train)

        # Evaluate
        y_pred = self.fraud_model.predict(X_test)
        print("Fraud Detection Model Evaluation:")
        print(classification_report(y_test, y_pred))

        return self.fraud_model

    def train_intrusion_detection_model(self, X_train, X_test):
        """
        Train Isolation Forest for intrusion/anomaly detection
        Unsupervised learning for network traffic anomalies
        """
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)

        self.intrusion_model = IsolationForest(
            contamination=0.05,  # 5% anomalies
            random_state=42,
            n_jobs=-1,
        )

        self.intrusion_model.fit(X_train_scaled)

        # Evaluate
        y_pred = self.intrusion_model.predict(X_test_scaled)
        anomalies = sum(y_pred == -1)
        print(f"Intrusion Detection Model: Detected {anomalies} anomalies in test set")

        return self.intrusion_model

    def predict_fraud(self, transaction: Dict) -> Dict:
        """
        Predict fraud probability for a transaction
        """
        if self.fraud_model is None:
            raise ValueError("Fraud model not trained")

        features = self._extract_features(transaction)
        X = np.array([features])

        fraud_prob = self.fraud_model.predict_proba(X)[0][1]
        is_fraud = self.fraud_model.predict(X)[0]

        return {
            "is_fraud": bool(is_fraud),
            "fraud_probability": float(fraud_prob),
            "risk_level": "HIGH" if fraud_prob > 0.7 else "MEDIUM" if fraud_prob > 0.4 else "LOW",
            "features": {name: val for name, val in zip(self.feature_names, features)},
        }

    def detect_anomalies(self, transactions: List[Dict]) -> List[Dict]:
        """
        Detect anomalies in a batch of transactions
        """
        if self.intrusion_model is None:
            raise ValueError("Intrusion model not trained")

        results = []
        for tx in transactions:
            features = self._extract_features(tx)
            X = np.array([features])
            X_scaled = self.scaler.transform(X)

            anomaly_score = self.intrusion_model.score_samples(X_scaled)[0]
            is_anomaly = self.intrusion_model.predict(X_scaled)[0] == -1

            results.append(
                {
                    "transaction_id": tx.get("id"),
                    "is_anomaly": bool(is_anomaly),
                    "anomaly_score": float(anomaly_score),
                    "severity": self._calculate_severity(anomaly_score),
                }
            )

        return results

    def _extract_features(self, transaction: Dict) -> List[float]:
        """
        Extract features from transaction for ML model
        """
        return [
            float(transaction.get("amount", 0)),
            float(transaction.get("frequency", 0)),
            float(transaction.get("geographic_distance", 0)),
            float(transaction.get("time_since_last_tx", 0)),
            float(transaction.get("device_mismatch", 0)),
            float(transaction.get("velocity_check", 0)),
            float(transaction.get("ip_risk_score", 0)),
            float(transaction.get("account_age_days", 0)),
        ]

    def _calculate_severity(self, anomaly_score: float) -> str:
        """
        Calculate severity based on anomaly score
        """
        if anomaly_score < -0.3:
            return "CRITICAL"
        elif anomaly_score < -0.1:
            return "HIGH"
        elif anomaly_score < 0.1:
            return "MEDIUM"
        else:
            return "LOW"

    def save_models(self):
        """Save trained models to disk"""
        if self.fraud_model:
            joblib.dump(
                self.fraud_model, f"{self.model_dir}/fraud_detection_model.pkl"
            )
        if self.intrusion_model:
            joblib.dump(
                self.intrusion_model,
                f"{self.model_dir}/intrusion_detection_model.pkl",
            )
        joblib.dump(self.scaler, f"{self.model_dir}/scaler.pkl")

    def load_models(self):
        """Load pre-trained models from disk"""
        self.fraud_model = joblib.load(
            f"{self.model_dir}/fraud_detection_model.pkl"
        )
        self.intrusion_model = joblib.load(
            f"{self.model_dir}/intrusion_detection_model.pkl"
        )
        self.scaler = joblib.load(f"{self.model_dir}/scaler.pkl")
