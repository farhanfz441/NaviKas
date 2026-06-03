import { useState, useEffect, useRef } from "react";

  const CSS_LANDING = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=DM+Mono:wght@400;500&display=swap');

  .lp *,
  .lp *::before,
  .lp *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lp {
    font-family: 'DM Sans', sans-serif;
    background: #F8F8F8;
    color: #0A0A0A;
    overflow-x: hidden;
  }

  .lp ::-webkit-scrollbar { width: 3px; }
  .lp ::-webkit-scrollbar-track { background: transparent; }
  .lp ::-webkit-scrollbar-thumb { background: #D0D0D0; border-radius: 2px; }

  .lp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    display: flex; align-items: center;
    padding: 0 5%;
    height: 64px;
    background: rgba(248,248,248,0.85);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(0,0,0,0.06);
    transition: background .3s;
  }
  .lp-nav.scrolled {
    background: rgba(248,248,248,0.97);
    box-shadow: 0 1px 20px rgba(0,0,0,0.06);
  }
  .lp-nav-logo { display: flex; align-items: baseline; gap: 1px; flex: 1; }
  .lp-nav-logo span:first-child {
    font-size: 20px; font-weight: 700;
    background: linear-gradient(135deg,#0A0A0A,#555);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    letter-spacing: -.5px;
  }
  .lp-nav-logo span:last-child { font-size: 20px; font-weight: 300; color: #888; letter-spacing: -.3px; }
  .lp-nav-links { display: flex; align-items: center; gap: 32px; list-style: none; }
  .lp-nav-links a { font-size: 13.5px; color: #555; text-decoration: none; font-weight: 500; transition: color .15s; cursor: pointer; }
  .lp-nav-links a:hover { color: #0A0A0A; }
  .lp-nav-cta { display: flex; align-items: center; gap: 10px; margin-left: 32px; }
  .lp-btn-outline {
    padding: 8px 18px; border: 1.5px solid rgba(0,0,0,0.15);
    border-radius: 10px; font-size: 13px; font-weight: 600;
    background: transparent; color: #0A0A0A; cursor: pointer;
    transition: all .15s; font-family: 'DM Sans', sans-serif;
  }
  .lp-btn-outline:hover { border-color: #0A0A0A; background: rgba(0,0,0,0.04); }
  .lp-btn-solid {
    padding: 8px 20px; border: none; border-radius: 10px;
    font-size: 13px; font-weight: 700;
    background: linear-gradient(135deg,#0A0A0A,#333);
    color: #F8F8F8; cursor: pointer;
    transition: all .15s; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  }
  .lp-btn-solid:hover { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }

  /* ── USER PILL di navbar (saat sudah login) ── */
  .lp-nav-user {
    display: flex; align-items: center; gap: 10px; margin-left: 32px;
  }
  .lp-nav-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg,#0A0A0A,#444);
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff;
    flex-shrink: 0; border: 2px solid rgba(0,0,0,0.08);
  }
  .lp-nav-user-info { display: flex; flex-direction: column; line-height: 1.2; }
  .lp-nav-user-name { font-size: 13px; font-weight: 600; color: #0A0A0A; }
  .lp-nav-user-badge {
    font-size: 9px; color: #888; font-family: 'DM Mono', monospace;
    letter-spacing: .06em; text-transform: uppercase;
  }
  .lp-nav-go-btn {
    padding: 7px 16px; border: none; border-radius: 9px;
    font-size: 12.5px; font-weight: 700;
    background: linear-gradient(135deg,#0A0A0A,#333);
    color: #fff; cursor: pointer;
    transition: all .15s; font-family: 'DM Sans', sans-serif;
    display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.14);
  }
  .lp-nav-go-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 18px rgba(0,0,0,0.2); }
  .lp-nav-logout-btn {
    padding: 7px 14px; border: 1.5px solid rgba(0,0,0,0.12);
    border-radius: 9px; font-size: 12px; font-weight: 500;
    background: transparent; color: #888; cursor: pointer;
    transition: all .15s; font-family: 'DM Sans', sans-serif;
  }
  .lp-nav-logout-btn:hover {
    border-color: rgba(220,38,38,0.3);
    color: #DC2626; background: rgba(220,38,38,0.04);
  }

  /* ── HERO USER GREETING CARD ── */
  .lp-hero-user-card {
    display: inline-flex; align-items: center; gap: 12px;
    padding: 10px 18px; border-radius: 14px;
    background: rgba(10,10,10,0.05);
    border: 1px solid rgba(0,0,0,0.09);
    margin-bottom: 22px;
    animation: lp-slide-in .4s ease;
  }
  @keyframes lp-slide-in {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lp-hero-user-ava {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg,#0A0A0A,#444);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .lp-hero-user-greeting { font-size: 12px; color: #888; font-weight: 400; }
  .lp-hero-user-name { font-size: 14px; font-weight: 700; color: #0A0A0A; margin-top: 1px; }
  .lp-hero-user-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: #4ADE80; flex-shrink: 0;
    box-shadow: 0 0 0 3px rgba(74,222,128,0.2);
    animation: lp-pulse 2s infinite;
  }

  .lp-hero {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    padding: 100px 5% 60px;
    position: relative; overflow: hidden;
  }
  .lp-hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
  .lp-hero-bg::before {
    content: ''; position: absolute; inset: 0;
    background:
      radial-gradient(ellipse at 15% 20%, rgba(0,0,0,0.04) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 75%, rgba(0,0,0,0.03) 0%, transparent 55%);
  }
  .lp-hero-bg::after {
    content: ''; position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px);
    background-size: 72px 72px;
  }
  .lp-hero-inner {
    position: relative; z-index: 1;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 60px; align-items: center;
  }
  .lp-hero-badge {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 5px 12px; border-radius: 99px;
    background: rgba(0,0,0,0.06); border: 1px solid rgba(0,0,0,0.1);
    font-size: 11.5px; font-weight: 600; color: #555;
    font-family: 'DM Mono', monospace; letter-spacing: .04em; margin-bottom: 22px;
  }
  .lp-hero-badge-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: #0A0A0A; animation: lp-pulse 2s infinite;
  }
  @keyframes lp-pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
  .lp-hero-title {
    font-size: clamp(42px, 5vw, 62px);
    font-weight: 700; letter-spacing: -3px; line-height: 1.08;
    color: #0A0A0A; margin-bottom: 20px;
  }
  .lp-hero-title-grad {
    background: linear-gradient(135deg, #0A0A0A 0%, #666 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .lp-hero-sub { font-size: 16px; color: #666; line-height: 1.75; margin-bottom: 36px; max-width: 480px; font-weight: 400; }
  .lp-hero-actions { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
  .lp-btn-hero {
    padding: 14px 30px; border: none; border-radius: 12px;
    font-size: 14.5px; font-weight: 700;
    background: linear-gradient(135deg,#0A0A0A,#333);
    color: #F8F8F8; cursor: pointer;
    transition: all .2s; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 20px rgba(0,0,0,0.2);
    display: inline-flex; align-items: center; gap: 8px;
  }
  .lp-btn-hero:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.25); }
  .lp-btn-hero-ghost {
    padding: 14px 24px; border: 1.5px solid rgba(0,0,0,0.15);
    border-radius: 12px; font-size: 14px; font-weight: 600;
    background: transparent; color: #0A0A0A; cursor: pointer;
    transition: all .15s; font-family: 'DM Sans', sans-serif;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .lp-btn-hero-ghost:hover { border-color: #0A0A0A; background: rgba(0,0,0,0.04); }
  .lp-hero-note { margin-top: 18px; font-size: 12px; color: #AAAAAA; display: flex; align-items: center; gap: 6px; }

  .lp-trust-row { display: flex; align-items: center; gap: 0; margin-top: 32px; padding-top: 28px; border-top: 1px solid rgba(0,0,0,0.08); }
  .lp-trust-item { display: flex; align-items: center; gap: 8px; font-size: 12px; color: #777; font-weight: 500; padding-right: 20px; margin-right: 20px; border-right: 1px solid rgba(0,0,0,0.1); }
  .lp-trust-item:last-child { border-right: none; padding-right: 0; margin-right: 0; }
  .lp-trust-ico { width: 28px; height: 28px; border-radius: 8px; background: rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }

  .lp-hero-visual { position: relative; }
  .lp-dashboard-preview {
    background: #0A0A0A; border-radius: 20px; padding: 16px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.08);
    transform: perspective(1200px) rotateY(-8deg) rotateX(3deg);
    transition: transform .4s ease;
  }
  .lp-dashboard-preview:hover { transform: perspective(1200px) rotateY(-4deg) rotateX(1deg); }
  .lp-dash-topbar { display: flex; align-items: center; gap: 6px; margin-bottom: 14px; }
  .lp-dash-dot { width: 10px; height: 10px; border-radius: 50%; }
  .lp-dash-screen { background: #111; border-radius: 12px; padding: 20px; overflow: hidden; }
  .lp-dash-balance-label { font-size: 9px; color: #555; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 4px; }
  .lp-dash-balance { font-size: 28px; font-weight: 700; letter-spacing: -2px; background: linear-gradient(135deg,#fff,#999); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px; }
  .lp-dash-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .lp-dash-mini { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 12px; }
  .lp-dash-mini-label { font-size: 8px; color: #555; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px; }
  .lp-dash-mini-val { font-size: 14px; font-weight: 700; color: #fff; }
  .lp-dash-mini-val.green { color: #4ADE80; }
  .lp-dash-mini-val.red   { color: #F87171; }
  .lp-dash-bars { display: flex; align-items: flex-end; gap: 5px; height: 50px; }
  .lp-dash-bar { flex: 1; border-radius: 4px 4px 0 0; background: rgba(255,255,255,0.12); min-height: 6px; transition: height .3s; }
  .lp-dash-bar.active-bar { background: linear-gradient(180deg,#fff,#888); }

  .lp-hero-mini-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 14px; }
  .lp-hero-mini-stat { background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 12px; padding: 13px 10px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.04); transition: all .15s; }
  .lp-hero-mini-stat:hover { border-color: rgba(0,0,0,0.14); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.07); }
  .lp-hero-mini-stat-num { font-size: 17px; font-weight: 700; letter-spacing: -1px; color: #0A0A0A; margin-bottom: 3px; line-height: 1; }
  .lp-hero-mini-stat-lbl { font-size: 9.5px; color: #AAA; font-family: 'DM Mono', monospace; text-transform: uppercase; letter-spacing: .06em; }

  .lp-float-card {
    position: absolute; background: #fff; border: 1px solid rgba(0,0,0,0.08);
    border-radius: 14px; padding: 12px 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    animation: lp-float 3s ease-in-out infinite;
    white-space: nowrap; z-index: 10;
  }
  .lp-float-card:nth-child(1) { top: -20px; right: -30px; animation-delay: 0s; }
  .lp-float-card:nth-child(2) { bottom: 80px; left: -40px; animation-delay: 1.5s; }
  @keyframes lp-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .lp-float-label { font-size: 9.5px; color: #999; font-family: 'DM Mono', monospace; margin-bottom: 3px; text-transform: uppercase; }
  .lp-float-val   { font-size: 15px; font-weight: 700; color: #0A0A0A; }
  .lp-float-bar { width: 100%; height: 3px; background: #F0F0F0; border-radius: 99px; margin-top: 8px; overflow: hidden; }
  .lp-float-bar-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg,#0A0A0A,#555); }

  .lp-scroll-hint { position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 5px; z-index: 2; pointer-events: none; }
  .lp-scroll-hint-lbl { font-size: 9px; color: #CCC; font-family: 'DM Mono', monospace; letter-spacing: .14em; text-transform: uppercase; }
  .lp-scroll-mouse { width: 18px; height: 28px; border: 1.5px solid rgba(0,0,0,0.15); border-radius: 99px; display: flex; justify-content: center; padding-top: 4px; }
  .lp-scroll-wheel { width: 3px; height: 5px; background: rgba(0,0,0,0.2); border-radius: 99px; animation: lp-scroll-anim 1.6s ease-in-out infinite; }
  @keyframes lp-scroll-anim { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(8px); opacity: 0; } }

  .lp-ticker { background: #0A0A0A; padding: 10px 0; overflow: hidden; position: relative; }
  .lp-ticker::before, .lp-ticker::after { content: ''; position: absolute; top: 0; bottom: 0; width: 80px; z-index: 2; }
  .lp-ticker::before { left: 0; background: linear-gradient(90deg,#0A0A0A,transparent); }
  .lp-ticker::after  { right: 0; background: linear-gradient(-90deg,#0A0A0A,transparent); }
  .lp-ticker-inner { display: flex; gap: 0; width: max-content; animation: lp-ticker-scroll 30s linear infinite; }
  @keyframes lp-ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .lp-ticker-item { display: flex; align-items: center; gap: 8px; padding: 0 28px; white-space: nowrap; font-size: 11.5px; font-family: 'DM Mono', monospace; color: #555; letter-spacing: .04em; }
  .lp-ticker-item span { color: #4ADE80; font-weight: 500; }
  .lp-ticker-dot { width: 4px; height: 4px; border-radius: 50%; background: #222; flex-shrink: 0; }

  .lp-stats { padding: 0 5%; background: #0A0A0A; }
  .lp-stats-inner { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(4,1fr); border-bottom: 1px solid rgba(255,255,255,0.08); }
  .lp-stat-item { padding: 40px 20px; border-right: 1px solid rgba(255,255,255,0.08); text-align: center; }
  .lp-stat-item:last-child { border-right: none; }
  .lp-stat-num { font-size: 36px; font-weight: 700; letter-spacing: -2px; color: #fff; margin-bottom: 6px; line-height: 1; }
  .lp-stat-label { font-size: 12.5px; color: #555; font-weight: 400; }

  .lp-why { padding: 100px 5%; background: #F8F8F8; }
  .lp-section-inner { max-width: 1100px; margin: 0 auto; }
  .lp-section-tag { display: inline-flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 600; color: #888; font-family: 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase; margin-bottom: 16px; }
  .lp-section-tag::before { content: ''; width: 20px; height: 1px; background: #CCC; }
  .lp-section-title { font-size: clamp(30px, 3.5vw, 44px); font-weight: 700; letter-spacing: -2px; color: #0A0A0A; margin-bottom: 14px; line-height: 1.1; }
  .lp-section-sub { font-size: 15px; color: #777; line-height: 1.75; max-width: 520px; margin-bottom: 56px; }
  .lp-why-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
  .lp-why-card { background: #fff; border: 1px solid rgba(0,0,0,0.07); border-radius: 18px; padding: 28px; transition: all .2s; position: relative; overflow: hidden; }
  .lp-why-card:hover { border-color: rgba(0,0,0,0.15); box-shadow: 0 8px 32px rgba(0,0,0,0.06); transform: translateY(-3px); }
  .lp-why-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(0,0,0,0.02),transparent); pointer-events: none; }
  .lp-why-num { font-size: 11px; font-weight: 700; color: #CCC; font-family: 'DM Mono', monospace; letter-spacing: .1em; margin-bottom: 20px; }
  .lp-why-ico { width: 44px; height: 44px; border-radius: 12px; background: #0A0A0A; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
  .lp-why-ico svg { stroke: #fff; }
  .lp-why-card-title { font-size: 16px; font-weight: 700; color: #0A0A0A; margin-bottom: 10px; letter-spacing: -.3px; }
  .lp-why-card-sub { font-size: 13.5px; color: #777; line-height: 1.7; }

  .lp-how { padding: 100px 5%; background: #0A0A0A; }
  .lp-how .lp-section-title { color: #fff; }
  .lp-how .lp-section-sub   { color: #555; }
  .lp-how .lp-section-tag   { color: #444; }
  .lp-how .lp-section-tag::before { background: #2A2A2A; }
  .lp-steps { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: rgba(255,255,255,0.06); border-radius: 20px; overflow: hidden; margin-top: 56px; }
  .lp-step { background: #0A0A0A; padding: 40px 36px; transition: background .15s; position: relative; }
  .lp-step:hover { background: #111; }
  .lp-step-num { font-size: 48px; font-weight: 700; letter-spacing: -3px; color: rgba(255,255,255,0.08); font-family: 'DM Mono', monospace; line-height: 1; margin-bottom: 24px; }
  .lp-step-title { font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 10px; letter-spacing: -.3px; }
  .lp-step-sub { font-size: 13.5px; color: #555; line-height: 1.7; }
  .lp-step-arrow { position: absolute; top: 40px; right: 36px; color: rgba(255,255,255,0.15); }

  .lp-features { padding: 100px 5%; background: #F8F8F8; }
  .lp-feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-top: 56px; }
  .lp-feat-grid.reverse { direction: rtl; }
  .lp-feat-grid.reverse > * { direction: ltr; }
  .lp-feat-img { background: #0A0A0A; border-radius: 20px; padding: 30px; min-height: 320px; display: flex; align-items: center; justify-content: center; box-shadow: 0 20px 60px rgba(0,0,0,0.12); position: relative; overflow: hidden; }
  .lp-feat-img::before { content: ''; position: absolute; top: -50%; right: -20%; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(circle,rgba(255,255,255,0.05) 0%,transparent 65%); }
  .lp-feat-points { display: flex; flex-direction: column; gap: 24px; }
  .lp-feat-point { display: flex; gap: 16px; align-items: flex-start; }
  .lp-feat-point-ico { width: 38px; height: 38px; border-radius: 10px; background: rgba(0,0,0,0.07); border: 1px solid rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .lp-feat-point-title { font-size: 14.5px; font-weight: 600; color: #0A0A0A; margin-bottom: 4px; }
  .lp-feat-point-sub { font-size: 13px; color: #777; line-height: 1.65; }
  .lp-feat-dna-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  .lp-feat-dna-ring svg { transform: rotate(-90deg); }
  .lp-feat-dna-label { position: absolute; text-align: center; font-size: 22px; font-weight: 700; color: #fff; }
  .lp-feat-dna-sub { font-size: 9px; color: #555; font-family: 'DM Mono', monospace; }
  .lp-feat-bars { display: flex; flex-direction: column; gap: 10px; width: 100%; padding: 0 10px; }
  .lp-feat-bar-row { display: flex; align-items: center; gap: 10px; }
  .lp-feat-bar-label { font-size: 10px; color: #555; width: 100px; flex-shrink: 0; font-family: 'DM Mono', monospace; }
  .lp-feat-bar-track { flex: 1; height: 4px; background: rgba(255,255,255,0.08); border-radius: 99px; overflow: hidden; }
  .lp-feat-bar-fill  { height: 100%; border-radius: 99px; background: linear-gradient(90deg,#fff,#888); }
  .lp-feat-bar-pct { font-size: 10px; color: #555; font-family: 'DM Mono', monospace; width: 30px; text-align: right; flex-shrink: 0; }

  .lp-testi { padding: 100px 5%; background: #0A0A0A; }
  .lp-testi .lp-section-title { color: #fff; }
  .lp-testi .lp-section-tag   { color: #444; }
  .lp-testi .lp-section-tag::before { background: #222; }
  .lp-testi-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 48px; }
  .lp-testi-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 18px; padding: 26px; transition: border-color .15s; }
  .lp-testi-card:hover { border-color: rgba(255,255,255,0.16); }
  .lp-testi-stars { display: flex; gap: 3px; margin-bottom: 16px; }
  .lp-testi-star { font-size: 13px; color: #8F9C07; }
  .lp-testi-quote { font-size: 14px; color: #CCC; line-height: 1.75; margin-bottom: 20px; font-style: italic; }
  .lp-testi-author { display: flex; align-items: center; gap: 10px; }
  .lp-testi-ava { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#333,#111); border: 1px solid rgba(255,255,255,0.12); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; flex-shrink: 0; }
  .lp-testi-name { font-size: 13px; font-weight: 600; color: #fff; }
  .lp-testi-role { font-size: 11px; color: #555; margin-top: 1px; }

  .lp-cta { padding: 100px 5%; background: #F8F8F8; text-align: center; position: relative; overflow: hidden; }
  .lp-cta::before { content: ''; position: absolute; inset: 0; background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px); background-size: 60px 60px; }
  .lp-cta-inner { position: relative; z-index: 1; max-width: 620px; margin: 0 auto; }
  .lp-cta-title { font-size: clamp(36px, 4vw, 52px); font-weight: 700; letter-spacing: -2.5px; color: #0A0A0A; margin-bottom: 16px; line-height: 1.08; }
  .lp-cta-sub { font-size: 15px; color: #777; line-height: 1.7; margin-bottom: 36px; }
  .lp-cta-actions { display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
  .lp-cta-note { margin-top: 16px; font-size: 12px; color: #AAAAAA; }

  /* ── FOOTER PROFESIONAL ── */
  .lp-footer {
    background: #0D0D0F;
    border-top: 1px solid rgba(255,255,255,0.06);
    padding: 72px 5% 0;
    position: relative;
    overflow: hidden;
  }
  .lp-footer::before {
    content: '';
    position: absolute;
    top: -120px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 300px;
    background: radial-gradient(ellipse, rgba(255,255,255,0.03) 0%, transparent 70%);
    pointer-events: none;
  }
  .lp-footer-main {
    max-width: 1100px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1.8fr 1fr 1fr 1fr;
    gap: 48px;
    padding-bottom: 56px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    position: relative; z-index: 1;
  }
  .lp-footer-brand {}
  .lp-footer-logo { display: flex; align-items: baseline; gap: 1px; margin-bottom: 14px; }
  .lp-footer-logo span:first-child {
    font-size: 18px; font-weight: 700;
    background: linear-gradient(135deg,#fff,#888);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .lp-footer-logo span:last-child { font-size: 18px; font-weight: 300; color: #444; }
  .lp-footer-tagline {
    font-size: 13px; color: #555; line-height: 1.7;
    max-width: 240px; margin-bottom: 24px;
  }
  .lp-footer-socials { display: flex; align-items: center; gap: 8px; }
  .lp-footer-social-btn {
    width: 34px; height: 34px; border-radius: 9px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .15s;
    color: #555;
  }
  .lp-footer-social-btn:hover {
    background: rgba(255,255,255,0.1);
    border-color: rgba(255,255,255,0.15);
    color: #fff;
    transform: translateY(-2px);
  }
  .lp-footer-col {}
  .lp-footer-col-title {
    font-size: 10px; font-weight: 700;
    color: #fff;
    font-family: 'DM Mono', monospace;
    letter-spacing: .12em; text-transform: uppercase;
    margin-bottom: 18px;
  }
  .lp-footer-col-links { list-style: none; display: flex; flex-direction: column; gap: 11px; }
  .lp-footer-col-links a {
    font-size: 13px; color: #555; text-decoration: none;
    transition: color .15s; cursor: pointer;
    display: inline-flex; align-items: center; gap: 6px;
  }
  .lp-footer-col-links a:hover { color: #ddd; }
  .lp-footer-badge {
    font-size: 9px; font-weight: 700;
    color: #666;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 1px 5px; border-radius: 4px;
    line-height: 1.4;
    font-family: 'DM Mono', monospace;
  }
  .lp-footer-bottom {
    max-width: 1100px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 0;
    gap: 16px; flex-wrap: wrap;
    position: relative; z-index: 1;
  }
  .lp-footer-copy {
    font-size: 11.5px; color: #333;
    font-family: 'DM Mono', monospace; letter-spacing: .02em;
  }
  .lp-footer-tech {
    display: flex; align-items: center; gap: 8px;
    font-size: 10.5px; color: #2a2a2a;
    font-family: 'DM Mono', monospace; letter-spacing: .04em;
  }
  .lp-footer-tech-sep { color: #1e1e1e; }
  .lp-footer-tech-brand { color: #444; font-weight: 600; letter-spacing: .06em; }
  @media (max-width: 1024px) {
    .lp-footer-main { grid-template-columns: 1fr 1fr; gap: 36px; }
    .lp-footer-brand { grid-column: 1 / -1; }
  }
  @media (max-width: 640px) {
    .lp-footer-main { grid-template-columns: 1fr 1fr; gap: 28px; }
    .lp-footer-brand { grid-column: 1 / -1; }
    .lp-footer-bottom { flex-direction: column; align-items: flex-start; gap: 8px; }
  }

  .lp-fade-in { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
  .lp-fade-in.visible { opacity: 1; transform: translateY(0); }
  .lp-fade-in-delay-1 { transition-delay: .1s; }
  .lp-fade-in-delay-2 { transition-delay: .2s; }
  .lp-fade-in-delay-3 { transition-delay: .3s; }

  /* ── DROPDOWN ── */
  .lp-nav-dropdown-wrap {
    position: relative; margin-left: 32px;
  }
  .lp-nav-user-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 6px 12px 6px 6px;
    border-radius: 99px;
    border: 1.5px solid rgba(0,0,0,0.1);
    background: #fff;
    cursor: pointer;
    transition: all .15s;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  }
  .lp-nav-user-pill:hover { border-color: rgba(0,0,0,0.2); box-shadow: 0 4px 14px rgba(0,0,0,0.1); }
  .lp-nav-chevron {
    width: 14px; height: 14px; flex-shrink: 0; color: #888;
    transition: transform .2s;
  }
  .lp-nav-chevron.open { transform: rotate(180deg); }
  .lp-dropdown-menu {
    position: absolute; top: calc(100% + 8px); right: 0;
    min-width: 200px;
    background: #fff;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 14px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    overflow: hidden;
    animation: lp-dd-in .15s ease;
    z-index: 200;
  }
  @keyframes lp-dd-in { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
  .lp-dropdown-header {
    padding: 14px 16px 10px;
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .lp-dropdown-name { font-size: 13.5px; font-weight: 700; color: #0A0A0A; }
  .lp-dropdown-email { font-size: 11px; color: #AAA; margin-top: 2px; }
  .lp-dropdown-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px;
    font-size: 13px; font-weight: 500;
    color: #333; cursor: pointer;
    transition: background .12s;
    border: none; background: transparent;
    width: 100%; text-align: left;
    font-family: 'DM Sans', sans-serif;
  }
  .lp-dropdown-item:hover { background: rgba(0,0,0,0.04); }
  .lp-dropdown-item.danger { color: #DC2626; }
  .lp-dropdown-item.danger:hover { background: rgba(220,38,38,0.06); }
  .lp-dropdown-divider { height: 1px; background: rgba(0,0,0,0.07); margin: 2px 0; }

  @media (max-width: 1024px) {
    .lp-hero-inner    { grid-template-columns: 1fr; gap: 50px; }
    .lp-dashboard-preview { transform: none !important; }
    .lp-why-grid      { grid-template-columns: 1fr 1fr; }
    .lp-steps         { grid-template-columns: 1fr; }
    .lp-feat-grid     { grid-template-columns: 1fr; gap: 36px; }
    .lp-feat-grid.reverse { direction: ltr; }
    .lp-testi-grid    { grid-template-columns: 1fr 1fr; }
    .lp-scroll-hint   { display: none; }
  }
  @media (max-width: 640px) {
    .lp-nav-links { display: none; }
    .lp-nav-cta   { display: none; }
    .lp-nav-user  { display: none; }
    .lp-nav { padding: 0 4%; }
    .lp-hero, .lp-why, .lp-how, .lp-features, .lp-testi, .lp-cta { padding-left: 4%; padding-right: 4%; }
    .lp-stats-inner { grid-template-columns: 1fr 1fr; }
    .lp-why-grid    { grid-template-columns: 1fr; }
    .lp-testi-grid  { grid-template-columns: 1fr; }
    .lp-hero-title  { letter-spacing: -2px; }
    .lp-trust-row   { flex-wrap: wrap; gap: 12px; }
    .lp-trust-item  { border-right: none; padding-right: 0; margin-right: 0; }
    .lp-hero-mini-stats { grid-template-columns: repeat(3,1fr); }
  }
  `;
  

  /* ── ICONS ── */
  const IcTrending  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
  const IcBrain     = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.44-4.13z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.44-4.13z"/></svg>;
  const IcShield    = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  const IcZap       = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
  const IcBarChart  = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
  const IcLock      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
  const IcChat      = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  const IcArrowR    = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
  const IcCheck     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;
  const IcPlay      = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
  const IcSsl       = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
  const IcWifi      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/></svg>;
  const IcGlobe     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
  const IcGift      = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>;

  // Helper: buat inisial dari nama
  const initials = (name = "") =>
    name.trim().split(" ").filter(Boolean).map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  function Counter({ target, suffix = "", duration = 1800 }) {
    const [val, setVal] = useState(0);
    const ref = useRef(null);
    useEffect(() => {
      const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          let start = 0;
          const step = target / (duration / 16);
          const tick = () => {
            start = Math.min(start + step, target);
            setVal(Math.floor(start));
            if (start < target) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      }, { threshold: .3 });
      if (ref.current) obs.observe(ref.current);
      return () => obs.disconnect();
    }, [target, duration]);
    return <span ref={ref}>{val.toLocaleString("id-ID")}{suffix}</span>;
  }

  function useFadeIn() {
    const ref = useRef(null);
    useEffect(() => {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(e => e.isIntersecting && e.target.classList.add("visible"));
      }, { threshold: .1 });
      const els = ref.current?.querySelectorAll(".lp-fade-in");
      els?.forEach(el => obs.observe(el));
      return () => obs.disconnect();
    }, []);
    return ref;
  }

  function DashboardMock() {
    const bars = [42, 68, 100, 39, 84, 58, 62];
    return (
      <div className="lp-dashboard-preview">
        <div className="lp-dash-topbar">
          <div className="lp-dash-dot" style={{ background: "#F87171" }}/>
          <div className="lp-dash-dot" style={{ background: "#FBBF24" }}/>
          <div className="lp-dash-dot" style={{ background: "#4ADE80" }}/>
        </div>
        <div className="lp-dash-screen">
          <div className="lp-dash-balance-label">TOTAL SALDO</div>
          <div className="lp-dash-balance">Rp 6,15jt</div>
          <div className="lp-dash-cards">
            <div className="lp-dash-mini">
              <div className="lp-dash-mini-label">Masuk</div>
              <div className="lp-dash-mini-val green">+6,5jt</div>
            </div>
            <div className="lp-dash-mini">
              <div className="lp-dash-mini-label">Keluar</div>
              <div className="lp-dash-mini-val red">-350rb</div>
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#444", fontFamily: "'DM Mono',monospace", marginBottom: 8, textTransform: "uppercase", letterSpacing: ".08em" }}>Pengeluaran Mingguan</div>
          <div className="lp-dash-bars">
            {bars.map((h, i) => (
              <div key={i} className={`lp-dash-bar${i === 2 ? " active-bar" : ""}`} style={{ height: `${h}%` }}/>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            {["S","S","R","K","J","S","M"].map((d, i) => (
              <span key={i} style={{ fontSize: 8, color: i === 2 ? "#fff" : "#333", fontFamily: "'DM Mono',monospace", flex: 1, textAlign: "center" }}>{d}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function DnaVisual() {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const dims = [
      { label: "Budget", val: 85 },
      { label: "Impulsif", val: 42 },
      { label: "Menabung", val: 60 },
      { label: "Rencana", val: 70 },
    ];
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div className="lp-feat-dna-ring">
          <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
            <circle cx="80" cy="80" r={r} fill="none" strokeWidth="8"
              stroke="url(#lp-dna-g)" strokeLinecap="round"
              strokeDasharray={`${circ * 0.72} ${circ}`}/>
            <defs>
              <linearGradient id="lp-dna-g" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fff"/>
                <stop offset="100%" stopColor="#777"/>
              </linearGradient>
            </defs>
          </svg>
          <div className="lp-feat-dna-label">
            <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", lineHeight: 1 }}>72</div>
            <div className="lp-feat-dna-sub">/ 100</div>
          </div>
        </div>
        <div className="lp-feat-bars">
          {dims.map(d => (
            <div key={d.label} className="lp-feat-bar-row">
              <div className="lp-feat-bar-label">{d.label}</div>
              <div className="lp-feat-bar-track">
                <div className="lp-feat-bar-fill" style={{ width: `${d.val}%` }}/>
              </div>
              <div className="lp-feat-bar-pct">{d.val}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function Ticker() {
    const items = [
      { label: "Transaksi dicatat hari ini", val: "+1.243" },
      { label: "Pengguna baru minggu ini", val: "+87" },
      { label: "Rata-rata penghematan/bulan", val: "Rp 420rb" },
      { label: "Financial DNA dihitung", val: "10.214×" },
      { label: "Impulsif terdeteksi", val: "3.891" },
      { label: "Prediksi akurat", val: "98,2%" },
      { label: "Transaksi dicatat hari ini", val: "+1.243" },
      { label: "Pengguna baru minggu ini", val: "+87" },
      { label: "Rata-rata penghematan/bulan", val: "Rp 420rb" },
      { label: "Financial DNA dihitung", val: "10.214×" },
      { label: "Impulsif terdeteksi", val: "3.891" },
      { label: "Prediksi akurat", val: "98,2%" },
    ];
    return (
      <div className="lp-ticker">
        <div className="lp-ticker-inner">
          {items.map((item, i) => (
            <div key={i} className="lp-ticker-item">
              <div className="lp-ticker-dot"/>
              {item.label} — <span>{item.val}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════
    MAIN COMPONENT
    Props:
      onEnterDashboard() — navigasi ke auth / dashboard
      user               — { name, email } | null
      onLogout()         — logout & kembali ke landing
  ═══════════════════════════════════════════════════════════ */
  export default function LandingPage({ onEnterDashboard, user, onLogout }) {
    const [scrolled,     setScrolled]     = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handler = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
          setDropdownOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

    const featRef  = useFadeIn();
    const whyRef   = useFadeIn();
    const testiRef = useFadeIn();

    const isLoggedIn = !!user;
    const firstName  = isLoggedIn ? user.name.split(" ")[0] : "";
    const userAva    = isLoggedIn ? initials(user.name) : "";

    useEffect(() => {
      document.body.style.background = "#F8F8F8";
      document.body.style.color = "#0A0A0A";
      return () => {
        document.body.style.background = "";
        document.body.style.color = "";
      };
    }, []);

    useEffect(() => {
      const handler = () => setScrolled(window.scrollY > 40);
      window.addEventListener("scroll", handler);
      return () => window.removeEventListener("scroll", handler);
    }, []);

    const handleEnter = () => {
      window.scrollTo(0, 0);
      onEnterDashboard();
    };

    const FEATURES_WHY = [
      { ico: <IcTrending/>, title: "Prediksi Akhir Bulan", desc: "AI kami menganalisis pola pengeluaran dan memprediksi saldo akhir bulan sebelum terjadi krisis finansial." },
      { ico: <IcBrain/>,    title: "Financial DNA Score",  desc: "Dapatkan skor perilaku keuangan dari 4 dimensi: konsistensi, kontrol impulsif, tabungan, dan perencanaan." },
      { ico: <IcZap/>,      title: "Deteksi Impulsif",     desc: "Sistem otomatis mendeteksi transaksi impulsif berdasarkan waktu, nominal, dan kategori belanja kamu." },
      { ico: <IcBarChart/>, title: "Analitik Visual",      desc: "Dashboard interaktif dengan grafik pengeluaran harian, mingguan, dan bulanan yang mudah dibaca." },
      { ico: <IcShield/>,   title: "Data Terenkripsi",     desc: "Keamanan data finansial kamu adalah prioritas utama kami dengan enkripsi SSL 256-bit end-to-end." },
      { ico: <IcChat/>,     title: "Chat dengan NaviBot",   desc: "Tanyakan apa saja soal keuanganmu langsung ke AI. NaviBot siap memberi saran personal berbasis data transaksi kamu." },
    ];

    const TESTIMONIALS = [
      { stars: 5, quote: "NaviKas benar-benar mengubah cara saya mengelola keuangan. Fitur deteksi impulsif membantu saya hemat lebih dari Rp 500rb per bulan!", name: "Rizky A.", role: "Software Developer · Jakarta" },
      { stars: 5, quote: "Financial DNA Score-nya unik banget. Saya jadi tahu tipe belanja saya dan langsung bisa perbaiki kebiasaan keuangan yang buruk.", name: "Sari M.", role: "Desainer Grafis · Bandung" },
      { stars: 5, quote: "Dashboard-nya bersih dan mudah dipakai. Prediksi akhir bulan akurat dan membantu saya plan pengeluaran lebih baik.", name: "Budi P.", role: "Marketing Manager · Surabaya" },
    ];

    const TRUST = [
      { ico: <IcSsl/>,   label: "SSL 256-bit Encrypted" },
      { ico: <IcWifi/>,  label: "Real-time Sync" },
      { ico: <IcGlobe/>, label: "Made in Indonesia" },
      { ico: <IcGift/>,  label: "Gratis Selamanya" },
    ];

    const MINI_STATS = [
      { num: "10rb+", lbl: "Pengguna" },
      { num: "98%",   lbl: "Kepuasan" },
      { num: "50jt+", lbl: "Transaksi" },
    ];

    return (
      <div className="lp">
        <style>{CSS_LANDING}</style>

        {/* ══════════ NAVBAR ══════════ */}
        <nav className={`lp-nav${scrolled ? " scrolled" : ""}`}>
          <div className="lp-nav-logo">
            <span>Navi</span><span>Kas</span>
          </div>

          {/* Nav links — selalu tampil */}
          <ul className="lp-nav-links">
            <li><a onClick={() => document.getElementById("lp-why")?.scrollIntoView({ behavior: "smooth" })}>Fitur</a></li>
            <li><a onClick={() => document.getElementById("lp-how")?.scrollIntoView({ behavior: "smooth" })}>Cara Kerja</a></li>
            <li><a onClick={() => document.getElementById("lp-testi")?.scrollIntoView({ behavior: "smooth" })}>Testimoni</a></li>
          </ul>

          {/* ── Kondisional: belum login vs sudah login ── */}
          {!isLoggedIn ? (
            /* Belum login → tampilkan tombol Masuk & Daftar */
            <div className="lp-nav-cta">
              <button className="lp-btn-outline" onClick={handleEnter}>Masuk</button>
              <button className="lp-btn-solid"   onClick={handleEnter}>Daftar</button>
            </div>
          ) : (
            /* Sudah login → dropdown */
            <div className="lp-nav-dropdown-wrap" ref={dropdownRef}>
              <div className="lp-nav-user-pill" onClick={() => setDropdownOpen(p => !p)}>
                <div className="lp-nav-avatar">{userAva}</div>
                <div className="lp-nav-user-info">
                  <div className="lp-nav-user-name">{user.name}</div>
                  <div className="lp-nav-user-badge">● Aktif</div>
                </div>
                <svg className={`lp-nav-chevron${dropdownOpen ? " open" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </div>
              {dropdownOpen && (
                <div className="lp-dropdown-menu">
                  <div className="lp-dropdown-header">
                    <div className="lp-dropdown-name">{user.name}</div>
                    <div className="lp-dropdown-email">{user.email}</div>
                  </div>
                  <button className="lp-dropdown-item" onClick={() => { setDropdownOpen(false); handleEnter(); }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                    </svg>
                    Dashboard
                  </button>
                  <div className="lp-dropdown-divider"/>
                  <button className="lp-dropdown-item danger" onClick={() => { setDropdownOpen(false); onLogout(); }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Keluar
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* ══════════ HERO ══════════ */}
        <section className="lp-hero">
          <div className="lp-hero-bg"/>
          <div className="lp-hero-inner">
            <div>

              <h1 className="lp-hero-title">
                {isLoggedIn ? (
                  /* Heading personal saat sudah login */
                  <>Halo, <span className="lp-hero-title-grad">{firstName}!</span><br/>Dashboard<br/>menunggumu.</>
                ) : (
                  /* Heading default */
                  <>Kendalikan<br/><span className="lp-hero-title-grad">Keuanganmu</span><br/>Lebih Cerdas</>
                )}
              </h1>

              <p className="lp-hero-sub">
                {isLoggedIn
                  ? `Lanjutkan sesi kamu, ${firstName}. Pantau keuangan, lihat Financial DNA Score, dan cek prediksi akhir bulanmu langsung dari dashboard.`
                  : "NaviKas bukan sekadar pencatat transaksi. Kami menganalisis perilaku finansialmu, memprediksi risiko akhir bulan, dan membantu kamu jadi lebih bijak mengelola uang."
                }
              </p>

              <div className="lp-hero-actions">
                <button className="lp-btn-hero" onClick={handleEnter}>
                  {isLoggedIn ? "Buka Dashboard" : "Buka Dashboard"} <IcArrowR/>
                </button>
                {!isLoggedIn && (
                  <button className="lp-btn-hero-ghost"
                    onClick={() => document.getElementById("lp-how")?.scrollIntoView({ behavior: "smooth" })}>
                    <IcPlay/> Lihat Cara Kerja
                  </button>
                )}
                {isLoggedIn && (
                  <button className="lp-btn-hero-ghost" onClick={onLogout}>
                    Keluar dari Akun
                  </button>
                )}
              </div>

              <div className="lp-hero-note">
                <IcCheck/>
                {isLoggedIn
                  ? `Masuk sebagai ${user.email || user.name} · Sesi aktif`
                  : "Gratis selamanya · Tidak perlu kartu kredit"
                }
              </div>

              <div className="lp-trust-row">
                {TRUST.map((t, i) => (
                  <div key={i} className="lp-trust-item">
                    <div className="lp-trust-ico">{t.ico}</div>
                    {t.label}
                  </div>
                ))}
              </div>
            </div>

            <div className="lp-hero-visual">
              <div className="lp-float-card">
                <div className="lp-float-label">Financial DNA Score</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="lp-float-val">72 / 100</div>
                  <div style={{ padding: "2px 7px", borderRadius: 6, background: "rgba(74,222,128,0.12)", color: "#16A34A", fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>A</div>
                </div>
                <div className="lp-float-bar">
                  <div className="lp-float-bar-fill" style={{ width: "72%" }}/>
                </div>
              </div>
              <div className="lp-float-card">
                <div className="lp-float-label">Prediksi akhir bulan</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div className="lp-float-val">Rp 4,2jt</div>
                  <div style={{ padding: "2px 7px", borderRadius: 6, background: "rgba(251,191,36,0.12)", color: "#B45309", fontSize: 10, fontWeight: 700, fontFamily: "'DM Mono', monospace" }}>⚠ Sedang</div>
                </div>
              </div>
              <DashboardMock/>
              <div className="lp-hero-mini-stats">
                {MINI_STATS.map((s, i) => (
                  <div key={i} className="lp-hero-mini-stat">
                    <div className="lp-hero-mini-stat-num">{s.num}</div>
                    <div className="lp-hero-mini-stat-lbl">{s.lbl}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lp-scroll-hint">
            <div className="lp-scroll-hint-lbl">Scroll</div>
            <div className="lp-scroll-mouse"><div className="lp-scroll-wheel"/></div>
          </div>
        </section>

        <Ticker/>

        {/* STATS BAR */}
        <div className="lp-stats">
          <div className="lp-stats-inner">
            {[
              { num: 10000, suffix: "+",     label: "Pengguna Aktif" },
              { num: 98,    suffix: "%",     label: "Kepuasan Pengguna" },
              { num: 50,    suffix: " jt+",  label: "Transaksi Dicatat" },
              { num: 3,     suffix: " path", label: "Capstone Dicoding" },
            ].map((s, i) => (
              <div key={i} className="lp-stat-item">
                <div className="lp-stat-num"><Counter target={s.num} suffix={s.suffix}/></div>
                <div className="lp-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* WHY */}
        <section className="lp-why" id="lp-why" ref={whyRef}>
          <div className="lp-section-inner">
            <div className="lp-section-tag">Mengapa NaviKas</div>
            <h2 className="lp-section-title lp-fade-in">Lebih dari sekadar<br/>pencatatan keuangan</h2>
            <p className="lp-section-sub lp-fade-in lp-fade-in-delay-1">
              Ribuan pengguna memilih NaviKas karena kami menggabungkan Full Stack, AI, dan Data Science dalam satu platform yang mudah digunakan.
            </p>
            <div className="lp-why-grid">
              {FEATURES_WHY.map((f, i) => (
                <div
                  key={i}
                  className={`lp-why-card lp-fade-in lp-fade-in-delay-${(i % 3) + 1}`}
                >
                  <div className="lp-why-num">0{i + 1}</div>
                  <div className="lp-why-ico">{f.ico}</div>
                  <div className="lp-why-card-title">{f.title}</div>
                  <div className="lp-why-card-sub">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="lp-how" id="lp-how">
          <div className="lp-section-inner">
            <div className="lp-section-tag">Cara Kerja</div>
            <h2 className="lp-section-title">Mulai dalam 3 langkah</h2>
            <div className="lp-steps">
              {[
                { n: "01", title: "Daftar & Atur Profil",     desc: "Buat akun gratis, atur nama dan budget bulanan kamu. Tidak perlu kartu kredit atau informasi sensitif." },
                { n: "02", title: "Catat Transaksimu",         desc: "Input pemasukan dan pengeluaran harian. AI kami langsung mengkategorikan dan mendeteksi pola impulsif secara otomatis." },
                { n: "03", title: "Dapat Insight & DNA Score", desc: "Lihat Financial DNA Score kamu, prediksi saldo akhir bulan, dan saran pribadi dari AI untuk perbaiki kebiasaan finansial." },
              ].map((s, i) => (
                <div key={i} className="lp-step">
                  <div className="lp-step-num">{s.n}</div>
                  <div className="lp-step-title">{s.title}</div>
                  <div className="lp-step-sub">{s.desc}</div>
                  {i < 2 && <div className="lp-step-arrow"><IcArrowR/></div>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="lp-features" id="lp-features" ref={featRef}>
          <div className="lp-section-inner">
            <div className="lp-section-tag">Fitur Unggulan</div>
            <h2 className="lp-section-title lp-fade-in">Dashboard yang<br/>benar-benar berguna</h2>
            <div className="lp-feat-grid">
              <div className="lp-feat-img"><DashboardMock/></div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", fontFamily: "'DM Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>Dashboard Interaktif</div>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-1.5px", color: "#0A0A0A", marginBottom: 14, lineHeight: 1.15 }}>Semua data keuangan dalam satu layar</h3>
                <p style={{ fontSize: 14, color: "#777", lineHeight: 1.75, marginBottom: 28 }}>
                  Pantau saldo, pemasukan, pengeluaran, dan prediksi AI dalam satu tampilan yang bersih dan intuitif.
                </p>
                <div className="lp-feat-points">
                  {["Grafik harian, mingguan & bulanan", "Kartu saldo real-time", "Notifikasi risiko akhir bulan"].map((p, i) => (
                    <div key={i} className="lp-feat-point">
                      <div className="lp-feat-point-ico"><IcCheck/></div>
                      <div><div className="lp-feat-point-title">{p}</div></div>
                    </div>
                  ))}
                </div>
                <button className="lp-btn-hero" style={{ marginTop: 32 }} onClick={handleEnter}>
                  Coba Sekarang <IcArrowR/>
                </button>
              </div>
            </div>
            <div style={{ height: 72 }}/>
            <div className="lp-feat-grid reverse">
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#AAA", fontFamily: "'DM Mono',monospace", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 14 }}>AI · Financial DNA</div>
                <h3 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-1.5px", color: "#0A0A0A", marginBottom: 14, lineHeight: 1.15 }}>Kenali kepribadian finansialmu</h3>
                <p style={{ fontSize: 14, color: "#777", lineHeight: 1.75, marginBottom: 28 }}>
                  Financial DNA Score adalah skor unik 0–100 yang dihitung dari 4 dimensi perilaku keuangan.
                </p>
                <div className="lp-feat-points">
                  {[
                    { title: "Smart Saver",        desc: "Disiplin & terencana — skor ≥ 85" },
                    { title: "Balanced Planner",    desc: "Cukup terencana — skor 70–84" },
                    { title: "Impulsive Optimizer", desc: "Rentan impulsif — skor 55–69" },
                  ].map((p, i) => (
                    <div key={i} className="lp-feat-point">
                      <div className="lp-feat-point-ico"><IcBrain/></div>
                      <div>
                        <div className="lp-feat-point-title">{p.title}</div>
                        <div className="lp-feat-point-sub">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lp-feat-img"><DnaVisual/></div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="lp-testi" id="lp-testi" ref={testiRef}>
          <div className="lp-section-inner">
            <div className="lp-section-tag">Testimoni</div>
            <h2 className="lp-section-title lp-fade-in">Dipercaya ribuan<br/>pengguna aktif</h2>
            <div className="lp-testi-grid">
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className={`lp-testi-card lp-fade-in lp-fade-in-delay-${i + 1}`}>
                  <div className="lp-testi-stars">
                    {Array(t.stars).fill(0).map((_, j) => <span key={j} className="lp-testi-star">★</span>)}
                  </div>
                  <div className="lp-testi-quote">"{t.quote}"</div>
                  <div className="lp-testi-author">
                    <div className="lp-testi-ava">{t.name[0]}</div>
                    <div>
                      <div className="lp-testi-name">{t.name}</div>
                      <div className="lp-testi-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="lp-cta" id="lp-cta">
          <div className="lp-cta-inner">
            <h2 className="lp-cta-title">
              {isLoggedIn ? `Lanjutkan, ${firstName}!` : "Siap kendalikan\nkeuanganmu?"}
            </h2>
            <p className="lp-cta-sub">
              {isLoggedIn
                ? `Kamu sudah login sebagai ${user.name}. Buka dashboard untuk melihat laporan keuangan dan Financial DNA Score kamu.`
                : "Bergabunglah dengan ribuan pengguna yang sudah merasakan manfaat NaviKas. Gratis, tanpa kartu kredit, langsung pakai."
              }
            </p>
            <div className="lp-cta-actions">
              <button className="lp-btn-hero" onClick={handleEnter}>
                {isLoggedIn ? "Buka Dashboard" : "Buka Dashboard Sekarang"} <IcArrowR/>
              </button>
            </div>
            <div className="lp-cta-note">
              {isLoggedIn
                ? `✓ Masuk sebagai ${user.name} · ✓ Data aman & terenkripsi`
                : "✓ Gratis selamanya · ✓ Tidak perlu kartu kredit · ✓ Data aman & terenkripsi"
              }
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="lp-footer">
          <div className="lp-footer-main">
            {/* Brand */}
            <div className="lp-footer-brand">
              <div className="lp-footer-logo"><span>Navi</span><span>Kas</span></div>
              <p className="lp-footer-tagline">
                Asisten keuangan pribadi yang menggabungkan AI dan ilmu perilaku untuk membantu kamu hidup lebih cerdas secara finansial.
              </p>
              <div className="lp-footer-socials">
                {/* Instagram */}
                <button className="lp-footer-social-btn" title="Instagram">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".5" fill="currentColor"/>
                  </svg>
                </button>
                {/* Twitter/X */}
                <button className="lp-footer-social-btn" title="X (Twitter)">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
                {/* Facebook */}
                <button className="lp-footer-social-btn" title="Facebook">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </button>
                {/* LinkedIn */}
                <button className="lp-footer-social-btn" title="LinkedIn">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Navigasi */}
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Navigasi</div>
              <ul className="lp-footer-col-links">
                <li><a onClick={handleEnter} style={{cursor:"pointer"}}>Dashboard</a></li>
                <li><a onClick={() => document.getElementById("lp-why")?.scrollIntoView({ behavior: "smooth" })} style={{cursor:"pointer"}}>Fitur Unggulan</a></li>
                <li><a onClick={() => document.getElementById("lp-how")?.scrollIntoView({ behavior: "smooth" })} style={{cursor:"pointer"}}>Cara Kerja</a></li>
                <li><a onClick={() => document.getElementById("lp-testi")?.scrollIntoView({ behavior: "smooth" })} style={{cursor:"pointer"}}>Testimoni</a></li>
                <li><a onClick={handleEnter} style={{cursor:"pointer"}}>Premium Plan <span className="lp-footer-badge">PRO</span></a></li>
              </ul>
            </div>

            {/* Produk */}
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Produk</div>
              <ul className="lp-footer-col-links">
                <li><a>Financial DNA Score</a></li>
                <li><a>Analisis Pengeluaran</a></li>
                <li><a>Prediksi AI</a></li>
                <li><a>Laporan Bulanan</a></li>
                <li><a>Notifikasi Cerdas</a></li>
              </ul>
            </div>

            {/* Legalitas */}
            <div className="lp-footer-col">
              <div className="lp-footer-col-title">Legalitas</div>
              <ul className="lp-footer-col-links">
                <li><a>Kebijakan Privasi</a></li>
                <li><a>Syarat &amp; Ketentuan</a></li>
                <li><a>Cookie Policy</a></li>
                <li><a>Bantuan</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="lp-footer-bottom">
            <div className="lp-footer-copy">© 2026 NaviKas Indonesia · Dicoding Capstone · Seluruh hak cipta dilindungi.</div>
            <div className="lp-footer-tech">
              <span>REACT 18</span>
              <span className="lp-footer-tech-sep">·</span>
              <span>LARAVEL 11</span>
              <span className="lp-footer-tech-sep">·</span>
              <span>PYTHON 3.12</span>
              <span className="lp-footer-tech-sep">·</span>
              <span>POWERED BY</span>
              <span className="lp-footer-tech-brand">NAVIKAS ENGINE</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }``