"""
FinTrack Data Science — Dataset Generator
Jalankan: python generate_dataset.py
Menghasilkan dataset keuangan sintetis untuk training model AI
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os

np.random.seed(42)
os.makedirs("dataset", exist_ok=True)

print("Generating FinTrack dataset...")

CATEGORIES  = ["food","transport","health","shop","entertain","salary","other"]
DESCS = {
    "food":      ["Makan siang","Kopi","GrabFood","Warung makan","Sarapan"],
    "transport": ["Gojek","Bensin","Grab","Parkir","KRL"],
    "health":    ["Vitamin","Apotek","Klinik","Gym","Masker"],
    "shop":      ["Shopee","Tokopedia","Indomaret","Alfamart","Lazada"],
    "entertain": ["Netflix","Spotify","Game top-up","Bioskop","YouTube Premium"],
    "salary":    ["Gaji bulanan","Freelance","Bonus","Tunjangan"],
    "other":     ["Transfer","Lain-lain","Tak terduga"],
}

records = []
user_ids = [f"user_{i:03d}" for i in range(1, 51)]

for uid in user_ids:
    start = datetime(2025, 1, 1)
    for month in range(10):
        base = start + timedelta(days=month*30)
        # Income
        records.append({"user_id":uid,"date":(base+timedelta(days=1)).strftime("%Y-%m-%d"),
                        "time":"10:00","category":"salary","type":"income",
                        "amount":np.random.choice([4500000,5000000,6000000,7500000,8000000]),
                        "description":"Gaji bulanan","is_impulsive":False})
        # Expenses (15-25 per month)
        n_txn = np.random.randint(15, 26)
        for _ in range(n_txn):
            cat  = np.random.choice(CATEGORIES[:-1], p=[.30,.15,.10,.20,.15,.05,.05])
            day  = np.random.randint(1, 29)
            hour = np.random.randint(0, 24)
            amt  = {
                "food":np.random.uniform(10000,120000),
                "transport":np.random.uniform(5000,80000),
                "health":np.random.uniform(20000,300000),
                "shop":np.random.uniform(50000,500000),
                "entertain":np.random.uniform(15000,200000),
                "other":np.random.uniform(10000,150000),
            }[cat]
            imp = (cat in ["shop","entertain"]) and (21<=hour or hour<5) and (amt>50000)
            records.append({
                "user_id":uid,
                "date":(base+timedelta(days=day)).strftime("%Y-%m-%d"),
                "time":f"{hour:02d}:{np.random.randint(0,60):02d}",
                "category":cat,"type":"expense","amount":round(amt,0),
                "description":np.random.choice(DESCS[cat]),"is_impulsive":imp
            })

df = pd.DataFrame(records).sort_values(["user_id","date","time"]).reset_index(drop=True)
df.to_csv("dataset/transactions_raw.csv", index=False)
print(f"✅ Raw dataset: {len(df)} rows → dataset/transactions_raw.csv")

# Clean version
df_clean = df.copy()
df_clean["amount"]  = df_clean["amount"].round(0)
df_clean["date"]    = pd.to_datetime(df_clean["date"])
df_clean["month"]   = df_clean["date"].dt.to_period("M").astype(str)
df_clean["weekday"] = df_clean["date"].dt.day_name()
df_clean["hour"]    = df_clean["time"].str.split(":").str[0].astype(int)
df_clean.to_csv("dataset/transactions_clean.csv", index=False)
print(f"✅ Clean dataset: {len(df_clean)} rows → dataset/transactions_clean.csv")
print(f"   Kolom: {list(df_clean.columns)}")
print(f"   Users: {df_clean['user_id'].nunique()}")
print(f"   Impulsive rate: {df_clean['is_impulsive'].mean():.1%}")
