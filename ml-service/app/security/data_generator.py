import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import json

class SyntheticDataGenerator:
    """
    Generate large-scale synthetic financial and security datasets
    for ML model training with realistic patterns and anomalies
    """

    def __init__(self, seed: int = 42):
        random.seed(seed)
        np.random.seed(seed)

    def generate_transaction_dataset(self, n_samples: int = 10000) -> pd.DataFrame:
        """
        Generate synthetic transaction dataset with fraud labels
        """
        data = {
            "transaction_id": [f"TX_{i:06d}" for i in range(n_samples)],
            "user_id": np.random.choice(range(1, 2000), n_samples),
            "amount": np.random.lognormal(3, 2, n_samples),  # Log-normal distribution
            "merchant_category": np.random.choice(
                ["retail", "dining", "travel", "utilities", "online"], n_samples
            ),
            "timestamp": [
                datetime.now() - timedelta(days=random.randint(0, 365))
                for _ in range(n_samples)
            ],
            "transaction_frequency": np.random.poisson(3, n_samples),
            "geographic_distance": np.random.uniform(0, 1000, n_samples),
            "time_since_last_tx": np.random.exponential(24, n_samples),
            "device_mismatch": np.random.choice([0, 1], n_samples, p=[0.8, 0.2]),
            "velocity_check": np.random.uniform(0, 10, n_samples),
            "ip_risk_score": np.random.beta(2, 5, n_samples) * 100,
            "account_age_days": np.random.uniform(1, 3650, n_samples),
        }

        df = pd.DataFrame(data)

        # Add fraud labels (5% fraud rate)
        fraud_indices = np.random.choice(n_samples, size=int(0.05 * n_samples), replace=False)
        df["is_fraud"] = 0
        df.loc[fraud_indices, "is_fraud"] = 1

        # Inject fraud patterns
        df.loc[fraud_indices, "amount"] = np.random.lognormal(4, 2, len(fraud_indices))
        df.loc[fraud_indices, "geographic_distance"] = np.random.uniform(
            500, 2000, len(fraud_indices)
        )
        df.loc[fraud_indices, "velocity_check"] = np.random.uniform(
            5, 15, len(fraud_indices)
        )

        return df

    def generate_network_traffic_dataset(self, n_samples: int = 5000) -> pd.DataFrame:
        """
        Generate synthetic network traffic dataset for intrusion detection
        """
        data = {
            "packet_id": [f"PKT_{i:06d}" for i in range(n_samples)],
            "source_ip": [f"192.168.{random.randint(0,255)}.{random.randint(0,255)}" 
                         for _ in range(n_samples)],
            "destination_ip": [f"10.0.{random.randint(0,255)}.{random.randint(0,255)}" 
                              for _ in range(n_samples)],
            "packet_size": np.random.gamma(50, 2, n_samples),
            "protocol": np.random.choice(["TCP", "UDP", "ICMP", "HTTP"], n_samples),
            "port_number": np.random.choice(
                [22, 80, 443, 3306, 5432, 8080, 9200], n_samples
            ),
            "flags": np.random.choice(
                ["SYN", "ACK", "FIN", "RST", "PSH"], n_samples
            ),
            "packet_rate": np.random.exponential(100, n_samples),
            "byte_rate": np.random.exponential(10000, n_samples),
            "duration": np.random.uniform(0.001, 10, n_samples),
            "timestamp": [
                datetime.now() - timedelta(seconds=random.randint(0, 86400))
                for _ in range(n_samples)
            ],
        }

        df = pd.DataFrame(data)

        # Add anomaly patterns (intrusions, DoS attacks, port scans)
        anomaly_indices = np.random.choice(
            n_samples, size=int(0.05 * n_samples), replace=False
        )
        df["is_anomaly"] = 0
        df.loc[anomaly_indices, "is_anomaly"] = 1

        # Inject anomaly patterns
        df.loc[anomaly_indices, "packet_rate"] = np.random.exponential(1000, len(anomaly_indices))
        df.loc[anomaly_indices, "byte_rate"] = np.random.exponential(100000, len(anomaly_indices))
        df.loc[anomaly_indices, "port_number"] = np.random.choice(
            range(49152, 65535), len(anomaly_indices)
        )

        return df

    def generate_user_behavior_dataset(self, n_samples: int = 5000) -> pd.DataFrame:
        """
        Generate synthetic user behavior dataset for anomaly detection
        """
        data = {
            "event_id": [f"EVT_{i:06d}" for i in range(n_samples)],
            "user_id": np.random.choice(range(1, 1000), n_samples),
            "action_type": np.random.choice(
                ["login", "logout", "password_change", "data_access", "export"], n_samples
            ),
            "timestamp": [
                datetime.now() - timedelta(hours=random.randint(0, 168))
                for _ in range(n_samples)
            ],
            "login_attempts": np.random.poisson(1, n_samples),
            "failed_logins": np.random.poisson(0.1, n_samples),
            "time_of_day": np.random.uniform(0, 24, n_samples),
            "day_of_week": np.random.choice(range(7), n_samples),
            "location_country": np.random.choice(
                ["US", "UK", "India", "China", "Russia", "Unknown"], n_samples
            ),
            "device_type": np.random.choice(["Desktop", "Mobile", "Tablet"], n_samples),
            "session_duration": np.random.exponential(3600, n_samples),
        }

        df = pd.DataFrame(data)

        # Add suspicious behavior patterns
        suspicious_indices = np.random.choice(
            n_samples, size=int(0.05 * n_samples), replace=False
        )
        df["is_suspicious"] = 0
        df.loc[suspicious_indices, "is_suspicious"] = 1

        # Inject suspicious patterns
        df.loc[suspicious_indices, "time_of_day"] = np.random.uniform(0, 6, len(suspicious_indices))  # Off-hours
        df.loc[suspicious_indices, "failed_logins"] = np.random.poisson(5, len(suspicious_indices))
        df.loc[suspicious_indices, "action_type"] = np.random.choice(["data_access", "export"], len(suspicious_indices))

        return df

    def generate_compliance_audit_logs(self, n_samples: int = 1000) -> pd.DataFrame:
        """
        Generate synthetic compliance and audit logs (GDPR/HIPAA)
        """
        data = {
            "audit_id": [f"AUD_{i:06d}" for i in range(n_samples)],
            "user_id": np.random.choice(range(1, 500), n_samples),
            "action": np.random.choice(
                ["CREATE", "READ", "UPDATE", "DELETE", "EXPORT", "ENCRYPT"], n_samples
            ),
            "resource": np.random.choice(
                ["financial_data", "medical_record", "identity_info", "transaction"], n_samples
            ),
            "timestamp": [
                datetime.now() - timedelta(days=random.randint(0, 365))
                for _ in range(n_samples)
            ],
            "ip_address": [f"192.168.{random.randint(0,255)}.{random.randint(0,255)}" 
                           for _ in range(n_samples)],
            "user_role": np.random.choice(["admin", "analyst", "user", "guest"], n_samples),
            "status": np.random.choice(["SUCCESS", "FAILURE", "PARTIAL"], n_samples, p=[0.8, 0.15, 0.05]),
            "encrypted": np.random.choice([True, False], n_samples, p=[0.9, 0.1]),
        }

        return pd.DataFrame(data)

    def save_datasets_to_file(self, output_dir: str = "ml-service/data"):
        """Save all datasets to CSV files"""
        import os
        os.makedirs(output_dir, exist_ok=True)

        print("Generating large-scale training datasets...")

        # Transaction dataset
        tx_df = self.generate_transaction_dataset(50000)
        tx_df.to_csv(f"{output_dir}/transactions_50k.csv", index=False)
        print(f"✓ Generated transaction dataset: {len(tx_df)} samples")

        # Network traffic dataset
        net_df = self.generate_network_traffic_dataset(30000)
        net_df.to_csv(f"{output_dir}/network_traffic_30k.csv", index=False)
        print(f"✓ Generated network traffic dataset: {len(net_df)} samples")

        # User behavior dataset
        behavior_df = self.generate_user_behavior_dataset(25000)
        behavior_df.to_csv(f"{output_dir}/user_behavior_25k.csv", index=False)
        print(f"✓ Generated user behavior dataset: {len(behavior_df)} samples")

        # Compliance logs
        compliance_df = self.generate_compliance_audit_logs(10000)
        compliance_df.to_csv(f"{output_dir}/compliance_audit_10k.csv", index=False)
        print(f"✓ Generated compliance audit logs: {len(compliance_df)} samples")

        print(f"\nTotal: 115,000 training samples generated in {output_dir}/")


if __name__ == "__main__":
    generator = SyntheticDataGenerator()
    generator.save_datasets_to_file()
