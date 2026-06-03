import { useState, useEffect, useRef } from "react";
import { useStore } from './store/useStore';
import { authAPI } from './services/api';

/* ═══════════════════════════════════════════════════════════════
   FINTRACK  ·  Auth Page (Login & Register)
   Props:
     onAuthSuccess(token, userData) — dipanggil setelah login/register berhasil
     onBack()                       — kembali ke landing page
   Fixes:
     - Google login pakai renderButton (bukan prompt popup)
     - Responsive: desktop / tablet / mobile semua support
═══════════════════════════════════════════════════════════════ */

const CSS_AUTH = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.auth-root {
  min-height: 100vh;
  width: 100%;
  position: relative;
  font-family: 'DM Sans', sans-serif;
  overflow: hidden;
}

/* ── FULL BG PHOTO (greyscale) ── */
.auth-bg {
  position: fixed; inset: 0; z-index: 0;
  background-image: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=90');
  background-size: cover;
  background-position: center 35%;
  filter: grayscale(100%) brightness(0.45) contrast(1.1);
  transform: scale(1.03);
}

/* ── OVERLAY GRADIENT ── */
.auth-overlay {
  position: fixed; inset: 0; z-index: 1;
  background: linear-gradient(
    105deg,
    rgba(4,4,4,1.00)  0%,
    rgba(4,4,4,0.99)  28%,
    rgba(4,4,4,0.96)  40%,
    rgba(4,4,4,0.80)  50%,
    rgba(4,4,4,0.35)  62%,
    rgba(4,4,4,0.08)  76%,
    rgba(4,4,4,0.00)  100%
  );
}

/* ── MAIN LAYOUT ── */
.auth-layout {
  position: relative; z-index: 2;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 52% 48%;
}

/* ══════════════════════════════════════
   LEFT PANEL
══════════════════════════════════════ */
.auth-left {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 36px 64px;
  position: relative;
}

/* ── TOP BAR ── */
.auth-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}
.auth-logo {
  display: flex; align-items: baseline; gap: 1px;
  cursor: pointer; transition: opacity .15s;
  text-decoration: none;
}
.auth-logo:hover { opacity: .75; }
.auth-logo-f {
  font-size: 21px; font-weight: 700; color: #fff; letter-spacing: -.5px;
}
.auth-logo-t {
  font-size: 21px; font-weight: 300;
  color: rgba(255,255,255,0.3); letter-spacing: -.3px;
}
.auth-nav-links {
  display: flex; align-items: center; gap: 8px;
}
.auth-nav-link {
  padding: 7px 16px; border-radius: 9px;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: all .15s; font-family: 'DM Sans', sans-serif;
  border: none;
}
.auth-nav-link.ghost {
  background: transparent; color: rgba(255,255,255,0.45);
}
.auth-nav-link.ghost:hover { color: rgba(255,255,255,0.85); }
.auth-nav-link.outline {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.14);
  color: rgba(255,255,255,0.65);
}
.auth-nav-link.outline:hover {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.9);
}
.auth-back-btn {
  display: inline-flex; align-items: center; gap: 7px;
  padding: 8px 16px; border-radius: 9px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.5);
  font-size: 12.5px; font-weight: 500;
  cursor: pointer; transition: all .15s;
  font-family: 'DM Sans', sans-serif;
}
.auth-back-btn:hover {
  background: rgba(255,255,255,0.11);
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.22);
}
.auth-back-btn svg { flex-shrink: 0; }

/* ── FORM AREA ── */
.auth-form-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 28px 0 20px;
  max-width: 480px;
}

.auth-form-inner {
  animation: authSlideUp .35s ease;
}
@keyframes authSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── TAG ── */
.auth-tag {
  display: inline-flex; align-items: center; gap: 7px;
  font-size: 10px; font-weight: 600; letter-spacing: .22em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.28);
  font-family: 'DM Mono', monospace;
  margin-bottom: 20px;
}
.auth-tag::before {
  content: '';
  display: inline-block;
  width: 18px; height: 1px;
  background: rgba(255,255,255,0.2);
}

/* ── HEADING ── */
.auth-heading {
  font-size: clamp(38px, 4.5vw, 56px);
  font-weight: 700; letter-spacing: -2.5px;
  line-height: 1.06; color: #fff;
  margin-bottom: 14px;
}
.auth-heading-dim { color: rgba(255,255,255,0.2); }

/* ── SUBTITLE ── */
.auth-subtitle {
  font-size: 14px; color: rgba(255,255,255,0.36);
  margin-bottom: 36px; line-height: 1.6;
}
.auth-subtitle a {
  color: rgba(255,255,255,0.72); font-weight: 600;
  cursor: pointer; text-decoration: none;
  border-bottom: 1px solid rgba(255,255,255,0.25);
  padding-bottom: 1px; transition: all .15s;
}
.auth-subtitle a:hover { color: #fff; border-color: rgba(255,255,255,0.6); }

/* ── ALERT ── */
.auth-alert {
  padding: 13px 16px; border-radius: 12px;
  margin-bottom: 20px; font-size: 13px;
  display: flex; align-items: center; gap: 9px;
  backdrop-filter: blur(12px);
  animation: authSlideUp .2s ease;
}
.auth-alert.ok  {
  background: rgba(74,222,128,0.08);
  border: 1px solid rgba(74,222,128,0.25);
  color: #4ADE80;
}
.auth-alert.err {
  background: rgba(248,113,113,0.08);
  border: 1px solid rgba(248,113,113,0.25);
  color: #F87171;
}

/* ── NAME ROW (register) ── */
.auth-name-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
}

/* ── FIELD ── */
.auth-field { margin-bottom: 14px; }
.auth-field-label {
  display: block;
  font-size: 9.5px; font-weight: 600;
  letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,255,255,0.25);
  font-family: 'DM Mono', monospace;
  margin-bottom: 8px;
}
.auth-field-wrap { position: relative; }
.auth-input {
  width: 100%; padding: 14px 18px;
  background: rgba(255,255,255,0.065);
  border: 1px solid rgba(255,255,255,0.11);
  border-radius: 12px; color: #fff;
  font-size: 14.5px; font-family: 'DM Sans', sans-serif;
  outline: none; transition: all .2s;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
.auth-input::placeholder { color: rgba(255,255,255,0.14); }
.auth-input:focus {
  border-color: rgba(255,255,255,0.38);
  background: rgba(255,255,255,0.09);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.05);
}
.auth-input.has-icon { padding-right: 46px; }
.auth-input.error    { border-color: rgba(248,113,113,0.5) !important; }
.auth-field-icon {
  position: absolute; right: 14px; top: 50%;
  transform: translateY(-50%);
  color: rgba(255,255,255,0.2);
  display: flex; align-items: center; pointer-events: none;
}
.auth-field-btn {
  position: absolute; right: 14px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  padding: 0; color: rgba(255,255,255,0.22);
  display: flex; align-items: center; transition: color .15s;
}
.auth-field-btn:hover { color: rgba(255,255,255,0.65); }
.auth-field-error {
  font-size: 10.5px; color: #F87171; margin-top: 6px;
  font-family: 'DM Mono', monospace; letter-spacing: .04em;
}

/* ── FORGOT ── */
.auth-forgot {
  text-align: right; margin-top: -8px; margin-bottom: 20px;
}
.auth-forgot a {
  font-size: 11.5px; color: rgba(255,255,255,0.28);
  cursor: pointer; text-decoration: none;
  transition: color .15s; font-weight: 500;
}
.auth-forgot a:hover { color: rgba(255,255,255,0.65); }

/* ── DIVIDER ── */
.auth-divider {
  display: flex; align-items: center; gap: 12px;
  margin: 8px 0 16px;
}
.auth-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
.auth-divider-text {
  font-size: 10px; color: rgba(255,255,255,0.15);
  font-family: 'DM Mono', monospace; letter-spacing: .1em;
}

/* ── ACTION BUTTONS ── */
.auth-actions {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 12px;
  margin-top: 4px;
}

.auth-btn-switch {
  padding: 15px 22px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.13);
  border-radius: 12px;
  color: rgba(255,255,255,0.5);
  font-size: 14px; font-weight: 600;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  transition: all .15s; white-space: nowrap;
  backdrop-filter: blur(10px);
}
.auth-btn-switch:hover {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.85);
  border-color: rgba(255,255,255,0.24);
}

.auth-btn-submit {
  padding: 15px 28px;
  background: #fff; color: #0A0A0A;
  border: none; border-radius: 12px;
  font-size: 14.5px; font-weight: 700;
  cursor: pointer; font-family: 'DM Sans', sans-serif;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  transition: all .2s;
  box-shadow: 0 4px 24px rgba(255,255,255,0.14);
}
.auth-btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 36px rgba(255,255,255,0.22);
}
.auth-btn-submit:disabled { opacity: .4; cursor: not-allowed; }

/* ── TRUST PILLS ── */
.auth-trust {
  display: flex; flex-wrap: wrap; gap: 14px;
  margin-top: 26px;
}
.auth-trust-item {
  display: flex; align-items: center; gap: 6px;
  font-size: 11px; color: rgba(255,255,255,0.18);
  font-family: 'DM Mono', monospace; letter-spacing: .04em;
}
.auth-trust-dot {
  width: 3px; height: 3px; border-radius: 50%;
  background: rgba(255,255,255,0.15); flex-shrink: 0;
}

/* ── FOOTER ── */
.auth-footer {
  flex-shrink: 0;
  font-size: 10px; color: rgba(255,255,255,0.13);
  font-family: 'DM Mono', monospace;
  letter-spacing: .06em;
}

/* ── SPINNER ── */
@keyframes authSpin { to { transform: rotate(360deg); } }
.auth-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(10,10,10,0.15);
  border-top-color: #0A0A0A; border-radius: 50%;
  animation: authSpin .7s linear infinite; flex-shrink: 0;
}

/* ── GOOGLE BUTTON — REVISED ── */
.auth-google-wrap {
  width: 100%;
  margin-top: 4px;
}

/* Tombol custom Google — desain elegan */
.auth-google-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0;
  padding: 0;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 13px;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background .18s, border-color .18s, transform .15s;
  overflow: hidden;
}
.auth-google-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.07);
  border-color: rgba(255,255,255,0.15);
  transform: translateY(-1px);
}
.auth-google-btn:active:not(:disabled) { transform: translateY(0); }
.auth-google-btn:disabled { opacity: .35; cursor: not-allowed; }

.auth-google-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid rgba(255,255,255,0.07);
  flex-shrink: 0;
}

.auth-google-label {
  flex: 1;
  text-align: center;
  font-size: 13.5px;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  letter-spacing: .01em;
  padding-right: 50px; /* kompensasi lebar ikon agar teks benar-benar center */
}
.auth-google-btn:hover:not(:disabled) .auth-google-label {
  color: rgba(255,255,255,0.8);
}

/* Loading state dalam button */
.auth-google-spinner {
  width: 15px; height: 15px;
  border: 2px solid rgba(255,255,255,0.12);
  border-top-color: rgba(255,255,255,0.55);
  border-radius: 50%;
  animation: authSpin .7s linear infinite;
  flex-shrink: 0;
}

/* ══════════════════════════════════════
   RIGHT PANEL
══════════════════════════════════════ */
.auth-right {
  position: relative;
  display: flex; flex-direction: column;
  justify-content: space-between;
  padding: 48px 52px;
  overflow: hidden;
}

.auth-live-stats {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: authSlideUp .5s ease .1s both;
}
.auth-live-header {
  display: flex; align-items: center; gap: 8px;
  font-size: 9px; font-weight: 600; letter-spacing: .18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
  font-family: 'DM Mono', monospace;
  margin-bottom: 4px;
}
.auth-live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #4ADE80;
  animation: auth-live-pulse 1.8s ease-in-out infinite;
  flex-shrink: 0;
}
@keyframes auth-live-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
  50%       { opacity: .7; box-shadow: 0 0 0 5px rgba(74,222,128,0); }
}
.auth-stat-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.auth-stat-tile {
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 14px 16px;
  backdrop-filter: blur(16px);
  transition: all .2s;
}
.auth-stat-tile:hover {
  background: rgba(255,255,255,0.08);
  border-color: rgba(255,255,255,0.12);
}
.auth-stat-tile-label {
  font-size: 8.5px; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.22);
  font-family: 'DM Mono', monospace;
  margin-bottom: 6px;
}
.auth-stat-tile-val {
  font-size: 20px; font-weight: 700;
  letter-spacing: -1px; color: #fff;
  line-height: 1;
}
.auth-stat-tile-val.green { color: #4ADE80; }
.auth-stat-tile-val.amber { color: #FBBF24; }
.auth-stat-tile-sub {
  font-size: 9px; color: rgba(255,255,255,0.2);
  font-family: 'DM Mono', monospace;
  margin-top: 4px; letter-spacing: .04em;
}

.auth-sparkline-card {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 16px;
  backdrop-filter: blur(16px);
}
.auth-sparkline-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 12px;
}
.auth-sparkline-title {
  font-size: 9px; font-weight: 600; letter-spacing: .14em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.22);
  font-family: 'DM Mono', monospace;
}
.auth-sparkline-badge {
  padding: 2px 8px; border-radius: 99px;
  background: rgba(74,222,128,0.12);
  border: 1px solid rgba(74,222,128,0.2);
  font-size: 9px; font-weight: 700;
  color: #4ADE80;
  font-family: 'DM Mono', monospace;
}
.auth-sparkline-svg { width: 100%; overflow: visible; }

.auth-security-row {
  display: flex; gap: 8px;
}
.auth-security-badge {
  flex: 1;
  display: flex; align-items: center; gap: 8px;
  padding: 11px 13px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  font-size: 10px; color: rgba(255,255,255,0.3);
  font-family: 'DM Mono', monospace; letter-spacing: .04em;
  backdrop-filter: blur(12px);
}
.auth-security-badge svg { flex-shrink: 0; opacity: .5; }

.auth-quote-card {
  background: rgba(4,4,4,0.55);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  padding: 26px 28px;
  animation: authSlideUp .5s ease .2s both;
}
.auth-quote-stars {
  display: flex; gap: 3px; margin-bottom: 14px;
}
.auth-quote-star { font-size: 13px; color: rgba(255,255,255,0.6); }
.auth-quote-text {
  font-size: 14.5px; color: rgba(255,255,255,0.75);
  line-height: 1.7; font-style: italic; margin-bottom: 16px;
}
.auth-quote-author {
  display: flex; align-items: center; gap: 10px;
}
.auth-quote-ava {
  width: 34px; height: 34px; border-radius: 50%;
  background: linear-gradient(135deg,#333,#111);
  border: 1px solid rgba(255,255,255,0.12);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
}
.auth-quote-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,0.75); }
.auth-quote-role { font-size: 11px; color: rgba(255,255,255,0.32); margin-top: 1px; }

.auth-feat-pills {
  display: flex; flex-wrap: wrap; gap: 8px;
}
.auth-feat-pill {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 13px; border-radius: 99px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  font-size: 12px; color: rgba(255,255,255,0.5);
  font-weight: 500;
}
.auth-feat-pill-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: rgba(255,255,255,0.4); flex-shrink: 0;
}

/* ══════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════ */

/* Tablet landscape (900px–1200px): right panel tetap tampil, lebih compact */
@media (max-width: 1200px) {
  .auth-left  { padding: 32px 44px; }
  .auth-right { padding: 36px 36px; }
}

/* Tablet portrait (600px–900px): kiri fullwidth, kanan di bawah */
@media (max-width: 900px) {
  .auth-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
  .auth-right {
    display: flex;
    padding: 28px 32px 36px;
    gap: 20px;
    background: rgba(0,0,0,0.3);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  /* Di tablet, right panel hanya tampilkan quote card + feat pills (sembunyikan stats) */
  .auth-live-stats  { display: none; }
  .auth-left   { padding: 32px 32px; min-height: auto; }
  .auth-overlay {
    background: linear-gradient(180deg,
      rgba(4,4,4,0.98) 0%,
      rgba(4,4,4,0.92) 70%,
      rgba(4,4,4,0.6)  100%
    );
  }
}

/* Mobile (max 600px): single column, compact */
@media (max-width: 600px) {
  .auth-left   { padding: 24px 20px; }
  .auth-right  { padding: 24px 20px 32px; }
  .auth-heading { font-size: 34px; letter-spacing: -2px; }
  .auth-name-row { grid-template-columns: 1fr; }
  .auth-actions  { grid-template-columns: 1fr; }
  .auth-btn-switch { display: none; }
  .auth-back-btn span { display: none; } /* sembunyikan teks "Kembali ke Beranda" */
  .auth-quote-text { font-size: 13px; }
  /* Security badges: stack jika tidak muat */
  .auth-security-row { flex-wrap: wrap; }
  .auth-security-badge { flex: 1 1 calc(50% - 4px); min-width: 0; font-size: 9px; padding: 9px 10px; }
  /* Feat pills lebih compact */
  .auth-feat-pill { font-size: 11px; padding: 6px 10px; }
}

/* Extra small (max 380px) */
@media (max-width: 380px) {
  .auth-left { padding: 20px 16px; }
  .auth-heading { font-size: 30px; letter-spacing: -1.5px; }
  .auth-logo-f, .auth-logo-t { font-size: 18px; }
  .auth-right { padding: 20px 16px 28px; }
  .auth-google-icon { width: 44px; height: 44px; }
  .auth-google-label { font-size: 12.5px; padding-right: 44px; }
}
`;

const SPARK_POINTS = [38, 52, 44, 60, 55, 70, 65, 80, 72, 88, 82, 95];

function Sparkline() {
  const w = 240, h = 52;
  const min = Math.min(...SPARK_POINTS);
  const max = Math.max(...SPARK_POINTS);
  const xStep = w / (SPARK_POINTS.length - 1);
  const pts = SPARK_POINTS.map((v, i) => {
    const x = i * xStep;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const linePath = `M ${pts.join(" L ")}`;
  const areaPath = `M ${pts[0]} L ${pts.join(" L ")} L ${w},${h} L 0,${h} Z`;
  return (
    <svg className="auth-sparkline-svg" viewBox={`0 0 ${w} ${h + 4}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#spark-grad)" />
      <path d={linePath} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - ((SPARK_POINTS[SPARK_POINTS.length - 1] - min) / (max - min)) * h}
        r="3" fill="#fff" opacity=".8" />
    </svg>
  );
}

const IcArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IcMail = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);
const IcUser = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcEye = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcEyeOff = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IcArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcShield = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcLock = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IcCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcWarn = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IcGoogle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// ── Helper: ekstrak pesan string dari berbagai format error backend ──────────
function parseError(err, fallback) {
  if (fallback === undefined) fallback = "Terjadi kesalahan. Coba lagi.";
  var data = err && err.response && err.response.data;
  if (!data) return fallback;
  if (typeof data === "string") return data;
  if (typeof data.message === "string") return data.message;
  if (typeof data.error === "string") return data.error;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data.detail)) return data.detail.map(function(d){ return d && d.msg ? d.msg : JSON.stringify(d); }).join(", ");
  if (data.errors && typeof data.errors === "object") return Object.values(data.errors).flat().join(", ");
  return fallback;
}

export default function AuthPage({ onAuthSuccess, onBack }) {
  const storeSetToken = useStore(s => s.setToken);
  const storeSetUser  = useStore(s => s.setUser);
  const [mode, setMode]               = useState("login");
  const [showPw, setShowPw]           = useState(false);
  const [loading, setLoading]         = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [alert, setAlert]             = useState(null);
  const [form, setForm]               = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [fe, setFe]                   = useState({});

  const googleBtnRef = useRef(null);

  // ── Google Sign-In: load script + initialize ──────────────────────────────
  // Pakai renderButton — tombol resmi GSI yang dirender langsung ke dalam DOM.
  // Tidak butuh popup window terpisah  → tidak bisa diblokir browser mobile.
  // Tidak butuh redirect URI tambahan  → tidak ada error redirect_uri_mismatch.
  useEffect(() => {
    const GCID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!GCID) return;

    const initGoogle = () => {
      if (!window.google?.accounts?.id) return;
      window.google.accounts.id.initialize({
        client_id: GCID,
        callback: handleGoogleCredential,
        ux_mode: "popup",
        cancel_on_tap_outside: true,
      });
      setGoogleReady(true);
    };

    const scriptId = "google-gsi-script";
    if (document.getElementById(scriptId)) {
      if (window.google?.accounts?.id) initGoogle();
      else document.getElementById(scriptId).addEventListener("load", initGoogle);
      return;
    }

    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.defer = true;
    s.onload = initGoogle;
    document.body.appendChild(s);
  }, []);

  // ── Render tombol Google resmi setiap kali siap / mode berganti ───────────
  useEffect(() => {
    if (!googleReady || !googleBtnRef.current) return;
    const t = setTimeout(() => {
      if (!googleBtnRef.current) return;
      googleBtnRef.current.innerHTML = "";
      const w = googleBtnRef.current.offsetWidth || 360;
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "filled_black",
        size: "large",
        width: w,
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "left",
      });
    }, 100);
    return () => clearTimeout(t);
  }, [googleReady, mode]);

  // ── Callback setelah user pilih akun Google ───────────────────────────────
  const handleGoogleCredential = async (response) => {
    setGoogleLoading(true); setAlert(null);
    try {
      const res      = await authAPI.loginGoogle({ credential: response.credential });
      const token    = res.data.access_token;
      const userData = res.data.user;
      storeSetToken(token);
      storeSetUser(userData);
      setAlert({ t: "ok", msg: "Berhasil masuk dengan Google! Mengarahkan ke dashboard..." });
      setTimeout(() => onAuthSuccess(token, userData), 900);
    } catch (err) {
      setAlert({ t: "err", msg: parseError(err, "Login Google gagal. Coba lagi.") });
    } finally {
      setGoogleLoading(false);
    }
  };

  const sf = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setFe(p => ({ ...p, [k]: "" }));
    setAlert(null);
  };

  const validate = () => {
    const e = {};
    if (mode === "register") {
      if (!form.firstName.trim()) e.firstName = "Wajib diisi";
      if (!form.lastName.trim())  e.lastName  = "Wajib diisi";
    }
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Format email tidak valid";
    if (form.password.length < 6) e.password = "Min. 6 karakter";
    setFe(e);
    return !Object.keys(e).length;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true); setAlert(null);
    try {
      let token, userData;
      if (mode === "register") {
        const name = `${form.firstName} ${form.lastName}`.trim();
        const res  = await authAPI.register({ name, email: form.email, password: form.password });
        token    = res.data.access_token;
        userData = res.data.user || { name, email: form.email };
      } else {
        const res = await authAPI.login({ email: form.email, password: form.password });
        token    = res.data.access_token;
        userData = res.data.user || { name: form.email.split("@")[0], email: form.email };
      }
      storeSetToken(token);
      storeSetUser(userData);
      setAlert({ t: "ok", msg: mode === "login" ? "Berhasil masuk! Mengarahkan ke dashboard..." : "Akun berhasil dibuat! Mengarahkan..." });
      setTimeout(() => onAuthSuccess(token, userData), 900);
    } catch (err) {
      setAlert({ t: "err", msg: parseError(err) });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "register" : "login");
    setForm({ firstName: "", lastName: "", email: "", password: "" });
    setFe({}); setAlert(null); setShowPw(false);
  };

  const handleKey = e => { if (e.key === "Enter") submit(); };

  return (
    <div className="auth-root">
      <style>{CSS_AUTH}</style>
      <div className="auth-bg" />
      <div className="auth-overlay" />
      <div className="auth-layout">

        {/* ── LEFT ── */}
        <div className="auth-left">
          <div className="auth-topbar">
            <div className="auth-logo" onClick={onBack}>
              <span className="auth-logo-f">Navi</span>
              <span className="auth-logo-t">Kas</span>
            </div>
            <div className="auth-nav-links">
              <button className="auth-back-btn" onClick={onBack}>
                <IcArrowLeft />
                <span>Kembali ke Beranda</span>
              </button>
              <button className="auth-nav-link outline" onClick={switchMode}>
                {mode === "login" ? "Daftar" : "Masuk"}
              </button>
            </div>
          </div>

          <div className="auth-form-area">
            <div className="auth-form-inner" key={mode}>
              <div className="auth-tag">
                {mode === "login" ? "Sudah punya akun" : "Mulai gratis"}
              </div>
              <div className="auth-heading">
                {mode === "login" ? (
                  <><span className="auth-heading-dim">Selamat</span> datang<br />kembali.</>
                ) : (
                  <>Buat akun<br /><span className="auth-heading-dim">baru.</span></>
                )}
              </div>
              <div className="auth-subtitle">
                {mode === "login"
                  ? <>Belum punya akun? <a onClick={switchMode}>Daftar sekarang</a></>
                  : <>Sudah punya akun? <a onClick={switchMode}>Masuk di sini</a></>
                }
              </div>

              {alert && (
                <div className={`auth-alert ${alert.t}`}>
                  {alert.t === "ok" ? <IcCheck /> : <IcWarn />}
                  {alert.msg}
                </div>
              )}

              {mode === "register" && (
                <div className="auth-name-row">
                  <div className="auth-field">
                    <label className="auth-field-label">Nama Depan</label>
                    <div className="auth-field-wrap">
                      <input className={`auth-input has-icon${fe.firstName ? " error" : ""}`} placeholder="Farhan"
                        value={form.firstName} onChange={e => sf("firstName", e.target.value)} onKeyDown={handleKey} />
                      <span className="auth-field-icon"><IcUser /></span>
                    </div>
                    {fe.firstName && <div className="auth-field-error">⚠ {fe.firstName}</div>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-field-label">Nama Belakang</label>
                    <div className="auth-field-wrap">
                      <input className={`auth-input has-icon${fe.lastName ? " error" : ""}`} placeholder="Fauzi"
                        value={form.lastName} onChange={e => sf("lastName", e.target.value)} onKeyDown={handleKey} />
                      <span className="auth-field-icon"><IcUser /></span>
                    </div>
                    {fe.lastName && <div className="auth-field-error">⚠ {fe.lastName}</div>}
                  </div>
                </div>
              )}

              <div className="auth-field">
                <label className="auth-field-label">Email</label>
                <div className="auth-field-wrap">
                  <input className={`auth-input has-icon${fe.email ? " error" : ""}`} type="email"
                    placeholder="farhan@example.com" value={form.email}
                    onChange={e => sf("email", e.target.value)} onKeyDown={handleKey} />
                  <span className="auth-field-icon"><IcMail /></span>
                </div>
                {fe.email && <div className="auth-field-error">⚠ {fe.email}</div>}
              </div>

              <div className="auth-field">
                <label className="auth-field-label">Password</label>
                <div className="auth-field-wrap">
                  <input className={`auth-input has-icon${fe.password ? " error" : ""}`}
                    type={showPw ? "text" : "password"}
                    placeholder={mode === "register" ? "Min. 6 karakter" : "••••••••"}
                    value={form.password} onChange={e => sf("password", e.target.value)} onKeyDown={handleKey} />
                  <button className="auth-field-btn" onClick={() => setShowPw(p => !p)} type="button">
                    {showPw ? <IcEyeOff /> : <IcEye />}
                  </button>
                </div>
                {fe.password && <div className="auth-field-error">⚠ {fe.password}</div>}
              </div>

              {mode === "login" && (
                <div className="auth-forgot"><a>Lupa password?</a></div>
              )}

              <div className="auth-actions">
                <button className="auth-btn-switch" onClick={switchMode}>
                  {mode === "login" ? "Daftar" : "Masuk"}
                </button>
                <button className="auth-btn-submit" onClick={submit} disabled={loading}>
                  {loading
                    ? <><div className="auth-spinner" />Memproses...</>
                    : <>{mode === "login" ? "Masuk" : "Buat Akun"} <IcArrowRight /></>
                  }
                </button>
              </div>

              <div className="auth-divider">
                <span className="auth-divider-line" />
                <span className="auth-divider-text">atau lanjutkan dengan</span>
                <span className="auth-divider-line" />
              </div>

              {/* ── Google Sign-In Button (renderButton — works on all devices) ── */}
              <div className="auth-google-wrap">
                {googleLoading ? (
                  <button className="auth-google-btn" disabled>
                    <span className="auth-google-icon">
                      <div className="auth-google-spinner" />
                    </span>
                    <span className="auth-google-label">Menghubungkan ke Google...</span>
                  </button>
                ) : (
                  <div
                    ref={googleBtnRef}
                    className="auth-google-render"
                    style={{ minHeight: 50 }}
                  />
                )}
              </div>

              <div className="auth-trust">
                {["SSL 256-bit", "Gratis selamanya", "Made in Indonesia", "Capstone Dicoding"].map((t, i) => (
                  <div key={i} className="auth-trust-item">
                    <div className="auth-trust-dot" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="auth-footer">© 2026 NaviKas · Dicoding Capstone</div>
        </div>

        {/* ── RIGHT ── */}
        <div className="auth-right">
          <div className="auth-live-stats">
            <div className="auth-live-header">
              <div className="auth-live-dot" />
              Live Platform Stats
            </div>
            <div className="auth-stat-row">
              <div className="auth-stat-tile">
                <div className="auth-stat-tile-label">Pengguna Aktif</div>
                <div className="auth-stat-tile-val">10.214</div>
                <div className="auth-stat-tile-sub">+87 minggu ini</div>
              </div>
              <div className="auth-stat-tile">
                <div className="auth-stat-tile-label">Avg. Hemat/Bulan</div>
                <div className="auth-stat-tile-val green">420rb</div>
                <div className="auth-stat-tile-sub">per pengguna aktif</div>
              </div>
            </div>
            <div className="auth-stat-row">
              <div className="auth-stat-tile">
                <div className="auth-stat-tile-label">Transaksi Hari Ini</div>
                <div className="auth-stat-tile-val">+1.243</div>
                <div className="auth-stat-tile-sub">dicatat otomatis</div>
              </div>
              <div className="auth-stat-tile">
                <div className="auth-stat-tile-label">Akurasi Prediksi</div>
                <div className="auth-stat-tile-val amber">98.2%</div>
                <div className="auth-stat-tile-sub">model AI kami</div>
              </div>
            </div>
            <div className="auth-sparkline-card">
              <div className="auth-sparkline-header">
                <div className="auth-sparkline-title">Pertumbuhan Pengguna — 12 Bulan</div>
                <div className="auth-sparkline-badge">↑ 38%</div>
              </div>
              <Sparkline />
            </div>
            <div className="auth-security-row">
              <div className="auth-security-badge"><IcShield /> SSL 256-bit</div>
              <div className="auth-security-badge"><IcLock /> End-to-End</div>
              <div className="auth-security-badge"><IcShield /> GDPR Ready</div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="auth-feat-pills">
              {["Financial DNA Score", "Prediksi Akhir Bulan", "Deteksi Impulsif", "AI Analytics"].map((pill, i) => (
                <div key={i} className="auth-feat-pill">
                  <div className="auth-feat-pill-dot" />
                  {pill}
                </div>
              ))}
            </div>
            <div className="auth-quote-card">
              <div className="auth-quote-stars">
                {[1, 2, 3, 4, 5].map(i => <span key={i} className="auth-quote-star">★</span>)}
              </div>
              <div className="auth-quote-text">
                "NaviKas benar-benar mengubah cara saya mengelola keuangan. Financial DNA Score membantu saya hemat lebih dari Rp 500rb per bulan!"
              </div>
              <div className="auth-quote-author">
                <div className="auth-quote-ava">AM</div>
                <div>
                  <div className="auth-quote-name">Ainun Mutiara Suci Antuke</div>
                  <div className="auth-quote-role">Software Developer · Bandung</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}