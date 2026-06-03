import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '..', '..', '.env'))

_client = Groq(api_key=os.getenv("GROQ_API_KEY", ""))


def build_system(context: dict) -> str:
    balance  = context.get("balance", 0)
    income   = context.get("income", 0)
    expense  = context.get("expense", 0)
    imp_amt  = context.get("impAmt", 0)
    pred_bal = context.get("predictedBalance")
    pred_str = f"Rp {pred_bal:,.0f}" if pred_bal is not None else "belum tersedia"

    return f"""Kamu adalah FinBot, asisten keuangan pribadi di FinTrack.

GAYA: Bahasa Indonesia, kasual-profesional, singkat dan langsung ke inti. Maksimal 3 paragraf pendek. Gunakan **bold** hanya untuk angka/poin penting. Tidak perlu basa-basi pembuka. Langsung jawab.

DATA PENGGUNA:
- Nama: {context.get('userName', 'Pengguna')} | DNA: {context.get('dnaType', 'Balanced Planner')} ({context.get('dna', 72)}/100)
- Saldo: Rp {balance:,.0f} | Pemasukan: Rp {income:,.0f} | Pengeluaran: Rp {expense:,.0f}
- Impulsif: {context.get('impsCount', 0)}x (Rp {imp_amt:,.0f}) | Total transaksi: {context.get('txnCount', 0)}
- Prediksi akhir bulan: {pred_str} | Risk: {context.get('riskLevel', 'low')}

TOPIK YANG BOLEH DIJAWAB: keuangan pribadi, analisis transaksi, tips hemat/budgeting, Financial DNA, investasi dasar.

JIKA DI LUAR TOPIK: Tolak singkat — "Itu di luar bidangku 😄 Ada yang mau ditanyain soal keuanganmu?"

ATURAN JAWABAN:
- Jawab spesifik pakai data di atas, bukan generik
- Saldo tipis/boros → teguran singkat + 1-2 tips konkret
- Saldo aman → apresiasi + saran optimasi
- Akhiri dengan 1 pertanyaan atau saran actionable
- JANGAN sebut nama model AI apapun"""


def get_finbot_reply(messages: list[dict], context: dict) -> str:
    try:
        system = build_system(context)

        convo = [{"role": "system", "content": system}]
        for m in messages:
            if m["role"] in ("user", "assistant"):
                convo.append({"role": m["role"], "content": m["content"]})

        if not any(m["role"] == "user" for m in convo):
            convo.append({"role": "user", "content": "Halo"})

        response = _client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=convo,
            max_tokens=400,
            temperature=0.5,
        )
        return response.choices[0].message.content.strip()

    except Exception as e:
        err = str(e)
        if "429" in err or "rate_limit" in err.lower():
            return (
                "**FinBot lagi sibuk nih!** 😅\n\n"
                "Terlalu banyak request sekaligus. "
                "Tunggu 10-20 detik lalu coba kirim lagi ya!"
            )
        return "Waduh, FinBot lagi ada gangguan teknis. Coba lagi dalam beberapa detik ya! 🙏"  