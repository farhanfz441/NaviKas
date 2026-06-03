# backend/app/services/finbot.py
import os
import time
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from google import genai

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

_api_key = os.getenv("GEMINI_API_KEY", "")
_client = genai.Client(api_key=_api_key)

# Model list — coba dari yang paling capable ke fallback
MODELS = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-flash-latest",
]


def build_prompt(messages: list[dict], context: dict) -> str:
    balance  = context.get("balance", 0)
    income   = context.get("income", 0)
    expense  = context.get("expense", 0)
    imp_amt  = context.get("impAmt", 0)
    pred_bal = context.get("predictedBalance")
    pred_str = f"Rp {pred_bal:,}" if pred_bal is not None else "belum tersedia"

    system = f"""
Kamu adalah 'FinBot', asisten penasihat keuangan pintar dan empatik di aplikasi FinTrack.
Gaya bahasamu asyik, suportif, dan kekinian (cocok untuk Gen Z / Mahasiswa Indonesia).
Gunakan bahasa Indonesia. Jawab singkat, padat, solutif (maksimal 4 paragraf).
Gunakan markdown sederhana (**teks**) untuk penekanan. Jangan sebut nama model AI.

Profil pengguna:
- Nama              : {context.get('userName', 'Pengguna')}
- Financial DNA     : {context.get('dnaType', 'Balanced Planner')} (skor {context.get('dna', 72)}/100)
- Saldo bersih      : Rp {balance:,}
- Pemasukan bulan   : Rp {income:,}
- Pengeluaran bulan : Rp {expense:,}
- Transaksi impulsif: {context.get('impsCount', 0)}x (total Rp {imp_amt:,})
- Jumlah transaksi  : {context.get('txnCount', 0)}
- Prediksi akhir bln: {pred_str}
- Risk level        : {context.get('riskLevel', 'low')}

Aturan:
1. Jawab spesifik berdasarkan data di atas.
2. Saldo tipis + profil boros → teguran ramah + tips hemat.
3. Saldo aman → apresiasi + saran optimasi.
4. Akhiri dengan pertanyaan atau saran actionable.
""".strip()

    full = system + "\n\n"
    for msg in messages:
        role  = "User" if msg["role"] == "user" else "FinBot"
        full += f"{role}: {msg['content']}\n"
    full += "FinBot:"
    return full


def get_finbot_reply(messages: list[dict], context: dict) -> str:
    prompt = build_prompt(messages, context)
    last_error = ""

    for model in MODELS:
        for attempt in range(3):  # max 3 retry per model
            try:
                response = _client.models.generate_content(
                    model=model,
                    contents=prompt
                )
                text = response.text.strip() if response.text else ""
                if text:
                    return text
                # response kosong — coba lagi
                time.sleep(1)
                continue

            except Exception as e:
                err = str(e)
                last_error = err

                if "503" in err or "UNAVAILABLE" in err:
                    # Server overload — tunggu lalu retry model ini
                    wait = (attempt + 1) * 2
                    time.sleep(wait)
                    continue

                elif "429" in err or "RESOURCE_EXHAUSTED" in err:
                    # Rate limit per menit — tunggu 60 detik lalu coba model berikutnya
                    # Jangan return langsung, coba model lain dulu
                    time.sleep(60)
                    break  # break inner loop, lanjut ke model berikutnya

                elif "400" in err or "INVALID_ARGUMENT" in err:
                    # Request invalid — skip model ini, coba berikutnya
                    break

                else:
                    # Error lain — retry sekali lagi
                    time.sleep(1)
                    continue

    # Semua model gagal — beri pesan yang jujur
    wib = timezone(timedelta(hours=7))
    now = datetime.now(wib)

    # Cek apakah error terakhir adalah rate limit
    if "429" in last_error or "RESOURCE_EXHAUSTED" in last_error:
        reset_time = now.replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=1)
        delta = reset_time - now
        hours_left   = int(delta.total_seconds() // 3600)
        minutes_left = int((delta.total_seconds() % 3600) // 60)
        reset_str = reset_time.strftime("%H:%M WIB")
        return (
            f"**FinBot lagi sibuk banget nih!** 😅\n\n"
            f"Sepertinya kuota API sudah mencapai batas. "
            f"Coba lagi dalam beberapa menit, atau tunggu sampai pukul **{reset_str}** "
            f"(sekitar **{hours_left} jam {minutes_left} menit** lagi).\n\n"
            f"Sementara itu, kamu bisa lihat tab **Financial DNA** dan **Statistik** untuk insight keuanganmu ya!"
        )

    return (
        "Waduh, FinBot lagi ada gangguan teknis nih. "
        "Coba kirim pesan lagi dalam beberapa detik ya! 🙏"
    )