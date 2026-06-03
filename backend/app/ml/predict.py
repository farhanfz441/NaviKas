"""
FinTrack ML Module
  - is_impulsive()     : deteksi transaksi impulsif
  - predict_balance()  : prediksi saldo akhir bulan
  - compute_dna_score(): Financial DNA Score (0-100)
"""
from datetime import datetime, timedelta

MONTHLY_CATEGORIES = {"housing", "kos", "rent", "bills", "subscription", "health", "kesehatan"}

ONETIME_FIXED_THRESHOLD = 300_000

def is_impulsive(amount: float, category_id: str, date: datetime) -> bool:
    HIGH_RISK = {"shop", "entertain"}
    if category_id not in HIGH_RISK:
        return False
    hour      = date.hour
    is_night  = 21 <= hour or hour < 5
    threshold = 30_000 if is_night else 50_000
    if amount < threshold:
        return False
    score = 0
    if is_night:               score += 0.4
    if amount > 200_000:       score += 0.3
    if category_id == "shop":  score += 0.2
    else:                      score += 0.15
    return score >= 0.4

def predict_balance(transactions: list, month: str, current_balance: float = 0.0) -> dict:
    """
    Prediksi saldo akhir bulan berdasarkan transaksi aktual user.

    Logika fix:
    - One-time expense = transaksi >= Rp 300rb ATAU kategori bulanan (health, kos, bills, dll)
      → sudah terjadi, tidak diproyeksikan ke depan
    - Routine expense = transaksi kecil < Rp 300rb (makan, transport, kopi, dll)
      → diproyeksikan ke sisa hari bulan berdasarkan rata-rata harian
    - Threshold tidak lagi bergantung income (bug lama: 20% x 30jt = 6jt threshold)
    """
    if not transactions:
        return {
            "predicted_balance": current_balance,
            "risk_level": "low",
            "confidence": 0.5,
            "days_remaining": 0
        }

    today = datetime.now()
    year, mon = map(int, month.split("-"))
    if mon == 12:
        last_day = datetime(year + 1, 1, 1) - timedelta(days=1)
    else:
        last_day = datetime(year, mon + 1, 1) - timedelta(days=1)

    days_passed    = max((today - datetime(year, mon, 1)).days, 1)
    days_remaining = max((last_day - today).days, 0)

    income       = sum(t["amount"] for t in transactions if t["type"] == "income")
    expense_txns = [t for t in transactions if t["type"] == "expense"]
    expense      = sum(t["amount"] for t in expense_txns)

    def is_onetime(t):
        cat = str(t.get("category_id", "")).lower()
        return t["amount"] >= ONETIME_FIXED_THRESHOLD or cat in MONTHLY_CATEGORIES

    onetime_expense = sum(t["amount"] for t in expense_txns if is_onetime(t))
    routine_expense = expense - onetime_expense  

    daily_avg = routine_expense / days_passed if routine_expense > 0 else 0

    projection_factor = 0.80 if days_passed < 5 else 1.0
    projected = daily_avg * days_remaining * projection_factor

    predicted = income - expense - projected

    risk = "high" if predicted < 500_000 else "medium" if predicted < 1_500_000 else "low"

    return {
        "predicted_balance":  round(predicted, 2),
        "risk_level":         risk,
        "confidence":         round(min(0.95, 0.5 + len(transactions) * 0.02), 2),
        "days_remaining":     days_remaining,
        "daily_avg_expense":  round(daily_avg, 2),
        "onetime_expense":    round(onetime_expense, 2),
        "routine_expense":    round(routine_expense, 2),
        "projected_expense":  round(projected, 2),
    }

def compute_dna_score(transactions: list, budget: float = 8_000_000) -> dict:
    if not transactions:
        return {"total_score": 50, "dimensions": {}, "type_label": "Undefined", "type_desc": "Belum cukup data"}

    income  = sum(t["amount"] for t in transactions if t["type"] == "income")
    expense = sum(t["amount"] for t in transactions if t["type"] == "expense")
    impulse = [t for t in transactions if t.get("is_impulsive", False)]
    total_t = max(len([t for t in transactions if t["type"] == "expense"]), 1)

    if expense <= budget:
        d1 = 25.0
    else:
        over_ratio = (expense - budget) / max(budget, 1)
        d1 = max(0.0, 25.0 * (1 - over_ratio))

    impulse_ratio = len(impulse) / max(total_t, 1)
    d2 = max(0.0, 25.0 * (1 - impulse_ratio * 4))

    if income <= 0:
        d3 = 0.0
    else:
        saving_rate = max(0.0, (income - expense) / income)
        target_rate = 0.20
        d3 = min(25.0, 25.0 * (saving_rate / target_rate))

    cat_exp = {}
    for t in transactions:
        if t["type"] == "expense":
            c = t.get("category_id", "other")
            cat_exp[c] = cat_exp.get(c, 0) + t["amount"]

    active_cats = len(cat_exp)
    if active_cats == 0:
        d4 = 0.0
    elif active_cats >= 4:
        max_share = max(cat_exp.values()) / max(expense, 1)
        d4 = 25.0 if max_share <= 0.70 else 25.0 * (1 - (max_share - 0.70) / 0.30)
    else:
        base = {1: 10.0, 2: 16.0, 3: 21.0}
        d4 = base.get(active_cats, 10.0)

    total = round(min(100.0, d1 + d2 + d3 + d4), 1)

    types = [
        (88, "Smart Saver",         "Pengelola keuangan ideal — disiplin dan terencana"),
        (72, "Balanced Planner",    "Cukup terencana dengan beberapa area perlu diperbaiki"),
        (55, "Impulsive Optimizer", "Konsisten budget tapi rentan belanja impulsif"),
        (38, "Reactive Spender",    "Pengeluaran reaktif, perlu strategi lebih terstruktur"),
        (0,  "Reckless Spender",    "Perlu perhatian serius terhadap pola keuangan"),
    ]
    label, desc = next(((l, d) for s, l, d in types if total >= s), ("Reckless Spender", "Perlu perhatian"))

    return {
        "total_score": total,
        "dimensions": {
            "budget_consistency": round(d1, 1),
            "impulse_control":    round(d2, 1),
            "saving_habit":       round(d3, 1),
            "spending_plan":      round(d4, 1),
        },
        "type_label":    label,
        "type_desc":     desc,
        "impulse_count": len(impulse),
    }