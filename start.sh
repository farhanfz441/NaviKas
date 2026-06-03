#!/bin/bash
# FinTrack Startup Script
# Jalankan script ini dari folder fintrack/

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⬡ FinTrack — Starting Application"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 tidak ditemukan. Install dulu ya!"
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js tidak ditemukan. Install dulu ya!"
    exit 1
fi

# ── Backend ────────────────────────────────────────────────────────────────────
echo ""
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt -q

echo "🚀 Starting backend on http://localhost:8000"
# Set Gemini API key di sini jika ada
# export GEMINI_API_KEY="your_key_here"
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"

cd ..

# ── Frontend ───────────────────────────────────────────────────────────────────
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install --silent

echo "🎨 Starting frontend on http://localhost:5173"
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"

cd ..

# ── Summary ────────────────────────────────────────────────────────────────────
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ FinTrack berjalan!"
echo ""
echo "  🌐 Frontend : http://localhost:5173"
echo "  🔌 Backend  : http://localhost:8000"
echo "  📚 API Docs : http://localhost:8000/docs"
echo ""
echo "  Tekan Ctrl+C untuk menghentikan semua"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Wait and cleanup on Ctrl+C
trap "echo ''; echo 'Stopping...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT
wait
