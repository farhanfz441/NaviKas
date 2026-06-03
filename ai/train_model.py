"""
FinTrack AI — Model Training Script
Jalankan: python train_model.py
"""
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_absolute_error
import joblib, os

print("=" * 50)
print("FinTrack AI — Training Model")
print("=" * 50)

# ── 1. Generate sample training data ──────────────────────────────
np.random.seed(42)
n = 2000

df = pd.DataFrame({
    "amount":      np.random.exponential(100000, n),
    "hour":        np.random.randint(0, 24, n),
    "category":    np.random.choice(["food","transport","shop","entertain","health","salary"], n),
    "day_of_week": np.random.randint(0, 7, n),
    "is_weekend":  np.random.randint(0, 2, n),
})

# Label: impulsif jika shop/entertain + malam + nominal tinggi
df["is_impulsive"] = (
    (df["category"].isin(["shop","entertain"])) &
    ((df["hour"] >= 21) | (df["hour"] < 5)) &
    (df["amount"] > 50000)
).astype(int)

# ── 2. Feature engineering ────────────────────────────────────────
df_enc = pd.get_dummies(df, columns=["category"])
X = df_enc.drop("is_impulsive", axis=1)
y = df_enc["is_impulsive"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ── 3. Train impulse classifier ───────────────────────────────────
print("\n[1/2] Training Impulse Classifier...")
clf = RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1)
clf.fit(X_train, y_train)
acc = accuracy_score(y_test, clf.predict(X_test))
print(f"      Accuracy: {acc:.2%}")

# ── 4. Train balance predictor ────────────────────────────────────
print("\n[2/2] Training Balance Predictor...")
df_bal = pd.DataFrame({
    "day_of_month":   np.random.randint(1, 28, n),
    "total_expense":  np.random.uniform(500000, 5000000, n),
    "total_income":   np.random.uniform(3000000, 10000000, n),
    "impulse_count":  np.random.randint(0, 15, n),
    "days_remaining": np.random.randint(0, 30, n),
})
df_bal["remaining_balance"] = (
    df_bal["total_income"] - df_bal["total_expense"] -
    (df_bal["total_expense"] / df_bal["day_of_month"] * df_bal["days_remaining"])
)

Xb = df_bal.drop("remaining_balance", axis=1)
yb = df_bal["remaining_balance"]
Xb_train, Xb_test, yb_train, yb_test = train_test_split(Xb, yb, test_size=0.2, random_state=42)

reg = GradientBoostingRegressor(n_estimators=100, random_state=42)
reg.fit(Xb_train, yb_train)
mae = mean_absolute_error(yb_test, reg.predict(Xb_test))
print(f"      MAE: Rp {mae:,.0f}")

# ── 5. Save models ────────────────────────────────────────────────
os.makedirs("models", exist_ok=True)
joblib.dump(clf, "models/impulse_classifier.pkl")
joblib.dump(reg, "models/balance_predictor.pkl")
joblib.dump(list(X.columns), "models/feature_columns.pkl")

print("\n✅ Model tersimpan di folder models/")
print("   - models/impulse_classifier.pkl")
print("   - models/balance_predictor.pkl")
print("   - models/feature_columns.pkl")
print("=" * 50)
