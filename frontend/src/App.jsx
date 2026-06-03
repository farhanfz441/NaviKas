import React, { useState, useEffect, useRef } from "react";
import LandingPage from './Landingpage';
import AuthPage from './AuthPage';
import { useStore } from './store/useStore';
import { transactionAPI, predictionAPI, authAPI } from './services/api';

const DARK = {
  "--bg":"#0A0A0A","--bg2":"#111111","--bg3":"#161616",
  "--surface":"rgba(18,18,18,0.97)","--surface2":"rgba(22,22,22,0.98)",
  "--glass":"rgba(255,255,255,0.03)","--glass2":"rgba(255,255,255,0.06)",
  "--input":"rgba(255,255,255,0.05)",
  "--border":"rgba(255,255,255,0.08)","--border2":"rgba(255,255,255,0.15)",
  "--accent":"#FFFFFF","--accent2":"#E0E0E0","--accent-dim":"rgba(255,255,255,0.08)","--glow":"rgba(255,255,255,0.12)",
  "--grad1":"#FFFFFF","--grad2":"#A0A0A0",
  "--green":"#4ADE80","--green-dim":"rgba(74,222,128,0.1)",
  "--red":"#F87171","--red-dim":"rgba(248,113,113,0.1)",
  "--amber":"#FBBF24","--amber-dim":"rgba(251,191,36,0.1)",
  "--text":"#F5F5F5","--text2":"#888888","--text3":"#444444",
  "--hero-grad":"linear-gradient(145deg,#0A0A0A 0%,#111111 60%,#0D0D0D 100%)",
  "--card-grad":"linear-gradient(135deg,rgba(255,255,255,0.06) 0%,rgba(255,255,255,0.02) 100%)",
  "--btn-grad":"linear-gradient(135deg,#FFFFFF 0%,#C0C0C0 100%)",
  "--shadow":"0 8px 40px rgba(0,0,0,0.6)","--shadow-sm":"0 2px 16px rgba(0,0,0,0.4)",
};
const LIGHT = {
  "--bg":"#EEECEA","--bg2":"#F4F2EF","--bg3":"#E8E5E2",
  "--surface":"rgba(247,245,242,0.98)","--surface2":"rgba(242,240,237,0.99)",
  "--glass":"rgba(0,0,0,0.025)","--glass2":"rgba(0,0,0,0.05)",
  "--input":"rgba(0,0,0,0.045)",
  "--border":"rgba(0,0,0,0.08)","--border2":"rgba(0,0,0,0.14)",
  "--accent":"#1A1A1A","--accent2":"#2E2E2E","--accent-dim":"rgba(0,0,0,0.07)","--glow":"rgba(0,0,0,0.05)",
  "--grad1":"#1A1A1A","--grad2":"#4A4A4A",
  "--green":"#16A34A","--green-dim":"rgba(22,163,74,0.10)",
  "--red":"#DC2626","--red-dim":"rgba(220,38,38,0.10)",
  "--amber":"#D97706","--amber-dim":"rgba(217,119,6,0.10)",
  "--text":"#1A1A1A","--text2":"#525252","--text3":"#A3A3A3",
  "--hero-grad":"linear-gradient(145deg,#EEECEA 0%,#F4F2EF 60%,#E9E7E4 100%)",
  "--card-grad":"linear-gradient(135deg,rgba(255,254,252,0.8) 0%,rgba(242,240,237,0.6) 100%)",
  "--btn-grad":"linear-gradient(135deg,#1A1A1A 0%,#3A3A3A 100%)",
  "--shadow":"0 8px 40px rgba(0,0,0,0.09)","--shadow-sm":"0 2px 16px rgba(0,0,0,0.06)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;transition:background .3s,color .3s;-webkit-font-smoothing:antialiased;overscroll-behavior:none}
::selection{background:var(--accent-dim);color:var(--accent)}
::-webkit-scrollbar{width:2px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:2px}

.app-bg{position:fixed;inset:0;z-index:0;pointer-events:none;background:var(--hero-grad)}
.app-bg::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 10% 10%,var(--glow) 0%,transparent 60%),radial-gradient(ellipse at 90% 80%,var(--glow) 0%,transparent 60%)}
.app-bg::after{content:'';position:absolute;inset:0;background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);background-size:80px 80px;opacity:.3}

.app{position:relative;z-index:1;display:flex;height:100vh;overflow:hidden}
.sidebar{width:240px;flex-shrink:0;background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;padding:28px 0;position:sticky;top:0;height:100vh;overflow-y:auto;transition:width .2s}
.main{flex:1;overflow-x:hidden;min-height:0;display:flex;flex-direction:column;height:100vh;overflow-y:auto}
.page{padding:36px 40px;width:100%;flex:1;overflow-y:auto}

.logo{padding:0 20px 28px;border-bottom:1px solid var(--border);margin-bottom:24px}
.logo-wordmark{display:flex;align-items:baseline;gap:1px}
.logo-f{font-size:26px;font-weight:700;background:linear-gradient(135deg,var(--grad1),var(--grad2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.5px}
.logo-track{font-size:26px;font-weight:300;color:var(--text2);letter-spacing:-.3px}
.logo-sub{font-size:9px;color:var(--text3);font-family:'DM Mono',monospace;margin-top:3px;letter-spacing:.12em;text-transform:uppercase}
.nav-sec{font-size:9px;font-family:'DM Mono',monospace;color:var(--text3);padding:14px 20px 4px;letter-spacing:.14em;text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:12px;padding:10px 20px;font-size:13px;color:var(--text2);cursor:pointer;border-left:2px solid transparent;transition:all .15s;font-weight:400;margin:1px 0}
.nav-item:hover{color:var(--text);background:var(--glass2)}
.nav-item.active{color:var(--accent);border-left-color:var(--accent);background:var(--accent-dim);font-weight:600}
.sidebar-foot{margin-top:auto;padding:18px 20px;border-top:1px solid var(--border)}
.user-pill{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--glass2);border-radius:12px;border:1px solid var(--border);cursor:pointer;margin-bottom:10px}
.ava{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--grad1),var(--grad2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--bg);flex-shrink:0}
.u-name{font-size:12.5px;font-weight:600}.u-plan{font-size:10px;color:var(--text3)}
.plan-badge{margin-left:auto;font-size:8.5px;padding:2px 7px;border-radius:99px;background:var(--glass2);color:var(--text3);font-family:'DM Mono',monospace;font-weight:500;border:1px solid var(--border)}
.back-btn{display:flex;align-items:center;gap:8px;padding:9px 12px;border-radius:10px;cursor:pointer;background:var(--glass2);border:1px solid var(--border);font-size:12px;color:var(--text2);transition:all .15s;width:100%}
.back-btn:hover{color:var(--text);border-color:var(--border2);background:var(--glass)}

.card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:22px 24px;box-shadow:var(--shadow-sm)}
.card-glow{border-color:var(--border2)}
.hero-card{background:var(--card-grad);border:1px solid var(--border2);border-radius:20px;padding:28px;position:relative;overflow:hidden}
.hero-card::before{content:'';position:absolute;top:-60%;right:-10%;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,var(--glow) 0%,transparent 65%);pointer-events:none}
.bal-lbl{font-size:11px;color:var(--text);margin-bottom:8px;font-family:'DM Mono',monospace;text-transform:uppercase;letter-spacing:.1em}
.bal-amt{font-size:42px;font-weight:700;letter-spacing:-3px;margin-bottom:8px;background:linear-gradient(135deg,var(--grad1),var(--grad2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.bal-chg{display:inline-flex;align-items:center;gap:5px;font-size:11.5px;padding:4px 10px;border-radius:99px;background:var(--green-dim);color:var(--green)}

.action-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:22px}
.act-btn{display:flex;flex-direction:column;align-items:center;gap:7px;padding:12px 8px;border-radius:12px;cursor:pointer;background:var(--glass2);border:1px solid var(--border);transition:all .15s;color:var(--text2)}
.act-btn:hover{background:var(--accent-dim);border-color:var(--border2);color:var(--accent)}
.act-btn span{font-size:11px;font-weight:500}

.tabs-row{display:flex;gap:4px;background:var(--glass2);border:1px solid var(--border);border-radius:10px;padding:3px}
.tab-btn{flex:1;padding:6px 10px;border-radius:7px;font-size:11.5px;font-weight:500;cursor:pointer;border:none;transition:all .15s;color:var(--text2);background:transparent;font-family:'DM Sans',sans-serif}
.tab-btn.active{background:var(--surface);color:var(--accent);box-shadow:var(--shadow-sm);border:1px solid var(--border)}

.chart-area{height:130px;display:flex;align-items:flex-end;gap:6px;padding-top:8px}
.bar-col{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer}
.bar-fill{width:100%;border-radius:6px 6px 0 0;min-height:4px;transition:all .3s ease;position:relative;overflow:hidden}
.bar-fill::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.12) 0%,transparent 60%)}
.bar-lbl{font-size:9px;color:var(--text3);font-family:'DM Mono',monospace}
.bar-lbl.active-l{color:var(--accent)}

.txn-item{display:flex;align-items:center;gap:14px;padding:11px 0;border-bottom:1px solid var(--border);transition:all .15s;cursor:pointer}
.txn-item:last-child{border-bottom:none}
.txn-item:hover{background:var(--glass);margin:0 -12px;padding:11px 12px;border-radius:10px}
.txn-ico{width:40px;height:40px;border-radius:11px;background:var(--glass2);display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;border:1px solid var(--border)}
.txn-name{font-size:13.5px;font-weight:500;margin-bottom:2px}
.txn-meta{font-size:10.5px;color:var(--text3)}
.txn-amt{font-family:'DM Mono',monospace;font-size:12.5px;font-weight:500;text-align:right}
.txn-sub{font-size:10px;color:var(--text3);text-align:right;margin-top:2px}
.imp-tag{font-size:9px;padding:2px 6px;border-radius:4px;background:var(--red-dim);color:var(--red);font-family:'DM Mono',monospace;margin-left:6px}

.badge{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;padding:3px 9px;border-radius:99px;font-family:'DM Mono',monospace}
.bg{background:var(--green-dim);color:var(--green)}.br{background:var(--red-dim);color:var(--red)}.ba{background:var(--amber-dim);color:var(--amber)}.bb{background:var(--accent-dim);color:var(--accent)}

.btn{display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:10px;font-size:13px;font-weight:600;cursor:pointer;border:none;transition:all .15s;font-family:'DM Sans',sans-serif}
.btn-p{background:var(--btn-grad);color:var(--bg);box-shadow:var(--shadow-sm)}
.btn-p:hover{transform:translateY(-1px);box-shadow:var(--shadow)}
.btn-g{background:var(--glass2);border:1px solid var(--border);color:var(--text)}
.btn-g:hover{background:var(--glass);border-color:var(--border2)}
.btn-d{background:var(--red-dim);border:1px solid var(--red);color:var(--red)}
.btn-sm{padding:6px 12px;font-size:12px;border-radius:8px}

.tbl-wrap{overflow-x:auto}
table{width:100%;border-collapse:collapse;font-size:13px}
th{font-size:9.5px;font-family:'DM Mono',monospace;color:var(--text3);letter-spacing:.1em;padding:0 14px 12px;text-align:left;font-weight:400;border-bottom:1px solid var(--border);text-transform:uppercase}
td{padding:13px 14px;border-bottom:1px solid var(--border);color:var(--text)}
tr:last-child td{border-bottom:none}
tr:hover td{background:var(--glass)}

.fg{margin-bottom:16px}.fl{font-size:11.5px;color:var(--text2);margin-bottom:6px;display:block;font-weight:500}
.fi{width:100%;padding:10px 14px;background:var(--input);border:1px solid var(--border);border-radius:10px;color:var(--text);font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border .2s,box-shadow .2s}
.fi:focus{border-color:var(--border2);box-shadow:0 0 0 3px var(--accent-dim)}
.fi::placeholder{color:var(--text3)}
.fs{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;padding-right:34px}
select.fi option{background:var(--surface2,#1a1a1a);color:var(--text,#fff);padding:6px 10px}
.fr{display:grid;grid-template-columns:1fr 1fr;gap:14px}

.modal-ov{position:fixed;inset:0;background:rgba(0,0,0,0.72);backdrop-filter:blur(12px);z-index:200;display:flex;align-items:center;justify-content:center;animation:fIn .2s ease}
.modal{background:var(--surface2);border:1px solid var(--border2);border-radius:20px;padding:30px;width:460px;max-width:95vw;box-shadow:var(--shadow);animation:sUp .25s ease}
.m-title{font-size:20px;font-weight:700;letter-spacing:-.5px;margin-bottom:4px}.m-sub{font-size:12.5px;color:var(--text2);margin-bottom:22px}
.m-foot{display:flex;gap:10px;justify-content:flex-end;margin-top:22px}

.toast{position:fixed;bottom:24px;right:24px;z-index:300;background:var(--surface2);border:1px solid var(--border2);border-radius:12px;padding:12px 18px;font-size:13px;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow);animation:sUp .25s ease}

.dna-ring{position:relative;display:inline-flex;align-items:center;justify-content:center}
.dna-ring svg{transform:rotate(-90deg)}.dna-rl{position:absolute;text-align:center}
.prog-t{height:4px;background:var(--glass2);border-radius:99px;overflow:hidden}
.prog-f{height:100%;border-radius:99px;transition:width .5s ease}

/* ── FINANCIAL DNA ENHANCED ── */
.dna-tab-row{display:flex;gap:4px;background:var(--glass2);border:1px solid var(--border);border-radius:10px;padding:3px;margin-bottom:20px}
.dna-tab{flex:1;padding:7px 10px;border-radius:7px;font-size:11.5px;font-weight:500;cursor:pointer;border:none;transition:all .15s;color:var(--text2);background:transparent;font-family:'DM Sans',sans-serif;text-align:center}
.dna-tab.active{background:var(--surface);color:var(--accent);box-shadow:var(--shadow-sm);border:1px solid var(--border)}
.badge-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:4px}
.badge-item{display:flex;flex-direction:column;align-items:center;gap:6px;padding:14px 8px;border-radius:12px;border:1px solid var(--border);background:var(--glass);text-align:center;transition:border-color .2s}
.badge-item.earned{border-color:var(--border2);background:var(--accent-dim)}
.badge-item.locked{opacity:.4}
.badge-emoji{font-size:22px;line-height:1;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;background:var(--glass2)}
.badge-name{font-size:9.5px;font-weight:600;color:var(--text);font-family:'DM Mono',monospace}
.badge-desc{font-size:9px;color:var(--text3);line-height:1.4}
.sim-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid var(--border)}
.sim-row:last-child{border-bottom:none}
.sim-slider{width:100%;appearance:none;height:3px;border-radius:99px;background:var(--glass2);outline:none;cursor:pointer}
.sim-slider::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:var(--accent);cursor:pointer;border:2px solid var(--bg)}
.trend-bar-wrap{display:flex;align-items:flex-end;gap:6px;height:60px;margin-top:10px}
.trend-bar{flex:1;border-radius:4px 4px 0 0;min-height:4px;transition:all .4s ease;position:relative;cursor:pointer}
.trend-bar-lbl{font-size:8px;color:var(--text3);font-family:'DM Mono',monospace;text-align:center;margin-top:4px}
.day-heat-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin-top:8px}
.day-cell{aspect-ratio:1;border-radius:4px;display:flex;align-items:center;justify-content:center;font-size:8px;font-family:'DM Mono',monospace;font-weight:600;transition:all .2s;cursor:default}
.streak-badge{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:99px;background:var(--green-dim);border:1px solid var(--green);color:var(--green);font-size:12px;font-weight:600}
.what-if-result{margin-top:14px;padding:14px;border-radius:12px;background:var(--green-dim);border:1px solid var(--green);display:flex;align-items:center;gap:12px}
.dna-tip-row{display:flex;gap:10px;padding:12px 0;border-bottom:1px solid var(--border);align-items:flex-start}
.dna-tip-row:last-child{border-bottom:none}
.dna-tip-num{width:22px;height:22px;border-radius:50%;background:var(--accent);color:var(--bg);display:flex;align-items:center;justify-content:center;font-size:9.5px;font-weight:700;flex-shrink:0;margin-top:1px}
.hour-heatmap{display:grid;grid-template-columns:repeat(12,1fr);gap:3px;margin-top:8px}
.hour-cell{height:20px;border-radius:3px;transition:all .2s;cursor:default;position:relative}
.hour-cell:hover::after{content:attr(data-label);position:absolute;bottom:24px;left:50%;transform:translateX(-50%);background:var(--surface2);border:1px solid var(--border2);padding:3px 7px;border-radius:6px;font-size:9px;white-space:nowrap;font-family:'DM Mono',monospace;z-index:10;pointer-events:none}

.sw-row{display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)}
.sw-row:last-child{border-bottom:none}
.tog{width:38px;height:20px;border-radius:99px;cursor:pointer;position:relative;transition:background .2s;flex-shrink:0;background:var(--glass2);border:1px solid var(--border)}
.tog.on{background:var(--accent);border-color:var(--accent)}
.tog::after{content:'';position:absolute;top:1.5px;left:2px;width:15px;height:15px;background:var(--text3);border-radius:50%;transition:transform .2s,background .2s}
.tog.on::after{transform:translateX(18px);background:var(--bg)}

.plan-c{border:1px solid var(--border);border-radius:14px;padding:18px;cursor:pointer;transition:all .15s;background:var(--glass)}
.plan-c.sel{border-color:var(--border2);background:var(--accent-dim)}

.two-col{display:grid;grid-template-columns:1fr 360px;gap:20px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.ph{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px}
.pt{font-size:26px;font-weight:700;letter-spacing:-1px;margin-bottom:3px}.ps{font-size:12.5px;color:var(--text2)}
.sec-t{font-size:11.5px;font-weight:600;color:var(--text2);margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;text-transform:uppercase;letter-spacing:.06em}
.div{height:1px;background:var(--border);margin:16px 0}
.pills{display:flex;gap:6px;margin-bottom:20px;flex-wrap:wrap}
.ptab{padding:6px 14px;border-radius:99px;font-size:12px;cursor:pointer;border:1px solid var(--border);color:var(--text2);transition:all .15s;font-family:'DM Sans',sans-serif;background:transparent}
.ptab.active{background:var(--accent);color:var(--bg);border-color:var(--accent)}
.ptab:hover:not(.active){border-color:var(--border2);color:var(--text)}

.cat-stat-row{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:12px;background:var(--glass);border:1px solid var(--border);margin-bottom:10px}
.cat-stat-ico{width:42px;height:42px;border-radius:11px;background:var(--glass2);display:flex;align-items:center;justify-content:center;font-size:19px;flex-shrink:0}
.notif-c{padding:12px;border-radius:12px;background:var(--glass);border:1px solid var(--border);margin-bottom:10px;display:flex;gap:12px;align-items:flex-start}
.notif-ico{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.dot{width:6px;height:6px;border-radius:50%;display:inline-block}
.cat-food{background:#FF7043}.cat-transport{background:#60A5FA}.cat-health{background:#4ADE80}
.cat-shop{background:#C084FC}.cat-entertain{background:#FBBF24}.cat-salary{background:#4ADE80}.cat-other{background:#888888}

.loading-spin{display:inline-block;width:14px;height:14px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes fIn{from{opacity:0}to{opacity:1}}
@keyframes sUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.fi-a{animation:fIn .25s ease}.su-a{animation:sUp .25s ease}

/* FinBot Page */
.finbot-wrap{display:flex;flex-direction:column;flex:1;overflow:hidden;min-height:0}
.finbot-msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:12px;padding:0 0 16px}
.finbot-bubble-bot{max-width:72%;padding:11px 15px;border-radius:16px 16px 16px 4px;background:var(--glass2);border:1px solid var(--border);font-size:13px;line-height:1.7;color:var(--text)}
.finbot-bubble-user{max-width:72%;padding:11px 15px;border-radius:16px 16px 4px 16px;background:linear-gradient(135deg,var(--grad1),var(--grad2));font-size:13px;line-height:1.7;color:#fff;align-self:flex-end}
.finbot-suggestions-wrap{flex-shrink:0;border-top:1px solid var(--border);padding:10px 0 0}
.finbot-sug-label{font-size:9.5px;color:var(--text3);font-family:'DM Mono',monospace;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.finbot-suggestions{display:flex;gap:8px;overflow-x:scroll;padding-bottom:6px;scrollbar-width:thin;scrollbar-color:var(--border) transparent;-webkit-overflow-scrolling:touch;cursor:grab;user-select:none}
.finbot-suggestions:active{cursor:grabbing}
.finbot-suggestions::-webkit-scrollbar{height:3px}
.finbot-suggestions::-webkit-scrollbar-track{background:transparent}
.finbot-suggestions::-webkit-scrollbar-thumb{background:var(--border);border-radius:99px}
.finbot-sug-chip{white-space:nowrap;padding:7px 14px;border-radius:20px;font-size:12px;cursor:pointer;border:1px solid var(--border);color:var(--text2);background:var(--glass2);font-family:'DM Sans',sans-serif;transition:all .15s;flex-shrink:0}
.finbot-sug-chip:hover:not(:disabled){background:var(--accent-dim);border-color:var(--accent);color:var(--accent);transform:translateY(-1px)}
.finbot-sug-chip:disabled{opacity:.45;cursor:not-allowed}
.finbot-avatar-pulse{position:relative;display:inline-flex;align-items:center;justify-content:center}
.finbot-avatar-pulse::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:2px solid var(--accent);opacity:0;animation:avatarPulse 2s ease-in-out infinite}
@keyframes avatarPulse{0%,100%{opacity:0;transform:scale(1)}50%{opacity:.4;transform:scale(1.15)}}
@keyframes typingBounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-5px);opacity:1}}
.finbot-sug-chip:hover{background:var(--accent-dim);border-color:var(--border2);color:var(--accent)}
.finbot-input-row{display:flex;gap:10px;padding-top:12px}
/* Finbot sidebar backdrop — hidden by default, shown on mobile only */
.finbot-sidebar-backdrop{display:none;position:fixed;inset:0;z-index:55;background:rgba(0,0,0,0.45);backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px)}
.finbot-history-item.active{background:var(--accent-dim);border:1px solid var(--accent)}

@keyframes drawLine{from{stroke-dashoffset:attr(stroke-dasharray)}to{stroke-dashoffset:0}}
@keyframes fadeArea{from{opacity:0}to{opacity:1}}
@keyframes dotPop{0%{r:0;opacity:0}70%{r:5;opacity:1}100%{r:4;opacity:1}}
.line-draw{animation:drawLine 1.2s cubic-bezier(.4,0,.2,1) both}
.area-fade{animation:fadeArea .8s ease .4s both}
.dot-pop{animation:dotPop .4s cubic-bezier(.4,0,.2,1) 1.1s both}
/* Dashboard-style chart mini card */
.dash-chart-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:22px 24px;box-shadow:var(--shadow-sm);margin-bottom:18px}
.dash-chart-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.dash-chart-val{font-weight:700;font-size:22px;letter-spacing:-1px}
.dash-chart-sub{font-size:10px;color:var(--text3);font-family:'DM Mono',monospace;margin-top:2px}
/* Tabel Statistik */
.stat-table-wrap{background:var(--surface);border:1px solid var(--border);border-radius:16px;overflow:hidden;margin-top:18px}
.stat-table-head{display:flex;gap:4px;background:var(--glass2);padding:12px 16px;border-bottom:1px solid var(--border);align-items:center;overflow-x:auto;flex-wrap:nowrap;-webkit-overflow-scrolling:touch}
.stat-table-tab{padding:5px 14px;border-radius:7px;font-size:11.5px;font-weight:500;cursor:pointer;border:none;font-family:'DM Sans',sans-serif;color:var(--text2);background:transparent;transition:all .15s}
.stat-table-tab.active{background:var(--surface);color:var(--accent);box-shadow:var(--shadow-sm);border:1px solid var(--border)}
/* Live row highlight */
.stat-tbl{width:100%;border-collapse:collapse;font-size:13px}
.stat-tbl th{font-size:9.5px;font-family:'DM Mono',monospace;color:var(--text3);letter-spacing:.1em;padding:10px 18px;text-align:left;font-weight:400;border-bottom:1px solid var(--border);text-transform:uppercase;white-space:nowrap}
.stat-tbl th.num{text-align:right}
.stat-tbl td{padding:12px 18px;border-bottom:1px solid var(--border);color:var(--text);vertical-align:middle;white-space:nowrap}
.stat-tbl tr:last-child td{border-bottom:none}
.stat-tbl tr:hover td{background:var(--glass)}
.stat-tbl tr.live-row td{background:var(--accent-dim)}
.stat-tbl tr.live-row:hover td{background:var(--accent-dim)}
.stat-tbl tfoot tr td{border-top:2px solid var(--border2);border-bottom:none;padding-top:13px;padding-bottom:13px;font-weight:600;font-size:12px;background:var(--glass)}
/* Live badge & pulse dot */
.live-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:var(--accent);position:relative;flex-shrink:0}
.live-dot::after{content:'';position:absolute;inset:-3px;border-radius:50%;background:var(--accent);opacity:.35;animation:livePulse 1.6s ease-in-out infinite}
.live-badge{display:inline-flex;align-items:center;gap:5px;font-size:8px;font-family:'DM Mono',monospace;color:var(--accent);background:var(--accent-dim);border:1px solid var(--border2);border-radius:99px;padding:2px 7px;letter-spacing:.08em;text-transform:uppercase;margin-left:8px;vertical-align:middle}
@keyframes livePulse{0%,100%{transform:scale(1);opacity:.35}50%{transform:scale(1.9);opacity:0}}

/* Analytics enhancements */
/* KPI strip */
.kpi-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
.stat-card-kpi .stat-card-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px}
.stat-card-kpi .stat-card-lbl{font-size:9px;font-family:'DM Mono',monospace;color:var(--text3);letter-spacing:.12em;text-transform:uppercase;line-height:1.4}
.stat-card-kpi .stat-card-val{font-size:24px;font-weight:700;letter-spacing:-1.5px;margin-bottom:4px}
.stat-card-kpi .stat-card-sub{font-size:10.5px;color:var(--text3)}
/* Analytics enhancements */
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:20px 22px;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;transition:border-color .2s}
.stat-card:hover{border-color:var(--border2)}
.stat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;border-radius:16px 16px 0 0}
.chart-card{background:var(--surface);border:1px solid var(--border2);border-radius:18px;padding:24px 26px;box-shadow:var(--shadow-sm)}
.bar-col-new{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;position:relative}
.bar-wrap{width:100%;position:relative;display:flex;align-items:flex-end;justify-content:center}
.bar-inner{border-radius:8px 8px 0 0;transition:all .35s cubic-bezier(.4,0,.2,1);position:relative;width:70%;min-height:4px}
.bar-inner::after{content:'';position:absolute;inset:0;border-radius:inherit;background:linear-gradient(180deg,rgba(255,255,255,.15) 0%,transparent 50%)}
.bar-val{position:absolute;top:-22px;left:50%;transform:translateX(-50%);font-size:9px;font-family:'DM Mono',monospace;white-space:nowrap;padding:2px 6px;border-radius:5px;opacity:0;transition:opacity .2s}
.bar-col-new:hover .bar-val{opacity:1}
.cat-donut-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)}
.cat-donut-row:last-child{border-bottom:none}
.insight-pill{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:10px;background:var(--glass);border:1px solid var(--border);font-size:12px}
@keyframes barGrow{from{transform:scaleY(0);transform-origin:bottom}to{transform:scaleY(1);transform-origin:bottom}}
@keyframes barIn{0%{opacity:0;transform:scaleY(0)}100%{opacity:1;transform:scaleY(1)}}
@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulseRing{0%{transform:scale(1);opacity:.6}70%{transform:scale(1.5);opacity:0}100%{transform:scale(1.5);opacity:0}}
.bar-inner-anim{animation:barIn .45s cubic-bezier(.4,0,.2,1) both;transform-origin:bottom}
.analytics-fade{animation:fadeUp .35s ease both}
.stat-card-anim{animation:fadeUp .3s ease both}
.bar-tooltip{background:var(--surface2);border:1px solid var(--border2);color:var(--text);font-size:9px;font-family:'DM Mono',monospace;padding:4px 8px;border-radius:7px;white-space:nowrap;box-shadow:0 4px 12px rgba(0,0,0,.25);opacity:0;transition:opacity .15s;position:absolute;top:-38px;left:50%;transform:translateX(-50%);pointer-events:none;z-index:10}
.bar-col-new:hover .bar-tooltip{opacity:1}
@keyframes pulseRingAnim{0%{r:7;opacity:.6}70%{r:14;opacity:0}100%{r:14;opacity:0}}


/* ── MOBILE DRAWER SYSTEM ── */
.mobile-topbar{display:none}
.drawer-backdrop{display:none}
.drawer-panel{display:none}

/* ── TABLET (≤960px) ── */
@media(max-width:960px){
  .sidebar{width:60px}
  .logo-wordmark,.logo-sub,.nav-item span,.nav-sec,.u-name,.u-plan,.plan-badge,.back-btn span{display:none}
  .nav-item{justify-content:center;padding:12px;border-left:none;border-radius:10px;margin:2px 8px}
  .nav-item.active{border-left:none}
  .sidebar-foot{padding:12px 8px}
  .user-pill{padding:8px;justify-content:center}
  .back-btn{justify-content:center;padding:9px}
  .two-col{grid-template-columns:1fr}
  .page{padding:24px 20px}
  .bal-amt{font-size:34px}
  .kpi-strip{grid-template-columns:repeat(4,1fr);gap:10px}
  .g3{grid-template-columns:repeat(3,1fr)}
  .g2{grid-template-columns:1fr 1fr}
  .fr{grid-template-columns:1fr 1fr}
  .ph{margin-bottom:20px}
  .pt{font-size:22px}
  .finbot-bubble-bot,.finbot-bubble-user{font-size:13px}
}

/* ── MOBILE (≤640px) ── */
@media(max-width:640px){
  .app{flex-direction:column;height:100dvh;height:100vh;overflow:hidden}
  .sidebar-desktop{display:none!important}
  .mobile-topbar{
    display:flex;align-items:center;justify-content:space-between;
    position:sticky;top:0;z-index:90;
    height:56px;padding:0 16px;
    background:var(--surface);
    border-bottom:1px solid var(--border);
    backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  }
  .mobile-hamburger{
    display:flex;flex-direction:column;gap:5px;padding:6px;
    background:none;border:none;cursor:pointer;
  }
  .mobile-hamburger span{
    display:block;width:20px;height:2px;border-radius:2px;
    background:var(--text);transition:all .25s;
  }
  .mobile-topbar-logo{
    display:flex;align-items:baseline;gap:1px;
    font-size:20px;font-weight:700;letter-spacing:-.3px;
  }
  .mobile-topbar-ava{cursor:pointer}
  .drawer-backdrop{
    display:block;
    position:fixed;inset:0;z-index:200;
    background:rgba(0,0,0,0.55);
    backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);
    animation:fIn .22s ease;
  }
  .drawer-panel{
    display:flex;flex-direction:column;
    position:fixed;top:0;left:0;bottom:0;z-index:210;
    width:82%;max-width:310px;
    background:var(--surface2);
    border-right:1px solid var(--border2);
    box-shadow:8px 0 40px rgba(0,0,0,0.45);
    transform:translateX(-105%);
    transition:transform .32s cubic-bezier(.4,0,.2,1);
    overflow-y:auto;padding:20px 0 28px;
  }
  .drawer-panel.drawer-open{transform:translateX(0)}
  .drawer-close{
    position:absolute;top:16px;right:16px;
    width:34px;height:34px;border-radius:50%;
    background:var(--glass2);border:1px solid var(--border);
    display:flex;align-items:center;justify-content:center;
    cursor:pointer;color:var(--text2);transition:all .15s;
  }
  .drawer-close:hover{background:var(--accent-dim);color:var(--accent)}
  .drawer-profile{
    display:flex;align-items:center;gap:14px;
    padding:0 20px 20px;margin-top:4px;
  }
  .drawer-ava{
    width:52px;height:52px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,var(--grad1),var(--grad2));
    display:flex;align-items:center;justify-content:center;
    font-size:16px;font-weight:700;color:var(--bg);
    border:2px solid var(--border2);
  }
  .drawer-user-info{flex:1;min-width:0}
  .drawer-user-name{font-size:15px;font-weight:600;letter-spacing:-.2px;margin-bottom:2px;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .drawer-user-email{font-size:11.5px;color:var(--text3);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .drawer-divider{height:1px;background:var(--border);margin:0 20px 16px}
  .drawer-nav{flex:1;padding:0 12px}
  .drawer-nav-sec{
    font-size:9px;font-family:'DM Mono',monospace;color:var(--text3);
    padding:6px 8px 4px;letter-spacing:.14em;text-transform:uppercase;
  }
  .drawer-nav-item{
    display:flex;align-items:center;gap:14px;
    padding:12px 12px;border-radius:12px;
    cursor:pointer;transition:all .15s;
    margin:2px 0;position:relative;
    color:var(--text2);
  }
  .drawer-nav-item:hover{background:var(--glass2);color:var(--text)}
  .drawer-nav-item.active{background:var(--accent-dim);color:var(--accent)}
  .drawer-nav-icon{
    width:38px;height:38px;border-radius:10px;flex-shrink:0;
    background:var(--glass2);border:1px solid var(--border);
    display:flex;align-items:center;justify-content:center;
    transition:all .15s;
  }
  .drawer-nav-item.active .drawer-nav-icon{
    background:var(--accent);border-color:var(--accent);color:var(--bg);
  }
  .drawer-nav-item.active .drawer-nav-icon svg{stroke:var(--bg)}
  .drawer-nav-label{font-size:14px;font-weight:500;flex:1}
  .drawer-nav-item.active .drawer-nav-label{font-weight:600}
  .drawer-nav-dot{
    width:6px;height:6px;border-radius:50%;
    background:var(--accent);flex-shrink:0;
  }
  .drawer-footer{padding:16px 12px 0;border-top:1px solid var(--border);margin:12px 0 0}
  .drawer-back-btn{
    display:flex;align-items:center;gap:10px;
    width:100%;padding:11px 12px;border-radius:12px;
    background:var(--glass2);border:1px solid var(--border);
    font-size:13px;font-weight:500;color:var(--text2);
    cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;
  }
  .drawer-back-btn:hover{background:var(--glass);color:var(--text);border-color:var(--border2)}
  .main{flex:1;overflow-x:hidden;overflow-y:hidden;min-height:0;display:flex;flex-direction:column}
  .page{padding:16px 14px;max-width:100%;flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch}
  .pt{font-size:20px;letter-spacing:-.5px}
  .ps{font-size:11.5px}
  .bal-amt{font-size:32px;letter-spacing:-2px}
  .ph{margin-bottom:16px;flex-wrap:wrap;gap:10px}
  .two-col{grid-template-columns:1fr;gap:14px}
  .g2{grid-template-columns:1fr 1fr;gap:10px}
  .g3{grid-template-columns:1fr 1fr;gap:10px}
  .fr{grid-template-columns:1fr;gap:0}
  .card{padding:16px 16px;border-radius:14px}
  .hero-card{padding:20px 18px;border-radius:18px}
  .chart-card{padding:16px 14px}
  .action-grid{grid-template-columns:repeat(4,1fr);gap:8px}
  .act-btn{padding:10px 4px}
  .act-btn span{font-size:10px}
  .tabs-row{gap:2px}
  .tab-btn{padding:5px 8px;font-size:10.5px}
  .txn-name{font-size:12.5px}
  .txn-meta{font-size:9.5px}
  .txn-amt{font-size:12px}
  .txn-ico{width:36px;height:36px;font-size:15px}
  .tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch}
  .stat-tbl td,.stat-tbl th{padding:10px 10px;font-size:11.5px}
  .modal{width:calc(100vw - 28px);padding:22px 18px;border-radius:18px}
  .modal-ov{align-items:flex-end;padding-bottom:0}
  .modal{border-radius:20px 20px 0 0;max-height:92vh;overflow-y:auto}
  .toast{bottom:20px;right:12px;left:12px;font-size:12.5px}
  .finbot-bubble-bot,.finbot-bubble-user{max-width:90%;font-size:12.5px}
  .finbot-header-stats{display:none!important}
  .finbot-header-newchat span{display:none}
  .finbot-header-newchat{padding:7px 10px!important;min-width:36px;justify-content:center}
  .finbot-suggestions-wrap{padding:6px 12px 0!important}
  .finbot-suggestions{gap:6px!important;padding-bottom:8px!important}
  .finbot-sug-chip{padding:6px 11px!important;font-size:11px!important}
  .finbot-input-row{padding:8px 12px 12px!important}
  .finbot-msgs{padding:12px 14px!important}
  .finbot-sidebar-backdrop{display:block!important}
  .finbot-sidebar{position:fixed!important;top:0!important;left:0!important;bottom:0!important;z-index:60!important;width:82vw!important;max-width:300px!important;box-shadow:6px 0 40px rgba(0,0,0,0.4)!important;border-right:1px solid var(--border2)!important}
  .finbot-status-text{display:none}
  .finbot-status-mini{display:inline-flex!important;align-items:center;gap:4px}
  .kpi-strip{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
  .stat-card-kpi .stat-card-val{font-size:20px;letter-spacing:-1px}
  .stat-card-kpi .stat-card-lbl{font-size:8px}
  .stat-card-kpi .stat-card-sub{font-size:9.5px}
  .stat-card-kpi{padding:14px 14px}
  .stat-card-kpi .stat-card-top{margin-bottom:8px}
  .two-col{grid-template-columns:1fr}
  .dash-chart-card{padding:16px 14px}
  .dash-chart-header{flex-direction:column;align-items:flex-start;gap:10px}
  .tabs-row{width:100%}
  .tab-btn{flex:1;padding:5px 6px;font-size:10px}
  .stat-table-wrap{overflow-x:auto}
  .stat-table-head{padding:10px 12px;gap:3px}
  .stat-table-tab{padding:4px 10px;font-size:10.5px}
  .two-col .card{margin-bottom:12px}
  .dna-ring svg{width:110px!important;height:110px!important}
  .ph .btn{padding:7px 12px;font-size:11.5px}
  .sec-t{font-size:10.5px;flex-wrap:wrap;gap:4px}
  .sec-t span:last-child{font-size:10px;text-transform:none;letter-spacing:0;color:var(--text3);font-weight:400;white-space:normal}
}

/* ── SMALL MOBILE (≤380px) ── */
@media(max-width:380px){
  .page{padding:12px 10px}
  .bal-amt{font-size:28px}
  .g2{grid-template-columns:1fr}
  .g3{grid-template-columns:1fr}
  .card{padding:14px 12px}
}
`;

// ── SVG Icon Library ──────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {
  const s = { width: size, height: size, ...style };
  const icons = {
    food: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>),
    transport: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>),
    health: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>),
    shop: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>),
    entertain: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>),
    salary: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>),
    other: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>),
    arrowLeft: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>),
    arrowUpRight: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>),
    arrowDownLeft: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="7" x2="7" y2="17"/><polyline points="17 17 7 17 7 7"/></svg>),
    plus: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>),
    send: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>),
    minus: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>),
    download: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
    scan: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="3" y1="12" x2="21" y2="12"/></svg>),
    repeat: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>),
    bot: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.38-1 1.73V7h3a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-7a3 3 0 0 1 3-3h3V5.73A2 2 0 0 1 10 4a2 2 0 0 1 2-2z"/><circle cx="9" cy="13" r="1.2" fill={color} stroke="none"/><circle cx="15" cy="13" r="1.2" fill={color} stroke="none"/><path d="M9 17c.83.63 1.83 1 3 1s2.17-.37 3-1"/><line x1="5" y1="11" x2="3" y2="11"/><line x1="19" y1="11" x2="21" y2="11"/></svg>),
    checkCircle: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
    alertTriangle: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>),
    alertCircle: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>),
    close: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>),
    moon: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>),
    sun: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>),
    trending: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
    dna: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1-1"/><path d="m7 18 2.5 2.5"/><path d="m10 16 1 1"/></svg>),
    creditCard: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>),
    settings: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>),
    barChart: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>),
    list: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>),
    home: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>),
    star: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
    zap: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>),
    filePdf: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>),
    messageCircle: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>),
    edit: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>),
    // ── Emoji replacements ──
    target: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>),
    coin: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9.5 9.5c0-1.1.9-2 2.5-2s2.5.9 2.5 2-1.5 2-2.5 2-2.5.9-2.5 2 .9 2 2.5 2 2.5-.9 2.5-2"/></svg>),
    clipboard: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>),
    flame: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>),
    trophy: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="11"/><path d="M7 4H2v6a5 5 0 0 0 5 5h10a5 5 0 0 0 5-5V4h-5"/><rect x="7" y="2" width="10" height="4" rx="1"/></svg>),
    diamond: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0z"/></svg>),
    trendingUp: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
    sadFace: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>),
    moneyBag: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c1.5 0 3 .5 3 2s-3 2-3 2-3 0-3-2 1.5-2 3-2z"/><path d="M6 8c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2c0 6-3 10-6 10S6 14 6 8z"/><path d="M12 12v2m0-6v2"/></svg>),
    pin: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>),
    lightbulb: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><line x1="9" y1="18" x2="15" y2="18"/><line x1="10" y1="22" x2="14" y2="22"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>),
    piggyBank: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8.5 3.2 1.8 4.2a2 2 0 0 1 .7 1.8v2a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h4v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-2.1a2 2 0 0 1 .7-1.7C20.5 15.2 21 13.8 21 12c0-2.5-1.3-4-2-4.5V5z"/><path d="M11 11h.01"/><path d="M19 5a2 2 0 0 0-2-2 2 2 0 0 0 2 2z"/></svg>),
    noEntry: (<svg {...s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>),
  };
  return icons[name] || icons.other;
};

const CatIcon = ({ id, size = 18, color = "currentColor" }) => (
  <Icon name={id} size={size} color={color} />
);

const CATS = [
  {id:"food",      name:"Makanan",      color:"#FF7043", cls:"cat-food"},
  {id:"transport", name:"Transportasi", color:"#60A5FA", cls:"cat-transport"},
  {id:"health",    name:"Kesehatan",    color:"#4ADE80", cls:"cat-health"},
  {id:"shop",      name:"Belanja",      color:"#C084FC", cls:"cat-shop"},
  {id:"entertain", name:"Hiburan",      color:"#FBBF24", cls:"cat-entertain"},
  {id:"salary",    name:"Gaji",         color:"#4ADE80", cls:"cat-salary"},
  {id:"other",     name:"Lainnya",      color:"#888888", cls:"cat-other"},
];
const CM = Object.fromEntries(CATS.map(c=>[c.id,c]));

const DAYS   = ["Sen","Sel","Rab","Kam","Jum","Sab","Min"];
const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];

const fmt  = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:0}).format(n);
const fmtK = n => n>=1e6?`Rp ${(n/1e6).toFixed(1)}jt`:n>=1e3?`Rp ${(n/1e3).toFixed(0)}rb`:`Rp ${n}`;
const initials = (name="") => name.trim().split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase() || "?";

const normalizeTxn = (t) => ({
  id:     t.id,
  date:   t.date ? t.date.slice(0,10) : "",
  time:   t.date ? t.date.slice(11,16) : "00:00",
  desc:   t.description || "",
  cat:    t.category_slug || t.category_id || "other",
  type:   t.type,
  amount: t.amount,
  imp:    t.is_impulsive || false,
});

const currentMonth = () => new Date().toISOString().slice(0,7);

function parseLocalDate(dateStr) {
  if(!dateStr) return new Date(NaN);
  const [y,m,d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function getMondayOfWeek() {
  const today = new Date();
  const base  = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const dow   = base.getDay();
  const diff  = (dow === 0) ? -6 : (1 - dow);
  const mon   = new Date(base);
  mon.setDate(base.getDate() + diff);
  return mon;
}

function localMondayIndex(d) {
  const dow = d.getDay();
  return dow === 0 ? 6 : dow - 1;
}

function buildWeeklyData(txns) {
  const monday = getMondayOfWeek();
  const result = Array(7).fill(0);
  txns.filter(t=>t.type==="expense").forEach(t=>{
    const d       = parseLocalDate(t.date);
    const diffDay = Math.round((d - monday) / 86400000);
    if(diffDay >= 0 && diffDay < 7) result[diffDay] += t.amount;
  });
  return result;
}

function buildWeeklyIncomeData(txns) {
  const monday = getMondayOfWeek();
  const result = Array(7).fill(0);
  txns.filter(t=>t.type==="income").forEach(t=>{
    const d       = parseLocalDate(t.date);
    const diffDay = Math.round((d - monday) / 86400000);
    if(diffDay >= 0 && diffDay < 7) result[diffDay] += t.amount;
  });
  return result;
}

function buildMonthlyData(txns) {
  const year   = new Date().getFullYear();
  const result = Array(12).fill(0);
  txns.filter(t=>t.type==="expense").forEach(t=>{
    const d = parseLocalDate(t.date);
    if(d.getFullYear() === year) result[d.getMonth()] += t.amount;
  });
  return result;
}

function buildMonthlyIncomeData(txns) {
  const year   = new Date().getFullYear();
  const result = Array(12).fill(0);
  txns.filter(t=>t.type==="income").forEach(t=>{
    const d = parseLocalDate(t.date);
    if(d.getFullYear() === year) result[d.getMonth()] += t.amount;
  });
  return result;
}

function buildYearlyData(txns) {
  const nowYear = new Date().getFullYear();
  const result  = Array(5).fill(0);
  txns.filter(t=>t.type==="expense").forEach(t=>{
    const diff = nowYear - parseLocalDate(t.date).getFullYear();
    if(diff >= 0 && diff < 5) result[4 - diff] += t.amount;
  });
  return result;
}

const YEARS = (()=>{const y=new Date().getFullYear();return Array(5).fill(0).map((_,i)=>String(y-4+i));})();

// ── Badge SVG Icon wrapper (replaces emoji in badge-item) ─────────────────────
const BadgeIcon = ({ name, size = 20, color = "currentColor" }) => (
  <div style={{
    width: 36, height: 36, borderRadius: 10,
    background: "var(--glass2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  }}>
    <Icon name={name} size={size} color={color} />
  </div>
);

// ── PDF Export ────────────────────────────────────────────────────────────────
function exportToPDF(txns, user, prediction) {
  const month = new Date().toLocaleDateString("id-ID",{month:"long",year:"numeric"});
  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance = income - expense;
  const imps    = txns.filter(t=>t.imp);

  const bycat = CATS.map(c=>({
    ...c,
    total: txns.filter(t=>t.type==="expense"&&t.cat===c.id).reduce((s,t)=>s+t.amount,0)
  })).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);

  const rows = [...txns]
    .sort((a,b)=>new Date(b.date)-new Date(a.date))
    .map(t=>`
      <tr style="border-bottom:1px solid #eee">
        <td style="padding:7px 10px;font-size:12px;color:#555">${t.date} ${t.time}</td>
        <td style="padding:7px 10px;font-size:12px">${t.desc}${t.imp?' <span style="background:#fee2e2;color:#dc2626;font-size:10px;padding:1px 5px;border-radius:3px">impulsif</span>':''}</td>
        <td style="padding:7px 10px;font-size:12px;color:#555">${CM[t.cat]?.name||t.cat}</td>
        <td style="padding:7px 10px;font-size:12px;text-align:right;color:${t.type==="income"?"#16a34a":"#111"};font-weight:600">${t.type==="income"?"+":"-"}${fmt(t.amount)}</td>
      </tr>
    `).join("");

  const catRows = bycat.map(c=>`
    <tr style="border-bottom:1px solid #f0f0f0">
      <td style="padding:6px 10px;font-size:12px">${c.name}</td>
      <td style="padding:6px 10px;font-size:12px;text-align:right;font-weight:600">${fmt(c.total)}</td>
      <td style="padding:6px 10px;font-size:12px;text-align:right;color:#888">${expense>0?Math.round(c.total/expense*100):0}%</td>
    </tr>
  `).join("");

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>NaviKas Report - ${month}</title>
<style>
  * { box-sizing:border-box; margin:0; padding:0 }
  body { font-family:'Segoe UI',Arial,sans-serif; color:#111; background:#fff; padding:40px }
  h1 { font-size:28px; font-weight:700; letter-spacing:-1px }
  h2 { font-size:14px; font-weight:600; color:#555; margin-bottom:16px; text-transform:uppercase; letter-spacing:.06em; border-bottom:1px solid #eee; padding-bottom:8px }
  .header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:32px; padding-bottom:20px; border-bottom:2px solid #111 }
  .meta { font-size:13px; color:#888 }
  .summary { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:32px }
  .sum-card { border:1px solid #eee; border-radius:10px; padding:16px }
  .sum-lbl { font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:#888; margin-bottom:6px }
  .sum-val { font-size:22px; font-weight:700; letter-spacing:-1px }
  table { width:100%; border-collapse:collapse }
  th { font-size:10px; text-transform:uppercase; letter-spacing:.1em; color:#888; padding:0 10px 10px; text-align:left; border-bottom:2px solid #eee }
  .section { margin-bottom:32px }
  .dna-box { border:1px solid #eee; border-radius:10px; padding:20px; display:flex; gap:20px; align-items:center; margin-bottom:32px }
  .dna-score { font-size:48px; font-weight:700; letter-spacing:-2px; min-width:70px; text-align:center }
  .dna-type { font-size:18px; font-weight:600; margin-bottom:4px }
  .dna-desc { font-size:13px; color:#555; line-height:1.6 }
  .footer { margin-top:40px; padding-top:16px; border-top:1px solid #eee; font-size:11px; color:#aaa; text-align:center }
  @media print { body { padding:20px } }
</style>
</head>
<body>
  <div class="header">
    <div>
      <h1>NaviKas</h1>
      <div class="meta">Laporan Keuangan · ${month}</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:13px;font-weight:600">${user?.name||"Pengguna"}</div>
      <div class="meta">${user?.email||""}</div>
      <div class="meta">Dicetak: ${new Date().toLocaleDateString("id-ID",{day:"numeric",month:"long",year:"numeric"})}</div>
    </div>
  </div>

  <div class="summary">
    <div class="sum-card">
      <div class="sum-lbl">Pemasukan</div>
      <div class="sum-val" style="color:#16a34a">${fmt(income)}</div>
    </div>
    <div class="sum-card">
      <div class="sum-lbl">Pengeluaran</div>
      <div class="sum-val">${fmt(expense)}</div>
    </div>
    <div class="sum-card">
      <div class="sum-lbl">Saldo Bersih</div>
      <div class="sum-val" style="color:${balance>=0?"#16a34a":"#dc2626"}">${fmt(balance)}</div>
    </div>
  </div>

  ${prediction?.dna ? `
  <div class="dna-box">
    <div class="dna-score">${prediction.dna.total_score||72}</div>
    <div>
      <div class="dna-type">${prediction.dna.type_label||"Balanced Planner"}</div>
      <div class="dna-desc">${prediction.dna.type_desc||""}</div>
      <div style="margin-top:8px;font-size:12px;color:#888">${imps.length} transaksi impulsif · Rp ${imps.reduce((s,t)=>s+t.amount,0).toLocaleString("id-ID")} dapat dihemat</div>
    </div>
  </div>` : ""}

  <div class="section">
    <h2>Pengeluaran per Kategori</h2>
    <table>
      <thead><tr><th>Kategori</th><th style="text-align:right">Total</th><th style="text-align:right">%</th></tr></thead>
      <tbody>${catRows}</tbody>
    </table>
  </div>

  <div class="section">
    <h2>Riwayat Transaksi (${txns.length} transaksi)</h2>
    <table>
      <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th style="text-align:right">Jumlah</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>

  <div class="footer">NaviKas · Capstone 2026 · Laporan ini dibuat otomatis oleh sistem</div>
</body>
</html>`;

  const blob = new Blob([html], {type:"text/html"});
  const url  = URL.createObjectURL(blob);
  const win  = window.open(url,"_blank");
  if(win) {
    win.onload = () => {
      win.focus();
      win.print();
    };
  }
}

function Toast({msg,type,onDone}){
  useEffect(()=>{const t=setTimeout(onDone,2800);return()=>clearTimeout(t)},[]);
  const c = type==="success"?"var(--green)":type==="error"?"var(--red)":"var(--amber)";
  return (
    <div className="toast">
      <Icon name={type==="success"?"checkCircle":"alertTriangle"} size={16} color={c}/>
      {msg}
    </div>
  );
}

function AddModal({onClose,onAdd,loading,defaultType="expense"}){
  const [f,setF]=useState({desc:"",amount:"",cat:"food",type:defaultType,date:new Date().toISOString().slice(0,10)});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const submit=()=>{if(!f.desc||!f.amount)return;onAdd(f);};
  return(
    <div className="modal-ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="m-title">Tambah Transaksi</div>
        <div className="m-sub">Catat pemasukan atau pengeluaran baru</div>
        <div className="pills" style={{marginBottom:18}}>
          {[["expense","Pengeluaran"],["income","Pemasukan"]].map(([v,l])=>(
            <button key={v} className={`ptab${f.type===v?" active":""}`} onClick={()=>s("type",v)}>{l}</button>
          ))}
        </div>
        <div className="fg"><label className="fl">Deskripsi</label>
          <input className="fi" placeholder="mis. Kopi & roti bakar" value={f.desc} onChange={e=>s("desc",e.target.value)}/>
        </div>
        <div className="fr">
          <div className="fg"><label className="fl">Jumlah (Rp)</label>
            <input className="fi" type="number" placeholder="0" value={f.amount} onChange={e=>s("amount",e.target.value)}/>
          </div>
          <div className="fg"><label className="fl">Tanggal</label>
            <input className="fi" type="date" value={f.date} onChange={e=>s("date",e.target.value)}/>
          </div>
        </div>
        <div className="fg"><label className="fl">Kategori</label>
          <select className="fi fs" value={f.cat} onChange={e=>s("cat",e.target.value)}>
            {CATS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="m-foot">
          <button className="btn btn-g" onClick={onClose}>Batal</button>
          <button className="btn btn-p" onClick={submit} disabled={loading}>
            {loading?<><span className="loading-spin"/>Menyimpan...</>:"Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}

const NAV = [
  {id:"dashboard", label:"Dashboard",     icon:"home"},
  {id:"txn",       label:"Transaksi",     icon:"list"},
  {id:"analytics", label:"Statistik",     icon:"barChart"},
  {id:"dna",       label:"Financial DNA", icon:"dna"},
  {id:"finbot",    label:"NaviBot AI",     icon:"messageCircle"},

  {id:"settings",  label:"Pengaturan",    icon:"settings"},
];

function Sidebar({page,setPage,onBackToLanding,user}){
  const displayName  = user?.name  || "Pengguna";
  const displayEmail = user?.email || "Free plan";
  const ava          = initials(displayName);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleNav = (id) => {
    setPage(id);
    setDrawerOpen(false);
  };

  return(
    <>
      <aside className="sidebar sidebar-desktop">
        <div className="logo">
          <div className="logo-wordmark">
            <span className="logo-f">Navi</span>
            <span className="logo-track">Kas</span>
          </div>
          <div className="logo-sub"></div>
        </div>
        <div className="nav-sec">Menu</div>
        {NAV.slice(0,5).map(n=>(
          <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
            <Icon name={n.icon} size={15} color="currentColor"/>
            <span>{n.label}</span>
          </div>
        ))}
        <div className="nav-sec">Akun</div>
        {NAV.slice(5).map(n=>(
          <div key={n.id} className={`nav-item${page===n.id?" active":""}`} onClick={()=>setPage(n.id)}>
            <Icon name={n.icon} size={15} color="currentColor"/>
            <span>{n.label}</span>
          </div>
        ))}
        <div className="sidebar-foot">
          <div className="user-pill">
            <div className="ava">{ava}</div>
            <div>
              <div className="u-name">{displayName}</div>
              <div className="u-plan">{displayEmail}</div>
            </div>
          </div>
          <button className="back-btn" onClick={onBackToLanding}>
            <Icon name="arrowLeft" size={14} color="currentColor"/>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </aside>

      <header className="mobile-topbar">
        <button className="mobile-hamburger" onClick={()=>setDrawerOpen(true)} aria-label="Buka menu">
          <span/><span/><span/>
        </button>
        <div className="mobile-topbar-logo">
          <span className="logo-f">Navi</span><span className="logo-track">Kas</span>
        </div>
        <div className="mobile-topbar-ava" onClick={()=>setDrawerOpen(true)}>
          <div className="ava" style={{width:32,height:32,fontSize:11}}>{ava}</div>
        </div>
      </header>

      {drawerOpen && (
        <div className="drawer-backdrop" onClick={()=>setDrawerOpen(false)}/>
      )}

      <div className={`drawer-panel${drawerOpen?" drawer-open":""}`}>
        <button className="drawer-close" onClick={()=>setDrawerOpen(false)} aria-label="Tutup">
          <Icon name="close" size={18} color="currentColor"/>
        </button>

        <div className="drawer-profile">
          <div className="drawer-ava">{ava}</div>
          <div className="drawer-user-info">
            <div className="drawer-user-name">{displayName}</div>
            <div className="drawer-user-email">{displayEmail}</div>
          </div>
        </div>

        <div className="drawer-divider"/>

        <nav className="drawer-nav">
          <div className="drawer-nav-sec">Menu</div>
          {NAV.slice(0,5).map(n=>(
            <div key={n.id} className={`drawer-nav-item${page===n.id?" active":""}`} onClick={()=>handleNav(n.id)}>
              <div className="drawer-nav-icon">
                <Icon name={n.icon} size={18} color="currentColor"/>
              </div>
              <span className="drawer-nav-label">{n.label}</span>
              {page===n.id && <div className="drawer-nav-dot"/>}
            </div>
          ))}

          <div className="drawer-nav-sec" style={{marginTop:8}}>Akun</div>
          {NAV.slice(5).map(n=>(
            <div key={n.id} className={`drawer-nav-item${page===n.id?" active":""}`} onClick={()=>handleNav(n.id)}>
              <div className="drawer-nav-icon">
                <Icon name={n.icon} size={18} color="currentColor"/>
              </div>
              <span className="drawer-nav-label">{n.label}</span>
              {page===n.id && <div className="drawer-nav-dot"/>}
            </div>
          ))}
        </nav>

        <div className="drawer-footer">
          <button className="drawer-back-btn" onClick={()=>{setDrawerOpen(false);onBackToLanding();}}>
            <Icon name="arrowLeft" size={15} color="currentColor"/>
            <span>Kembali ke Beranda</span>
          </button>
        </div>
      </div>
    </>
  );
}

function BarChart({data, labels, activeIdx, onBarClick, tab="weekly"}){
  const [hovered, setHovered] = useState(null);
  const uid = useRef(`dbc-${Math.random().toString(36).slice(2,6)}`).current;
  const W=500, H=140, padL=44, padR=12, padTop=24, padBot=28;
  const plotW = W-padL-padR;
  const plotH = H-padTop-padBot;
  const n = data.length;
  const maxV = Math.max(...data, 1);

  const gap = tab==="monthly" ? 3 : tab==="yearly" ? 12 : 5;
  const barW = (plotW - gap*(n-1)) / n;

  const xOf = (i) => padL + i*(barW+gap);
  const barH = (v) => Math.max(v>0 ? (v/maxV)*plotH : 0, v>0?4:0);
  const yOf  = (v) => padTop + plotH - barH(v);

  const gridVals = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",overflow:"visible",cursor:"pointer"}}>
      <defs>
        <linearGradient id={`bg-act-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--grad1)" stopOpacity="1"/>
          <stop offset="100%" stopColor="var(--grad2)" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id={`bg-dim-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--border2)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--border)" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id={`bg-hov-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.12"/>
        </linearGradient>
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {gridVals.map((v,gi)=>{
        const gy = padTop + plotH*(1-v);
        return (
          <g key={gi}>
            <line x1={padL} y1={gy} x2={W-padR} y2={gy}
              stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3,5" opacity={0.7}/>
            <text x={padL-5} y={gy+3.5} fontSize="7.5" fill="var(--text3)"
              textAnchor="end" fontFamily="'DM Mono',monospace">{fmtK(Math.round(maxV*v))}</text>
          </g>
        );
      })}

      <line x1={padL} y1={padTop+plotH} x2={W-padR} y2={padTop+plotH}
        stroke="var(--border2)" strokeWidth={1}/>

      {data.map((v,i)=>{
        const bx = xOf(i);
        const bh = barH(v);
        const by = yOf(v);
        const isActive = i===activeIdx;
        const isHov = i===hovered;
        const fillId = isActive ? `url(#bg-act-${uid})` : isHov ? `url(#bg-hov-${uid})` : `url(#bg-dim-${uid})`;
        const r = Math.min(5, barW/2);

        return (
          <g key={i}
            onClick={()=>onBarClick(i)}
            onMouseEnter={()=>setHovered(i)}
            onMouseLeave={()=>setHovered(null)}
            style={{cursor:"pointer"}}>

            <rect x={bx} y={padTop} width={barW} height={plotH}
              rx={r} fill="var(--glass)" opacity={0.4}/>

            {bh>0&&(
              <rect x={bx} y={by} width={barW} height={bh}
                rx={r}
                fill={fillId}
                filter={isActive?`url(#glow-${uid})`:"none"}
                style={{animation:`barIn .42s cubic-bezier(.4,0,.2,1) ${i*28}ms both`,transformOrigin:`${bx+barW/2}px ${padTop+plotH}px`}}
              />
            )}

            {isActive&&bh>0&&(
              <rect x={bx} y={by} width={barW} height={Math.min(bh,20)}
                rx={r} fill="rgba(255,255,255,0.14)"
                style={{animation:`barIn .42s cubic-bezier(.4,0,.2,1) ${i*28}ms both`,transformOrigin:`${bx+barW/2}px ${padTop+plotH}px`}}
              />
            )}

            {(isActive||isHov)&&v>0&&(()=>{
              const tx = bx+barW/2;
              const ty = by-8;
              const tw = tab==="monthly"?38:44;
              const th = 16;
              const label = fmtK(v);
              return (
                <g style={{animation:"fadeUp .15s ease both"}}>
                  <rect x={tx-tw/2} y={ty-th} width={tw} height={th}
                    rx={4} fill="var(--accent)" opacity={0.95}/>
                  <text x={tx} y={ty-th/2+3.5} textAnchor="middle"
                    fontSize="8" fontFamily="'DM Mono',monospace"
                    fill="var(--bg)" fontWeight="600">{label}</text>
                  <polygon points={`${tx-4},${ty} ${tx+4},${ty} ${tx},${ty+5}`}
                    fill="var(--accent)" opacity={0.95}/>
                </g>
              );
            })()}

            <text
              x={bx+barW/2} y={padTop+plotH+16}
              textAnchor="middle" fontSize="8"
              fill={isActive?"var(--accent)":"var(--text3)"}
              fontFamily="'DM Mono',monospace"
              fontWeight={isActive?"600":"400"}>
              {labels[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Dashboard({txns,setPage,toast,user,prediction,loadingPred,onAdd}){
  const now          = new Date();
  const todayWeekIdx = localMondayIndex(now);

  const [ct,setCt]=useState("weekly");
  const [ab,setAb]=useState(todayWeekIdx);

  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const bal     = income-expense;
  const imps    = txns.filter(t=>t.imp);
  const recent  = [...txns].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);

  const weeklyData   = buildWeeklyData(txns);
  const weeklyIncome = buildWeeklyIncomeData(txns);
  const monthlyData  = buildMonthlyData(txns);
  const monthlyInc   = buildMonthlyIncomeData(txns);
  const yearlyData   = buildYearlyData(txns);
  const cd   = ct==="weekly"?weeklyData:ct==="monthly"?monthlyData:yearlyData;
  const lbs  = ct==="weekly"?DAYS:ct==="monthly"?MONTHS:YEARS;
  const safeAb = Math.min(ab, cd.length-1);

  const firstName=(user?.name||"Pengguna").split(" ")[0];
  const bycat=CATS.map(c=>({...c,total:txns.filter(t=>t.type==="expense"&&t.cat===c.id).reduce((s,t)=>s+t.amount,0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total).slice(0,5);
  const totalE=txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);

  const predBal   = prediction?.predicted_balance;
  const riskLevel = prediction?.risk_level||"low";
  const riskLabel = riskLevel==="high"?"Risiko Tinggi":riskLevel==="medium"?"Risiko Sedang":"Risiko Rendah";
  const riskBadge = riskLevel==="high"?"br":riskLevel==="medium"?"ba":"bg";

  const [quickModal, setQuickModal] = useState(null);

  const actionBtns=[
    {label:"Pemasukan",   icon:"plus",          action:()=>setQuickModal("income")},
    {label:"Pengeluaran", icon:"minus",          action:()=>setQuickModal("expense")},
    {label:"Statistik",   icon:"barChart",       action:()=>setPage("analytics")},
    {label:"NaviBot",     icon:"messageCircle",  action:()=>setPage("finbot")},
  ];

  return(
    <div className="page fi-a">
      {quickModal && (
        <AddModal
          onClose={()=>setQuickModal(null)}
          onAdd={async(d)=>{await onAdd(d);setQuickModal(null);}}
          loading={false}
          defaultType={quickModal}
        />
      )}
      <div className="ph">
        <div>
          <div className="pt">Selamat pagi, {firstName}</div>
          <div className="ps">{now.toLocaleDateString("id-ID",{month:"long",year:"numeric"})} · Ringkasan keuangan</div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {imps.length>0&&<span className="badge br"><Icon name="alertCircle" size={10} color="currentColor"/>{imps.length} impulsif</span>}
        </div>
      </div>
      <div className="two-col">
        <div>
          <div className="hero-card" style={{marginBottom:18}}>
            <div className="bal-lbl">Total Saldo</div>
            <div className="bal-amt">{fmt(bal)}</div>
            <span className="bal-chg"><Icon name="trending" size={11} color="currentColor"/>Bulan ini</span>
            <div className="action-grid">
              {actionBtns.map(({label,icon,action})=>(
                <div key={label} className="act-btn" onClick={action}>
                  <Icon name={icon} size={18} color="currentColor"/>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card card-glow" style={{marginBottom:18}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <div>
                <div style={{fontWeight:700,fontSize:22,letterSpacing:"-1px"}}>{fmtK(cd[safeAb]||0)}</div>
                <div style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginTop:2}}>
                  {lbs[safeAb]} · {ct==="weekly"?"Minggu ini":ct==="monthly"?"Tahun ini":"5 Tahun"}
                </div>
              </div>
              <div className="tabs-row">
                {[["weekly","Mingguan"],["monthly","Bulanan"],["yearly","Tahunan"]].map(([v,l])=>(
                  <button key={v} className={`tab-btn${ct===v?" active":""}`}
                    onClick={()=>{setCt(v);setAb(v==="weekly"?todayWeekIdx:v==="monthly"?now.getMonth():4);}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <BarChart data={cd} labels={lbs} activeIdx={safeAb} onBarClick={setAb} tab={ct}/>
          </div>

          <div className="card">
            <div className="sec-t">
              <span>Transaksi Terbaru</span>
              <span style={{color:"var(--text2)",fontSize:11,cursor:"pointer",textTransform:"none",letterSpacing:0,fontWeight:500}} onClick={()=>setPage("txn")}>Lihat Semua →</span>
            </div>
            {recent.length===0?(
              <div style={{textAlign:"center",padding:"30px",color:"var(--text3)",fontSize:12}}>Belum ada transaksi</div>
            ):recent.map(t=>{
              const cat=CM[t.cat]||CM.other;
              return(
                <div className="txn-item" key={t.id}>
                  <div className="txn-ico"><CatIcon id={cat.id} size={18} color={cat.color}/></div>
                  <div style={{flex:1}}>
                    <div className="txn-name">{t.desc}{t.imp&&<span className="imp-tag">impulsif</span>}</div>
                    <div className="txn-meta">{t.date} · {t.time}</div>
                  </div>
                  <div>
                    <div className="txn-amt" style={{color:t.type==="income"?"var(--green)":"var(--text)"}}>{t.type==="income"?"+":"-"}{fmtK(t.amount)}</div>
                    <div className="txn-sub">{cat.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="g2" style={{marginBottom:14}}>
            {[
              {lbl:"Pemasukan",val:fmt(income),c:"var(--green)",icon:"arrowUpRight"},
              {lbl:"Pengeluaran",val:fmt(expense),c:"var(--red)",icon:"arrowDownLeft"},
            ].map((s,i)=>(
              <div className="card" key={i} style={{padding:"16px 18px"}}>
                <div style={{width:32,height:32,borderRadius:9,background:`${s.c}18`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:10}}>
                  <Icon name={s.icon} size={15} color={s.c}/>
                </div>
                <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"var(--text3)",letterSpacing:".1em",marginBottom:5,textTransform:"uppercase"}}>{s.lbl}</div>
                <div style={{fontSize:15,fontWeight:700,letterSpacing:"-.3px",color:s.c}}>{s.val}</div>
              </div>
            ))}
          </div>
          <div className="card card-glow" style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:9,color:"var(--text)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".1em"}}>Prediksi Akhir Bulan</div>
              {loadingPred?<span className="loading-spin"/>:<span className={`badge ${riskBadge}`}>{riskLabel}</span>}
            </div>
            {predBal!=null?(
              <>
                <div style={{fontSize:30,fontWeight:700,letterSpacing:"-2px",marginBottom:8,color:"var(--text)"}}>{fmtK(predBal)}</div>
                <div style={{fontSize:12.5,color:"var(--text2)",lineHeight:1.7}}>
                  Jika pola belanja berlanjut, saldo diperkirakan <strong style={{color:"var(--text)"}}>{fmt(predBal)}</strong> di akhir bulan.
                </div>
              </>
            ):(
              <div style={{fontSize:13,color:"var(--text3)"}}>Tambahkan transaksi untuk melihat prediksi.</div>
            )}
          </div>
          <div className="card" style={{marginBottom:14}}>
            <div className="sec-t"><span>Per Kategori</span></div>
            {bycat.length===0?(
              <div style={{fontSize:12,color:"var(--text3)",textAlign:"center",padding:"16px 0"}}>Belum ada pengeluaran</div>
            ):bycat.map(r=>{
              const cat=CM[r.id]||CM.other;
              const pct=totalE>0?Math.round(r.total/totalE*100):0;
              return(
                <div key={r.id} style={{marginBottom:13}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12.5}}>
                    <span style={{display:"flex",alignItems:"center",gap:7}}><span className={`dot ${cat.cls}`}/>{cat.name}</span>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:"var(--text2)"}}>{fmtK(r.total)}</span>
                  </div>
                  <div className="prog-t"><div className="prog-f" style={{width:`${pct}%`,background:cat.color}}/></div>
                </div>
              );
            })}
          </div>
          <div className="card" style={{cursor:"pointer"}} onClick={()=>setPage("dna")}>
            <div className="sec-t">
              <span>Financial DNA</span>
              <span style={{color:"var(--text2)",fontSize:11,cursor:"pointer",textTransform:"none",letterSpacing:0,fontWeight:500}}>Detail →</span>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              {(()=>{
                const dnaScore = prediction?.dna?.total_score||72;
                const dnaColor = dnaScore>=70?"var(--green)":dnaScore>=45?"var(--amber)":"var(--red)";
                const r=28, circ=2*Math.PI*r, filled=circ*dnaScore/100;
                return(
                  <div className="dna-ring">
                    <svg width="72" height="72" viewBox="0 0 72 72" style={{transform:"rotate(-90deg)"}}>
                      <circle cx="36" cy="36" r={r} fill="none" stroke="var(--glass2)" strokeWidth="5"/>
                      <circle cx="36" cy="36" r={r} fill="none" stroke={dnaColor} strokeWidth="5"
                        strokeDasharray={`${filled} ${circ-filled}`} strokeLinecap="round"
                        style={{transition:"stroke-dasharray .8s ease"}}/>
                    </svg>
                    <div className="dna-rl">
                      <div style={{fontWeight:700,fontSize:16,lineHeight:1,color:dnaColor}}>{dnaScore}</div>
                      <div style={{fontSize:8,color:"var(--text3)"}}>/ 100</div>
                    </div>
                  </div>
                );
              })()}
              <div>
                <div style={{fontSize:13.5,fontWeight:600,marginBottom:3}}>{prediction?.dna?.type_label||"Impulsive Optimizer"}</div>
                <div style={{fontSize:12,color:"var(--text2)",lineHeight:1.6}}>{prediction?.dna?.type_desc||"Konsisten budget, rentan impulsif malam hari."}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Transactions({txns,onAdd,onDelete,onEdit,toast,setShowAdd,loading}){
  const [f,setF]=useState("all");
  const [q,setQ]=useState("");
  const [editTxn,setEditTxn]=useState(null);
  const rows=txns.filter(t=>{
    if(f==="income"&&t.type!=="income")return false;
    if(f==="expense"&&t.type!=="expense")return false;
    if(f==="impulsive"&&!t.imp)return false;
    if(q&&!t.desc.toLowerCase().includes(q.toLowerCase()))return false;
    return true;
  });
  return(
    <div className="page fi-a">
      <div className="ph">
        <div><div className="pt">Transaksi</div><div className="ps">{txns.length} transaksi · bulan ini</div></div>
        <button className="btn btn-p" onClick={()=>setShowAdd(true)}>
          <Icon name="plus" size={14} color="currentColor"/>Tambah
        </button>
      </div>
      <div className="pills">
        {[["all","Semua"],["income","Pemasukan"],["expense","Pengeluaran"],["impulsive","Impulsif"]].map(([v,l])=>(
          <button key={v} className={`ptab${f===v?" active":""}`} onClick={()=>setF(v)}>{l}</button>
        ))}
      </div>
      <div style={{marginBottom:16}}>
        <input className="fi" placeholder="Cari transaksi..." value={q} onChange={e=>setQ(e.target.value)}/>
      </div>
      <div className="card">
        {loading?<div style={{textAlign:"center",padding:"40px"}}><span className="loading-spin"/></div>:(
          <div className="tbl-wrap">
            <table>
              <thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th>Jenis</th><th style={{textAlign:"right"}}>Jumlah</th><th style={{textAlign:"center"}}>Aksi</th></tr></thead>
              <tbody>
                {rows.length===0?(<tr><td colSpan={6} style={{textAlign:"center",padding:"40px",color:"var(--text3)"}}>Tidak ada transaksi</td></tr>):
                rows.map(t=>{
                  const cat=CM[t.cat]||CM.other;
                  return(
                    <tr key={t.id}>
                      <td style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:"var(--text3)"}}>{t.date}<br/><span>{t.time}</span></td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <CatIcon id={cat.id} size={15} color={cat.color}/>
                          <span>{t.desc}</span>
                          {t.imp&&<span className="imp-tag">impulsif</span>}
                        </div>
                      </td>
                      <td><span style={{display:"flex",alignItems:"center",gap:5}}><span className={`dot ${cat.cls}`}/>{cat.name}</span></td>
                      <td><span className={`badge ${t.type==="income"?"bg":"bb"}`}>{t.type==="income"?"Masuk":"Keluar"}</span></td>
                      <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:12,color:t.type==="income"?"var(--green)":"var(--text)"}}>{t.type==="income"?"+":"-"}{fmt(t.amount)}</td>
                      <td>
                        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
                          <button
                            title="Edit transaksi"
                            style={{background:"transparent",border:"1px solid var(--border)",borderRadius:7,color:"var(--text2)",cursor:"pointer",padding:"4px 8px",display:"flex",alignItems:"center",transition:"all .15s"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--border2)";e.currentTarget.style.color="var(--accent)"}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text2)"}}
                            onClick={()=>setEditTxn(t)}>
                            <Icon name="edit" size={13} color="currentColor"/>
                          </button>
                          <button
                            title="Hapus transaksi"
                            style={{background:"transparent",border:"1px solid var(--border)",borderRadius:7,color:"var(--text3)",cursor:"pointer",padding:"4px 8px",display:"flex",alignItems:"center",transition:"all .15s"}}
                            onMouseEnter={e=>{e.currentTarget.style.borderColor="var(--red)";e.currentTarget.style.color="var(--red)"}}
                            onMouseLeave={e=>{e.currentTarget.style.borderColor="var(--border)";e.currentTarget.style.color="var(--text3)"}}
                            onClick={()=>onDelete(t.id)}>
                            <Icon name="close" size={13} color="currentColor"/>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {editTxn&&<EditModal txn={editTxn} onClose={()=>setEditTxn(null)} onSave={async(updated)=>{await onEdit(editTxn.id,updated);setEditTxn(null);}} toast={toast}/>}
    </div>
  );
}

function EditModal({txn,onClose,onSave,toast}){
  const today=new Date().toISOString().slice(0,10);
  const [form,setForm]=useState({
    amount:String(txn.amount),
    type:txn.type,
    desc:txn.desc,
    cat:txn.cat||"other",
    date:txn.date||today,
  });
  const [loading,setLoading]=useState(false);
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=async()=>{
    if(!form.amount||isNaN(parseFloat(form.amount))||parseFloat(form.amount)<=0){toast("Jumlah tidak valid","error");return;}
    if(!form.desc.trim()){toast("Deskripsi tidak boleh kosong","error");return;}
    setLoading(true);
    try{
      await onSave({
        amount:parseFloat(form.amount),
        type:form.type,
        description:form.desc.trim(),
        category_id:form.cat,
        date:new Date(form.date+"T"+new Date().toTimeString().slice(0,8)).toISOString(),
      });
      toast("Transaksi berhasil diperbarui","success");
    }catch(e){
      toast("Gagal memperbarui transaksi","error");
    }finally{setLoading(false);}
  };
  return(
    <div className="modal-ov" onClick={e=>{if(e.target===e.currentTarget)onClose()}}>
      <div className="modal">
        <div className="m-title">Edit Transaksi</div>
        <div className="m-sub">Perbarui detail transaksi di bawah ini</div>
        <div className="fg">
          <label className="fl">Jenis</label>
          <div style={{display:"flex",gap:8}}>
            {[["expense","Pengeluaran"],["income","Pemasukan"]].map(([v,l])=>(
              <button key={v} onClick={()=>s("type",v)}
                className="btn btn-sm"
                style={{flex:1,justifyContent:"center",
                  background:form.type===v?"var(--btn-grad)":"var(--glass2)",
                  color:form.type===v?"var(--bg)":"var(--text2)",
                  border:`1px solid ${form.type===v?"transparent":"var(--border)"}`}}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="fg">
          <label className="fl">Jumlah (Rp)</label>
          <input className="fi" type="number" min="0" placeholder="0" value={form.amount} onChange={e=>s("amount",e.target.value)}/>
        </div>
        <div className="fg">
          <label className="fl">Deskripsi</label>
          <input className="fi" placeholder="Contoh: Makan siang" value={form.desc} onChange={e=>s("desc",e.target.value)}/>
        </div>
        <div className="fr">
          <div className="fg">
            <label className="fl">Kategori</label>
            <select className="fi fs" value={form.cat} onChange={e=>s("cat",e.target.value)}>
              {CATS.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="fg">
            <label className="fl">Tanggal</label>
            <input className="fi" type="date" value={form.date} onChange={e=>s("date",e.target.value)} max={today}/>
          </div>
        </div>
        <div className="m-foot">
          <button className="btn btn-g btn-sm" onClick={onClose} disabled={loading}>Batal</button>
          <button className="btn btn-p btn-sm" onClick={submit} disabled={loading}>
            {loading?<><span className="loading-spin"/>Menyimpan...</>:<><Icon name="checkCircle" size={13} color="currentColor"/>Simpan</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function AnimatedLineChart({cumulative, daysInMonth, totalE, nowDate, dailySpend}){
  const id = useRef(`lc-${Math.random().toString(36).slice(2,7)}`).current;
  const [hovered, setHovered] = React.useState(null);
  const svgRef = useRef(null);

  const W=500, H=140, padL=52, padR=20, padTop=16, padBot=28;
  const plotW = W-padL-padR;
  const plotH = H-padTop-padBot;

  const maxCum = Math.max(...cumulative, 1);
  const xOf = (i) => padL + i * plotW / (daysInMonth-1||1);
  const yOf = (v)  => padTop + plotH - (v/maxCum)*plotH;

  // Build smooth bezier path
  const buildPath = (pts) => {
    if(pts.length < 2) return "";
    let d = `M ${pts[0].x},${pts[0].y}`;
    for(let i=1; i<pts.length; i++){
      const prev = pts[i-1], curr = pts[i];
      const cpx = (prev.x + curr.x) / 2;
      d += ` C ${cpx},${prev.y} ${cpx},${curr.y} ${curr.x},${curr.y}`;
    }
    return d;
  };

  const pts = cumulative.map((v,i) => ({ x: xOf(i), y: yOf(v), v, day: i+1 }));
  const linePath = buildPath(pts);
  const areaPath = pts.length > 1
    ? `${linePath} L ${pts[pts.length-1].x},${padTop+plotH} L ${pts[0].x},${padTop+plotH} Z`
    : "";

  // Days with actual spending (step change in cumulative)
  const txnDays = (dailySpend||[]).map((v,i)=>v>0?i:-1).filter(i=>i>=0);

  // Line length estimate for dash animation
  const lineLen = pts.reduce((acc,p,i)=>{
    if(i===0) return 0;
    const dx=p.x-pts[i-1].x, dy=p.y-pts[i-1].y;
    return acc+Math.sqrt(dx*dx+dy*dy);
  }, 0);

  const gridValues = [0, 0.25, 0.5, 0.75, 1];

  return(
    <div style={{position:"relative", userSelect:"none"}}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H+padBot}`}
        width="100%"
        style={{overflow:"visible", display:"block", cursor:"crosshair"}}
        onMouseLeave={()=>setHovered(null)}
        onMouseMove={(e)=>{
          const rect = e.currentTarget.getBoundingClientRect();
          const svgW = rect.width;
          const mx = (e.clientX - rect.left) * W / svgW;
          if(mx < padL || mx > W-padR){ setHovered(null); return; }
          const idx = Math.round((mx - padL) / plotW * (daysInMonth-1));
          const clamped = Math.max(0, Math.min(daysInMonth-1, idx));
          setHovered(clamped);
        }}
      >
        <defs>
          
          <linearGradient id={`ag-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.22"/>
            <stop offset="50%"  stopColor="var(--accent)" stopOpacity="0.08"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
          </linearGradient>
          
          <linearGradient id={`lg-${id}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="1"/>
          </linearGradient>
          
          <clipPath id={`cp-${id}`}>
            <rect x={padL} y={0} width={plotW} height={H+padBot}/>
          </clipPath>
          
          <filter id={`gf-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        
        {gridValues.map((v,i)=>{
          const gy = yOf(maxCum*v);
          return(
            <g key={i}>
              <line x1={padL} y1={gy} x2={W-padR} y2={gy}
                stroke="var(--border)" strokeWidth={i===0?1:0.5}
                strokeDasharray={i===0?"none":"4,6"} opacity={0.6}/>
              {v>0&&(
                <text x={padL-7} y={gy+3.5} fontSize="7.5" fill="var(--text3)"
                  textAnchor="end" fontFamily="'DM Mono',monospace">
                  {fmtK(Math.round(maxCum*v))}
                </text>
              )}
            </g>
          );
        })}

        
        {areaPath&&(
          <path d={areaPath} fill={`url(#ag-${id})`}
            clipPath={`url(#cp-${id})`}
            style={{animation:"fadeArea .9s ease .3s both"}}/>
        )}

        
        {linePath&&(
          <path
            d={linePath}
            fill="none"
            stroke={`url(#lg-${id})`}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            clipPath={`url(#cp-${id})`}
            strokeDasharray={lineLen+10}
            strokeDashoffset={lineLen+10}
            style={{animation:`drawLine 1.6s cubic-bezier(.4,0,.2,1) .1s both`}}
          />
        )}

        
        {txnDays.map(i=>{
          if(i >= cumulative.length) return null;
          const cx=xOf(i), cy=yOf(cumulative[i]);
          return(
            <g key={i} style={{animation:`dotPop .3s ease ${.8+i*.02}s both`}}>
              <circle cx={cx} cy={cy} r="2.5"
                fill="var(--accent)" stroke="var(--bg)" strokeWidth="1.5"
                opacity="0.7"/>
            </g>
          );
        })}

        
        {hovered!==null && hovered < cumulative.length && (()=>{
          const cx = xOf(hovered);
          const cy = yOf(cumulative[hovered]);
          const val = cumulative[hovered];
          const daySpend = (dailySpend||[])[hovered]||0;
          const label = `Tgl ${hovered+1}`;
          const tipW = 110, tipH = 44;
          const tipX = cx+padL > W-padR-tipW-10 ? cx-tipW-8 : cx+8;
          const tipY = cy-tipH/2;

          return(
            <g>
              
              <line x1={cx} y1={padTop} x2={cx} y2={padTop+plotH}
                stroke="var(--accent)" strokeWidth="1" strokeDasharray="3,3" opacity="0.4"/>
              
              <line x1={padL} y1={cy} x2={W-padR} y2={cy}
                stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="3,5" opacity="0.25"/>
              
              <circle cx={cx} cy={cy} r="12" fill="var(--accent)" fillOpacity="0.08"/>
              <circle cx={cx} cy={cy} r="6"  fill="var(--accent)" fillOpacity="0.15"/>
              <circle cx={cx} cy={cy} r="3.5" fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" filter={`url(#gf-${id})`}/>
              
              <rect x={tipX} y={tipY} width={tipW} height={tipH}
                rx="6" fill="var(--surface2)"
                stroke="var(--border2)" strokeWidth="1"
                style={{filter:"drop-shadow(0 4px 12px rgba(0,0,0,0.2))"}}/>
              <text x={tipX+10} y={tipY+13} fontSize="8" fill="var(--text3)"
                fontFamily="'DM Mono',monospace" fontWeight="500">{label}</text>
              <text x={tipX+10} y={tipY+27} fontSize="11" fill="var(--accent)"
                fontFamily="'DM Mono',monospace" fontWeight="700">{fmtK(val)}</text>
              {daySpend>0&&(
                <text x={tipX+10} y={tipY+39} fontSize="8" fill="var(--green)"
                  fontFamily="'DM Mono',monospace">+{fmtK(daySpend)} hari ini</text>
              )}
            </g>
          );
        })()}

        {cumulative.length>0&&hovered===null&&(()=>{
          const i=cumulative.length-1;
          const cx=xOf(i), cy=yOf(cumulative[i]);
          return(
            <g>
              <circle cx={cx} cy={cy} r="14" fill="var(--accent)" fillOpacity="0.06"
                style={{animation:"fadeArea .4s ease 1.5s both"}}/>
              <circle cx={cx} cy={cy} r="7"  fill="var(--accent)" fillOpacity="0.12"
                style={{animation:"fadeArea .4s ease 1.5s both"}}/>
              <circle cx={cx} cy={cy} r="4"  fill="var(--accent)" stroke="var(--bg)" strokeWidth="2.5"
                filter={`url(#gf-${id})`}
                style={{animation:"dotPop .5s cubic-bezier(.4,0,.2,1) 1.4s both"}}/>
            </g>
          );
        })()}

        {[1,8,16,23,daysInMonth].map(d=>(
          <text key={d} x={xOf(d-1)} y={H+padBot-4} fontSize="8" fill="var(--text3)"
            textAnchor="middle" fontFamily="'DM Mono',monospace">{d}</text>
        ))}
      </svg>
    </div>
  );
}

function AnalyticsSVGBarChart({data, labels, activeIdx, onBarClick, tab}){
  const [hovered, setHovered] = useState(null);
  const uid = useRef(`bc-${Math.random().toString(36).slice(2,6)}`).current;
  const W=500, H=140, padL=44, padR=12, padTop=24, padBot=28;
  const plotW = W-padL-padR;
  const plotH = H-padTop-padBot;
  const n = data.length;
  const maxV = Math.max(...data, 1);

  const gap = tab==="monthly" ? 3 : 5;
  const barW = (plotW - gap*(n-1)) / n;

  const xOf = (i) => padL + i*(barW+gap);
  const barH = (v) => Math.max(v>0 ? (v/maxV)*plotH : 0, v>0?4:0);
  const yOf  = (v) => padTop + plotH - barH(v);

  const gridVals = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{display:"block",overflow:"visible",cursor:"pointer"}}>
      <defs>
        <linearGradient id={`bg-act-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--grad1)" stopOpacity="1"/>
          <stop offset="100%" stopColor="var(--grad2)" stopOpacity="0.7"/>
        </linearGradient>
        <linearGradient id={`bg-dim-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--border2)" stopOpacity="0.5"/>
          <stop offset="100%" stopColor="var(--border)" stopOpacity="0.2"/>
        </linearGradient>
        <linearGradient id={`bg-hov-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.12"/>
        </linearGradient>
        <filter id={`glow-${uid}`}>
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {gridVals.map((v,gi)=>{
        const gy = padTop + plotH*(1-v);
        return (
          <g key={gi}>
            <line x1={padL} y1={gy} x2={W-padR} y2={gy}
              stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3,5" opacity={0.7}/>
            <text x={padL-5} y={gy+3.5} fontSize="7.5" fill="var(--text3)"
              textAnchor="end" fontFamily="'DM Mono',monospace">{fmtK(Math.round(maxV*v))}</text>
          </g>
        );
      })}

      <line x1={padL} y1={padTop+plotH} x2={W-padR} y2={padTop+plotH}
        stroke="var(--border2)" strokeWidth={1}/>

      {data.map((v,i)=>{
        const bx = xOf(i);
        const bh = barH(v);
        const by = yOf(v);
        const isActive = i===activeIdx;
        const isHov = i===hovered;
        const fillId = isActive ? `url(#bg-act-${uid})` : isHov ? `url(#bg-hov-${uid})` : `url(#bg-dim-${uid})`;
        const r = Math.min(5, barW/2);

        return (
          <g key={i}
            onClick={()=>onBarClick(i)}
            onMouseEnter={()=>setHovered(i)}
            onMouseLeave={()=>setHovered(null)}
            style={{cursor:"pointer"}}>

            <rect x={bx} y={padTop} width={barW} height={plotH}
              rx={r} fill="var(--glass)" opacity={0.4}/>

            {bh>0&&(
              <rect x={bx} y={by} width={barW} height={bh}
                rx={r}
                fill={fillId}
                filter={isActive?`url(#glow-${uid})`:"none"}
                style={{animation:`barIn .42s cubic-bezier(.4,0,.2,1) ${i*28}ms both`,transformOrigin:`${bx+barW/2}px ${padTop+plotH}px`}}
              />
            )}

            {isActive&&bh>0&&(
              <rect x={bx} y={by} width={barW} height={Math.min(bh,20)}
                rx={r} fill="rgba(255,255,255,0.14)"
                style={{animation:`barIn .42s cubic-bezier(.4,0,.2,1) ${i*28}ms both`,transformOrigin:`${bx+barW/2}px ${padTop+plotH}px`}}
              />
            )}

            {(isActive||isHov)&&v>0&&(()=>{
              const tx = bx+barW/2;
              const ty = by-8;
              const tw = tab==="monthly"?38:44;
              const th = 16;
              const label = fmtK(v);
              return (
                <g style={{animation:"fadeUp .15s ease both"}}>
                  <rect x={tx-tw/2} y={ty-th} width={tw} height={th}
                    rx={4} fill="var(--accent)" opacity={0.95}/>
                  <text x={tx} y={ty-th/2+3.5} textAnchor="middle"
                    fontSize="8" fontFamily="'DM Mono',monospace"
                    fill="var(--bg)" fontWeight="600">{label}</text>
                  <polygon points={`${tx-4},${ty} ${tx+4},${ty} ${tx},${ty+5}`}
                    fill="var(--accent)" opacity={0.95}/>
                </g>
              );
            })()}

            <text
              x={bx+barW/2} y={padTop+plotH+16}
              textAnchor="middle"
              fontSize={tab==="monthly"?7:8.5}
              fontFamily="'DM Mono',monospace"
              fontWeight={isActive?600:400}
              fill={isActive?"var(--accent)":"var(--text3)"}
            >{labels[i]}</text>

          </g>
        );
      })}
    </svg>
  );
}

function Analytics({txns, prediction, user, toast}){
  const now          = new Date();
  const todayWeekIdx = localMondayIndex(now);

  const [tab,setTab]=useState("weekly");
  const [tableTab,setTableTab]=useState("weekly");
  const [ab,setAb]=useState(todayWeekIdx);
  const [barKey,setBarKey]=useState(0);

  const expense = txns.filter(t=>t.type==="expense");
  const totalE  = expense.reduce((s,t)=>s+t.amount,0);
  const totalI  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);

  const weeklyData   = buildWeeklyData(txns);
  const weeklyIncome = buildWeeklyIncomeData(txns);
  const monthlyData  = buildMonthlyData(txns);
  const monthlyInc   = buildMonthlyIncomeData(txns);
  const yearlyData   = buildYearlyData(txns);

  const cd   = tab==="weekly"?weeklyData:tab==="monthly"?monthlyData:yearlyData;
  const lbs  = tab==="weekly"?DAYS:tab==="monthly"?MONTHS:YEARS;
  const safeAb = Math.min(ab, cd.length-1);

  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const dailySpend  = Array(daysInMonth).fill(0);
  txns.filter(t=>t.type==="expense").forEach(t=>{
    const d = parseLocalDate(t.date);
    if(d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()) dailySpend[d.getDate()-1]+=t.amount;
  });
  const cumulative = dailySpend.reduce((acc,v,i)=>{acc.push((acc[i-1]||0)+v);return acc;},[]);

  const catColors = {food:"#FF7043",transport:"#60A5FA",health:"#4ADE80",shop:"#C084FC",entertain:"#FBBF24",salary:"#4ADE80",other:"#888888"};
  const bycat=CATS.map(c=>({...c,total:expense.filter(t=>t.cat===c.id).reduce((s,t)=>s+t.amount,0)})).filter(c=>c.total>0).sort((a,b)=>b.total-a.total);

  const donutR=52, donutCx=70, donutCy=70, donutStroke=13, donutCirc=2*Math.PI*donutR;
  let donutOff=0;
  const donutSlices=bycat.map(c=>{
    const pct=totalE>0?c.total/totalE:0;
    const dash=pct*donutCirc;
    const s={id:c.id,color:catColors[c.id]||"#888",dash,offset:donutOff,pct:Math.round(pct*100)};
    donutOff+=dash+2; return s;
  });

  const totalImp = txns.filter(t=>t.imp).length;
  const avgDay   = Math.round(totalE/(now.getDate()||1));
  const topCat   = bycat[0];
  const boringDay= (()=>{const mx=Math.max(...dailySpend);const d=dailySpend.indexOf(mx)+1;return mx>0?`Tgl ${d}`:"—";})();

  const buildTableRows = () => {
    if(tableTab==="weekly"){
      return DAYS.map((day,i)=>{
        const exp=weeklyData[i]||0, inc=weeklyIncome[i]||0;
        return {label:day, exp, inc, net:inc-exp, highlight: i===todayWeekIdx};
      });
    }
    if(tableTab==="monthly"){
      return MONTHS.map((m,i)=>{
        const exp=monthlyData[i]||0, inc=monthlyInc[i]||0;
        return {label:m, exp, inc, net:inc-exp, highlight: i===now.getMonth()};
      });
    }
    return YEARS.map((y,i)=>{
      const exp=yearlyData[i]||0;
      return {label:y, exp, inc:0, net:-exp, highlight: y===String(now.getFullYear())};
    });
  };
  const tableRows=buildTableRows();
  const tableTotalExp=tableRows.reduce((s,r)=>s+r.exp,0);
  const tableTotalInc=tableRows.reduce((s,r)=>s+r.inc,0);

  return(
    <div className="page fi-a">
      <div className="ph" style={{flexWrap:"wrap",gap:10}}>
        <div>
          <div className="pt">Statistik</div>
          <div className="ps">Pola pengeluaran & tren keuangan · {now.toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</div>
        </div>
        <button className="btn btn-g btn-sm" onClick={()=>exportToPDF(txns,user,prediction)}>
          <Icon name="filePdf" size={13} color="currentColor"/>Export PDF
        </button>
      </div>

      <div className="kpi-strip">
        {[
          {lbl:"Total Keluar",  val:fmtK(totalE),   sub:`${now.getDate()} hari`,       c:"var(--red)",   bg:"var(--red-dim)",   icon:"arrowDownLeft"},
          {lbl:"Total Masuk",   val:fmtK(totalI),   sub:"bulan ini",                   c:"var(--green)", bg:"var(--green-dim)", icon:"arrowUpRight"},
          {lbl:"Rata-rata/Hari",val:fmtK(avgDay),   sub:"pengeluaran harian",           c:"var(--text)",  bg:"var(--glass2)",    icon:"trending"},
          {lbl:"Impulsif",      val:`${totalImp}x`, sub:"transaksi tidak terencana",    c:"var(--amber)", bg:"var(--amber-dim)", icon:"alertTriangle"},
        ].map((s,i)=>(
          <div key={i} className={`stat-card stat-card-kpi ${["red","green","neutral","amber"][i]}`} style={{animation:`fadeUp .35s ease ${i*60}ms both`}}>
            <div className="stat-card-top">
              <div className="stat-card-lbl">{s.lbl}</div>
              <div style={{width:28,height:28,borderRadius:8,background:s.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name={s.icon} size={13} color={s.c}/>
              </div>
            </div>
            <div className="stat-card-val" style={{color:s.c}}>{s.val}</div>
            <div className="stat-card-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <div>
          <div className="dash-chart-card">
            <div className="dash-chart-header">
              <div>
                <div className="dash-chart-val">{fmtK(cd[safeAb]||0)}</div>
                <div className="dash-chart-sub">
                  {lbs[safeAb]} · {tab==="weekly"?"Minggu ini":tab==="monthly"?"Tahun ini":"5 Tahun"}
                </div>
              </div>
              <div className="tabs-row">
                {[["weekly","Mingguan"],["monthly","Bulanan"],["yearly","Tahunan"]].map(([v,l])=>(
                  <button key={v} className={`tab-btn${tab===v?" active":""}`}
                    onClick={()=>{setTab(v);setAb(v==="weekly"?localMondayIndex(new Date()):v==="monthly"?new Date().getMonth():4);setBarKey(k=>k+1);}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
            <AnalyticsSVGBarChart
              key={barKey}
              data={cd}
              labels={lbs}
              activeIdx={safeAb}
              onBarClick={(i)=>setAb(i)}
              tab={tab}
            />
          </div>

          <div className="dash-chart-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
              <div>
                <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"var(--text3)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:4}}>Kumulatif Pengeluaran Bulan Ini</div>
                <div style={{fontSize:11,color:"var(--text2)",fontFamily:"'DM Mono',monospace"}}>
                  Hari ke-1 sampai ke-{now.getDate()} &nbsp;·&nbsp; <strong style={{color:"var(--text)"}}>{fmt(totalE)}</strong> total
                </div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:8,color:"var(--text3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:2}}>Hari ini</div>
                <div style={{fontSize:18,fontWeight:700,letterSpacing:"-1px",color:"var(--accent)"}}>{fmtK(cumulative[now.getDate()-1]||0)}</div>
              </div>
            </div>
            <AnimatedLineChart
              key={`lc-${txns.length}`}
              cumulative={cumulative}
              daysInMonth={daysInMonth}
              totalE={totalE}
              nowDate={now.getDate()}
            />
          </div>

          <div className="stat-table-wrap">
            <div className="stat-table-head">
              <span style={{fontSize:11,fontWeight:600,color:"var(--text2)",marginRight:"auto",alignSelf:"center",textTransform:"uppercase",letterSpacing:".06em"}}>Tabel Rincian</span>
              {[["weekly","Mingguan"],["monthly","Bulanan"],["yearly","Tahunan"]].map(([v,l])=>(
                <button key={v} className={`stat-table-tab${tableTab===v?" active":""}`}
                  onClick={()=>setTableTab(v)}>{l}</button>
              ))}
            </div>
            <div className="tbl-wrap">
              <table className="stat-tbl">
                <thead>
                  <tr>
                    <th style={{paddingLeft:20}}>{tableTab==="weekly"?"Hari":tableTab==="monthly"?"Bulan":"Tahun"}</th>
                    <th className="num">Pengeluaran</th>
                    {tableTab!=="yearly"&&<th className="num">Pemasukan</th>}
                    {tableTab!=="yearly"&&<th className="num">Selisih</th>}
                  </tr>
                </thead>
                <tbody>
                  {tableRows.map((r,i)=>(
                    <tr key={i} className={r.highlight?"live-row":""}>
                      <td style={{paddingLeft:20,fontWeight:r.highlight?600:400}}>{r.label}</td>
                      <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:12,color:r.exp>0?"var(--red)":"var(--text3)"}}>
                        {r.exp>0?`-${fmtK(r.exp)}`:"—"}
                      </td>
                      {tableTab!=="yearly"&&<td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:12,color:r.inc>0?"var(--green)":"var(--text3)"}}>
                        {r.inc>0?`+${fmtK(r.inc)}`:"—"}
                      </td>}
                      {tableTab!=="yearly"&&<td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",fontSize:12,color:r.net>0?"var(--green)":r.net<0?"var(--red)":"var(--text3)"}}>
                        {r.net===0?"—":(r.net>0?"+":"")+fmtK(r.net)}
                      </td>}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{paddingLeft:20}}>Total</td>
                    <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:tableTotalExp>0?"var(--red)":"var(--text3)"}}>
                      {tableTotalExp>0?`-${fmtK(tableTotalExp)}`:"—"}
                    </td>
                    {tableTab!=="yearly"&&<td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:tableTotalInc>0?"var(--green)":"var(--text3)"}}>
                      {tableTotalInc>0?`+${fmtK(tableTotalInc)}`:"—"}
                    </td>}
                    {tableTab!=="yearly"&&(()=>{const net=tableTotalInc-tableTotalExp;return(
                      <td style={{textAlign:"right",fontFamily:"'DM Mono',monospace",color:net>0?"var(--green)":net<0?"var(--red)":"var(--text3)"}}>
                        {net===0?"—":(net>0?"+":"")+fmtK(net)}
                      </td>
                    );})()}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="card card-glow" style={{marginBottom:16}}>
            <div className="sec-t"><span>Belanja per Kategori</span></div>
            {bycat.length===0?(
              <div style={{fontSize:12,color:"var(--text3)",textAlign:"center",padding:"24px 0"}}>Belum ada pengeluaran</div>
            ):(
              <>
                <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:18}}>
                  <svg width="140" height="140" viewBox="0 0 140 140" style={{flexShrink:0}}>
                    <circle cx={donutCx} cy={donutCy} r={donutR} fill="none" stroke="var(--glass2)" strokeWidth={donutStroke}/>
                    {donutSlices.map((s,i)=>(
                      <circle key={i} cx={donutCx} cy={donutCy} r={donutR}
                        fill="none" stroke={s.color} strokeWidth={donutStroke}
                        strokeDasharray={`${s.dash} ${donutCirc}`}
                        strokeDashoffset={-s.offset+donutCirc/4}
                        strokeLinecap="butt"
                        style={{transform:"rotate(-90deg)",transformOrigin:`${donutCx}px ${donutCy}px`,
                          animation:`fadeArea .5s ease ${i*80}ms both`}}
                      />
                    ))}
                    <text x={donutCx} y={donutCy-6} textAnchor="middle" fontSize="10" fill="var(--text3)" fontFamily="'DM Mono',monospace">Total</text>
                    <text x={donutCx} y={donutCy+10} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--text)" fontFamily="'DM Mono',monospace">{fmtK(totalE)}</text>
                  </svg>
                  <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
                    {bycat.slice(0,4).map(c=>{
                      const cc=catColors[c.id]||"#888";
                      const pct=totalE>0?Math.round(c.total/totalE*100):0;
                      return(
                        <div key={c.id} style={{display:"flex",alignItems:"center",gap:7}}>
                          <div style={{width:8,height:8,borderRadius:2,background:cc,flexShrink:0}}/>
                          <div style={{fontSize:11,color:"var(--text2)",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</div>
                          <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:cc,fontWeight:600}}>{pct}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {bycat.map(c=>{
                  const cc=catColors[c.id]||"#888";
                  const pct=totalE>0?Math.round(c.total/totalE*100):0;
                  return(
                    <div className="cat-donut-row" key={c.id}>
                      <div style={{width:34,height:34,borderRadius:9,background:`${cc}18`,border:`1px solid ${cc}30`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <CatIcon id={c.id} size={16} color={cc}/>
                      </div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                          <span style={{fontSize:12.5,fontWeight:500}}>{c.name}</span>
                          <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:cc,fontWeight:600}}>{pct}%</span>
                        </div>
                        <div style={{height:3,background:"var(--glass2)",borderRadius:99,overflow:"hidden"}}>
                          <div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${cc},${cc}cc)`,borderRadius:99,transition:"width .6s ease"}}/>
                        </div>
                        <div style={{fontSize:9.5,color:"var(--text3)",marginTop:4,fontFamily:"'DM Mono',monospace"}}>{fmt(c.total)}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          <div className="card">
            <div className="sec-t"><span>Insight Bulan Ini</span></div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {icon:"alertTriangle",c:"var(--amber)",label:"Kategori terboros",val:topCat?.name||"—"},
                {icon:"trending",     c:"var(--red)",  label:"Hari paling boros",val:boringDay},
                {icon:"zap",         c:"var(--green)", label:"Sisa bulan",        val:`${daysInMonth-now.getDate()} hari lagi`},
                {icon:"repeat",      c:"var(--text2)", label:"Transaksi impulsif",val:`${totalImp} transaksi`},
              ].map((ins,i)=>(
                <div key={i} className="insight-pill">
                  <div style={{width:28,height:28,borderRadius:8,background:`${ins.c}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name={ins.icon} size={13} color={ins.c}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:9.5,color:"var(--text3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".08em",marginBottom:1}}>{ins.label}</div>
                    <div style={{fontSize:12.5,fontWeight:600,color:"var(--text)"}}>{ins.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DNARing({score, size=120, strokeWidth=7}){
  const r = (size-strokeWidth*2)/2;
  const circ = 2*Math.PI*r;
  const fill = circ*score/100;
  const color = score>=70?"var(--green)":score>=45?"var(--amber)":"var(--red)";
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:"rotate(-90deg)"}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--border2)" strokeWidth={strokeWidth}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <div style={{fontWeight:700,fontSize:size/4.2,letterSpacing:-1,color}}>{score}</div>
        <div style={{fontSize:size/10,color:"var(--text3)",fontFamily:"'DM Mono',monospace"}}>/100</div>
      </div>
    </div>
  );
}

function MiniBarChart({data, labels, color="var(--accent)", height=56}){
  const max = Math.max(...data,1);
  return(
    <div style={{display:"flex",alignItems:"flex-end",gap:3,height}}>
      {data.map((v,i)=>{
        const h = Math.max(v/max*100,v>0?6:2);
        const isMax = v===Math.max(...data);
        return(
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
            <div style={{width:"100%",height:`${h}%`,borderRadius:"3px 3px 0 0",
              background:isMax?color:"var(--glass2)",
              border:`1px solid ${isMax?color:"var(--border)"}`,
              transition:"all .3s ease"}}
              title={`${labels[i]}: ${fmt(v)}`}
            />
            <span style={{fontSize:8,color:isMax?color:"var(--text3)",fontFamily:"'DM Mono',monospace",fontWeight:isMax?600:400}}>{labels[i]}</span>
          </div>
        );
      })}
    </div>
  );
}

function DimCard({label, value, icon, max=25, tip, formula}){
  const [open, setOpen] = React.useState(false);
  const pct   = Math.round(value/max*100);
  const color = pct>=70?"var(--green)":pct>=45?"var(--amber)":"var(--red)";
  const bgCol = pct>=70?"var(--green-dim)":pct>=45?"var(--amber-dim)":"var(--red-dim)";
  const statusLabel = pct>=70?"Baik":pct>=45?"Perlu ditingkatkan":"Perlu perhatian";
  return(
    <div onClick={()=>setOpen(o=>!o)} style={{padding:"14px",background:"var(--glass)",border:`1px solid ${open?color:"var(--border)"}`,borderRadius:12,cursor:"pointer",transition:"border .2s",minWidth:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10,gap:4}}>
        <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0,flex:1}}>
          <div style={{width:24,height:24,borderRadius:7,background:bgCol,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <Icon name={icon} size={11} color={color}/>
          </div>
          <span style={{fontSize:11,color:"var(--text2)",fontWeight:500,lineHeight:1.3}}>{label}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
          <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,color,fontWeight:700,whiteSpace:"nowrap"}}>{value}<span style={{fontSize:9,color:"var(--text3)",fontWeight:400}}>/25</span></span>
          <Icon name={open?"chevronUp":"chevronDown"} size={10} color="var(--text3)"/>
        </div>
      </div>
      <div style={{height:4,background:"var(--border)",borderRadius:99,overflow:"hidden",marginBottom:8}}>
        <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:99,transition:"width .6s ease"}}/>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:9.5,color,fontWeight:600,padding:"2px 6px",borderRadius:99,background:bgCol,whiteSpace:"nowrap"}}>{statusLabel}</span>
        <span style={{fontSize:9,color:"var(--text3)",fontFamily:"'DM Mono',monospace"}}>{pct}%</span>
      </div>
      {open&&(
        <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid var(--border)"}}>
          {formula&&<div style={{fontSize:10.5,color:"var(--text3)",fontFamily:"'DM Mono',monospace",background:"var(--glass2)",padding:"7px 10px",borderRadius:7,marginBottom:8,lineHeight:1.6}}>{formula}</div>}
          {tip&&<div style={{fontSize:11.5,color:"var(--text2)",lineHeight:1.65,display:"flex",gap:7,alignItems:"flex-start"}}>
            <div style={{width:20,height:20,borderRadius:5,background:"var(--amber-dim)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
              <Icon name="lightbulb" size={11} color="var(--amber)"/>
            </div>
            <span>{tip}</span>
          </div>}
        </div>
      )}
    </div>
  );
}

function FinancialDNA({txns,user,prediction}){
  const [activeTab, setActiveTab] = useState("overview");
  const [simShopping, setSimShopping]   = useState(0);
  const [simEntertain, setSimEntertain] = useState(0);
  const [simFood, setSimFood]           = useState(0);

  const dna     = prediction?.dna?.total_score||72;
  const dnaType = prediction?.dna?.type_label||"Impulsive Optimizer";
  const dnaDesc = prediction?.dna?.type_desc||"Konsisten dalam membuat anggaran, tapi sering tergoda belanja di luar rencana.";

  // Terjemahan label archetype ke bahasa Indonesia
  const DNA_TYPE_ID = {
    "impulsive optimizer":   "Optimizer Impulsif",
    "mindful spender":       "Pembelanja Bijak",
    "balanced planner":      "Perencana Seimbang",
    "aggressive saver":      "Penabung Agresif",
    "cautious optimizer":    "Optimizer Hati-hati",
    "frugal master":         "Master Hemat",
    "budget breaker":        "Pembobol Anggaran",
    "spontaneous spender":   "Pembelanja Spontan",
    "strategic investor":    "Investor Strategis",
    "financial novice":      "Pemula Keuangan",
    "conservative":          "Konservatif",
    "impulsive":             "Impulsif",
    "optimizer":             "Optimizer",
    "saver":                 "Penabung",
    "spender":               "Pembelanja",
    "planner":               "Perencana",
  };
  const dnaTypeID = DNA_TYPE_ID[dnaType?.toLowerCase()] || DNA_TYPE_ID[Object.keys(DNA_TYPE_ID).find(k=>dnaType?.toLowerCase().includes(k))] || dnaType;

  // Warna badge berdasarkan skor DNA
  const badgeColor   = dna>=70?"var(--green)":dna>=45?"var(--amber)":"var(--red)";
  const badgeBg      = dna>=70?"var(--green-dim)":dna>=45?"var(--amber-dim)":"var(--red-dim)";
  const dims = prediction?.dna?.dimensions?[
    {n:"Konsistensi Budget",  v:prediction.dna.dimensions.budget_consistency||0, icon:"target",
     formula:"Skor = 25 - (pengeluaran - budget) / budget x 50\nMaksimal jika pengeluaran <= budget (Rp 8.000.000)",
     tip:"Pastikan total pengeluaran bulan ini tidak melebihi Rp 8.000.000. Kamu sudah bagus di sini!"},
    {n:"Kontrol Impulsif",    v:prediction.dna.dimensions.impulse_control||0,    icon:"zap",
     formula:"Skor = 25 x (1 - (jml_impulsif / total_expense) x 2)\nMaksimal jika 0 transaksi impulsif",
     tip:"Hindari belanja di kategori Shop/Entertain di atas Rp 50rb siang atau Rp 30rb malam. Nol impulsif = 25/25!"},
    {n:"Kebiasaan Menabung",  v:prediction.dna.dimensions.saving_habit||0,       icon:"coin",
     formula:"Skor = (income - expense) / income x 50  (max 25)\nMaksimal jika tabungan >= 50% dari pemasukan",
     tip:"Kamu perlu menabung minimal 50% dari pemasukan untuk full score. Auto-transfer tiap awal bulan sangat membantu."},
    {n:"Perencanaan Belanja", v:prediction.dna.dimensions.spending_plan||0,      icon:"clipboard",
     formula:"Skor = 25 x (1 - HHI)  dimana HHI = jumlah (kategori/total)^2\nMaksimal jika belanja tersebar merata ke banyak kategori",
     tip:"Sebar belanja ke minimal 5-6 kategori berbeda (Makanan, Transport, Kesehatan, Edukasi, Tagihan, dll) agar skor naik drastis."},
  ]:[
    {n:"Konsistensi Budget",v:85,icon:"target",formula:"",tip:""},
    {n:"Kontrol Impulsif",v:42,icon:"zap",formula:"",tip:""},
    {n:"Kebiasaan Menabung",v:60,icon:"coin",formula:"",tip:""},
    {n:"Perencanaan Belanja",v:70,icon:"clipboard",formula:"",tip:""},
  ];

  const imps    = txns.filter(t=>t.imp);
  const impAmt  = imps.reduce((s,t)=>s+t.amount,0);
  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance = income-expense;
  const expTxns = txns.filter(t=>t.type==="expense");

  const catMap = {};
  expTxns.forEach(t=>{
    const c = t.cat||t.category_slug||"other";
    catMap[c]=(catMap[c]||0)+t.amount;
  });
  const sortedCats = Object.entries(catMap).sort((a,b)=>b[1]-a[1]);
  const topImpCats = [...new Set(imps.map(t=>t.cat||t.category_slug||"other"))].slice(0,2);
  const topImpCatLabel = topImpCats.length?topImpCats.map(c=>c.charAt(0).toUpperCase()+c.slice(1)).join(" & "):"—";

  // Streak: hitung mundur dari hari ini, skip hari tanpa transaksi, putus saat ada impulsif
  const txnDaySet = new Set(txns.map(t=>t.date?.slice(0,10)).filter(Boolean));
  const impDaySet = new Set(imps.map(t=>t.date?.slice(0,10)).filter(Boolean));
  let streak=0;
  const todayStr=(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;})();
  for(let i=0;i<90;i++){
    const dd=new Date();dd.setDate(dd.getDate()-i);
    const ds=`${dd.getFullYear()}-${String(dd.getMonth()+1).padStart(2,"0")}-${String(dd.getDate()).padStart(2,"0")}`;
    if(!txnDaySet.has(ds)) continue; // hari tanpa transaksi, skip
    if(impDaySet.has(ds)) break;     // ada impulsif, streak putus
    streak++;
  }

  const tips = [];
  if(imps.length>0) tips.push(`Kamu punya ${imps.length} transaksi impulsif. Coba cooling-off 24 jam sebelum belanja ${topImpCatLabel} di atas Rp 100rb.`);
  // tips hari terboros pakai parseLocalDate
  const _tipsDay = Array(7).fill(0);expTxns.forEach(t=>{if(t.date){const d=parseLocalDate(t.date);if(!isNaN(d))_tipsDay[d.getDay()]+=t.amount;}});
  // tips jam pakai t.time
  const _tipsPeak = Array(24).fill(0);expTxns.forEach(t=>{if(t.time&&t.time!=="00:00"){const h=parseInt(t.time.split(":")[0],10);if(h>=0&&h<24)_tipsPeak[h]+=t.amount;}});
  const _tipsH = _tipsPeak.some(v=>v>0) ? _tipsPeak.indexOf(Math.max(..._tipsPeak)) : -1;
  if(_tipsH>=21||_tipsH<5) tips.push(`Puncak belanjamu jam ${_tipsH}:00. Aktifkan "Do Not Disturb" untuk notifikasi e-commerce malam hari.`);
  if(_tipsDay[5]===Math.max(..._tipsDay)&&_tipsDay[5]>0) tips.push("Jumat adalah hari paling boros kamu. Buat batas belanja harian sebelum weekend tiba.");
  if(dims[1].v<50)    tips.push("Kontrol impulsif kamu masih rendah. Coba gunakan metode 50/30/20: 50% kebutuhan, 30% keinginan, 20% tabungan.");
  if(dims[2].v<40)    tips.push("Kebiasaan menabung perlu ditingkatkan. Targetkan auto-transfer ke tabungan tiap awal bulan.");
  if(tips.length===0) tips.push("Keuanganmu sudah cukup sehat! Pertahankan pola ini dan tingkatkan porsi tabungan bulan depan.");
  if(tips.length<3)   tips.push("Evaluasi pengeluaran terbesar kamu setiap minggu untuk menemukan area penghematan.");

  const TABS = [
    {id:"overview",  label:"Ringkasan",  icon:"dna"},
    {id:"behavior",  label:"Perilaku",   icon:"trending"},
    {id:"goals",     label:"Target",     icon:"target"},
    {id:"simulator", label:"Simulator",  icon:"lightbulb"},
  ];

  const CAT_COLORS={"food":"#FF7043","transport":"#60A5FA","health":"#4ADE80","shop":"#C084FC","entertain":"#FBBF24","salary":"#4ADE80","other":"#888888"};
  const CAT_NAMES={"food":"Makanan","transport":"Transport","health":"Kesehatan","shop":"Belanja","entertain":"Hiburan","salary":"Gaji","other":"Lainnya"};
  const dimColor=(v)=> v>=70?"var(--green)":v>=45?"var(--amber)":"var(--red)";
  const shopSpend    = (catMap["shop"]||0);
  const entertainSpend=(catMap["entertain"]||0);
  const foodSpend    = (catMap["food"]||0);
  const simSaved     = (shopSpend*(simShopping/100))+(entertainSpend*(simEntertain/100))+(foodSpend*(simFood/100));
  const DAY_NAMES2 = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
  // dayMap2: pakai parseLocalDate agar tidak timezone shift
  const dayMap2 = Array(7).fill(0);
  expTxns.forEach(t=>{if(t.date){const d=parseLocalDate(t.date);if(!isNaN(d))dayMap2[d.getDay()]+=t.amount;}});
  const peakDay2 = DAY_NAMES2[dayMap2.indexOf(Math.max(...dayMap2))];
  // hourMap2: pakai t.time (HH:MM) dari normalizeTxn, bukan getHours dari date string
  const hourMap2 = Array(24).fill(0);
  expTxns.forEach(t=>{
    if(t.time&&t.time!=="00:00"){
      const h=parseInt(t.time.split(":")[0],10);
      if(h>=0&&h<24)hourMap2[h]+=t.amount;
    }
  });
  const maxHour2 = Math.max(...hourMap2,1);
  const hasHourData = hourMap2.some(v=>v>0);
  const peakHour2 = hasHourData ? hourMap2.indexOf(Math.max(...hourMap2)) : -1;

  const goals=[
    {label:"Streak bebas impulsif",icon:"flame",   color:"var(--red)",   current:streak,   target:7,  unit:"hari",   done:streak>=7},
    {label:"DNA Score 80+",        icon:"diamond",  color:"#60A5FA",      current:dna,      target:80, unit:"poin",   done:dna>=80},
    {label:"Tidak ada impulsif",   icon:"trophy",   color:"var(--amber)", current:Math.max(0,imps.length===0?5:5-imps.length),target:5,unit:"dicapai",done:imps.length===0&&txns.length>0},
    {label:"Pemasukan > Pengeluaran", icon:"trendingUp",color:"var(--green)",current:income>expense?100:Math.round(income/Math.max(expense,1)*100),target:100,unit:"%",done:income>expense&&income>0},
  ];

  return(
    <div className="page fi-a">

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:26,fontWeight:700,letterSpacing:-1,marginBottom:3}}>Financial DNA</div>
          <div style={{fontSize:12.5,color:"var(--text2)"}}>Profil perilaku keuangan kamu bulan ini</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
          {streak>=3&&(
            <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:99,background:"var(--green-dim)",border:"1px solid var(--green)",color:"var(--green)",fontSize:12,fontWeight:600}}>
              <Icon name="flame" size={13} color="var(--green)"/>{streak} hari streak
            </div>
          )}
          <div style={{padding:"6px 14px",borderRadius:99,background:badgeBg,border:`1px solid ${badgeColor}`,color:badgeColor,fontSize:11.5,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>
            {dnaTypeID}
          </div>
        </div>
      </div>


      <div style={{background:"var(--card-grad)",border:"1px solid var(--border2)",borderRadius:20,padding:"24px 28px",marginBottom:20,display:"flex",alignItems:"center",gap:28,flexWrap:"wrap",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:"-50%",right:"-5%",width:280,height:280,borderRadius:"50%",background:"radial-gradient(circle,var(--glow) 0%,transparent 65%)",pointerEvents:"none"}}/>
        <DNARing score={dna} size={120}/>
        <div style={{flex:1,minWidth:200}}>
          <div style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"var(--text3)",letterSpacing:".12em",textTransform:"uppercase",marginBottom:6}}>Tipe Keuangan</div>
          <div style={{fontSize:22,fontWeight:700,letterSpacing:"-.5px",marginBottom:6}}>{dnaTypeID}</div>
          <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.7,marginBottom:14}}>{dnaDesc}</div>
          <div style={{display:"flex",gap:20,flexWrap:"wrap"}}>
            {[
              {lbl:"Pemasukan",   val:fmt(income),   c:"var(--green)"},
              {lbl:"Pengeluaran", val:fmt(expense),  c:"var(--red)"},
              {lbl:"Impulsif",    val:fmt(impAmt),   c:"var(--amber)"},
            ].map((s,i)=>(
              <div key={i}>
                <div style={{fontSize:9,color:"var(--text3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".1em",marginBottom:2}}>{s.lbl}</div>
                <div style={{fontSize:15,fontWeight:700,color:s.c}}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:"flex",gap:4,background:"var(--glass2)",border:"1px solid var(--border)",borderRadius:12,padding:4,marginBottom:20}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            style={{
              flex:1,padding:"8px 10px",borderRadius:8,fontSize:12,fontWeight:500,cursor:"pointer",border:"none",
              transition:"all .15s",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:6,
              background:activeTab===t.id?"var(--surface)":"transparent",
              color:activeTab===t.id?"var(--accent)":"var(--text2)",
              boxShadow:activeTab===t.id?"var(--shadow-sm)":"none",
            }}>
            <Icon name={t.icon} size={12} color={activeTab===t.id?"var(--accent)":"var(--text3)"}/>
            {t.label}
          </button>
        ))}
      </div>


      {activeTab==="overview"&&(
        <div className="two-col">
          <div>
            <div className="card" style={{marginBottom:16}}>
              <div className="sec-t">
                <span>4 Dimensi DNA Score</span>
                <span style={{fontSize:11,color:"var(--text3)",fontWeight:400,textTransform:"none",letterSpacing:0}}>Tap untuk detail & cara naik</span>
              </div>
              <div style={{background:"var(--glass2)",border:"1px solid var(--border)",borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                  <span style={{fontSize:11,color:"var(--text2)",fontWeight:500}}>Total Skor DNA</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:700,color:dna>=70?"var(--green)":dna>=45?"var(--amber)":"var(--red)"}}>{dna}<span style={{fontSize:9,color:"var(--text3)",fontWeight:400}}>/100</span></span>
                </div>
                <div style={{height:6,background:"var(--border)",borderRadius:99,overflow:"hidden",marginBottom:6}}>
                  <div style={{height:"100%",width:`${dna}%`,background:dna>=70?"var(--green)":dna>=45?"var(--amber)":"var(--red)",borderRadius:99,transition:"width .8s ease"}}/>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--text3)",fontFamily:"'DM Mono',monospace",overflow:"hidden"}}>
                  <span>0</span><span style={{color:"var(--red)"}}>40</span><span style={{color:"var(--amber)"}}>55</span><span style={{color:"#60A5FA"}}>70</span><span style={{color:"var(--green)"}}>85</span><span>100</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                {dims.map(d=><DimCard key={d.n} label={d.n} value={d.v} icon={d.icon} tip={d.tip} formula={d.formula}/>)}
              </div>

              {(()=>{
                const missing = dims.filter(d=>d.v<25);
                if(missing.length===0) return(
                  <div style={{marginTop:10,padding:"10px 14px",borderRadius:9,background:"var(--green-dim)",border:"1px solid var(--green)",fontSize:12,color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
                    <Icon name="trophy" size={14} color="var(--green)"/>Semua dimensi sempurna! Skor 100/100
                  </div>
                );
                const gap = 100 - dna;
                return(
                  <div style={{marginTop:10,padding:"12px 14px",borderRadius:9,background:"var(--glass2)",border:"1px solid var(--border)",fontSize:12}}>
                    <div style={{fontWeight:600,color:"var(--text)",marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:22,height:22,borderRadius:6,background:"var(--amber-dim)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <Icon name="target" size={12} color="var(--amber)"/>
                      </div>
                      Butuh <span style={{color:"var(--amber)",fontFamily:"'DM Mono',monospace"}}>+{gap.toFixed(1)} poin</span> lagi untuk 100/100
                    </div>
                    {missing.map(d=>{
                      const shortage=(25-d.v).toFixed(1);
                      const pct=Math.round(d.v/25*100);
                      return(
                        <div key={d.n} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:"1px solid var(--border)",fontSize:11.5,gap:8}}>
                          <span style={{color:"var(--text2)",minWidth:0,flex:1}}>{d.n}</span>
                          <span style={{fontFamily:"'DM Mono',monospace",color:"var(--red)",fontWeight:600,flexShrink:0,whiteSpace:"nowrap"}}>-{shortage} poin ({pct}%)</span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            <div className="card">
              <div className="sec-t"><span>Insight Bulan Ini</span></div>
              {[
                {icon:"alertCircle",   c:"var(--red)",   m:`${imps.length} transaksi impulsif — ${fmt(impAmt)} bisa dihemat`,show:imps.length>0},
                {icon:"checkCircle",   c:"var(--green)", m:"Tidak ada transaksi impulsif bulan ini!",show:imps.length===0&&txns.length>0},
                {icon:"alertTriangle", c:"var(--amber)", m:`Pengeluaran melebihi pemasukan: ${fmt(expense-income)}`,show:expense>income},
                {icon:"trendingUp",    c:"var(--green)", m:`Surplus ${fmt(income-expense)} — keuangan sehat`,show:income>expense&&income>0},
                {icon:"zap",           c:"var(--accent)",m:`Hari paling boros: ${peakDay2}`,show:true},
                {icon:"coin",          c:"var(--text2)", m:`Saldo bersih: ${fmt(balance)}`,show:true},
              ].filter(x=>x.show).slice(0,4).map((ins,i,arr)=>(
                <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",padding:"11px 0",borderBottom:i<arr.length-1?"1px solid var(--border)":"none"}}>
                  <div style={{width:28,height:28,borderRadius:8,background:`${ins.c}18`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                    <Icon name={ins.icon} size={13} color={ins.c}/>
                  </div>
                  <span style={{fontSize:12.5,color:"var(--text2)",lineHeight:1.65}}>{ins.m}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="sec-t"><span>Pola Impulsif</span></div>
              {[
                {l:"Jumlah transaksi", v:`${imps.length} transaksi`,          c:imps.length>0?"var(--red)":"var(--green)"},
                {l:"Total kerugian",   v:fmt(impAmt),                         c:"var(--amber)"},
                {l:"Kategori pemicu",  v:topImpCatLabel,                      c:"var(--text)"},
                {l:"Rata-rata/txn",    v:fmt(impAmt/Math.max(imps.length,1)),c:"var(--text)"},
              ].map((r,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<3?"1px solid var(--border)":"none",fontSize:13}}>
                  <span style={{color:"var(--text2)"}}>{r.l}</span>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11.5,color:r.c,fontWeight:600}}>{r.v}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <div className="sec-t"><span>Saran Personal</span></div>
              {tips.slice(0,3).map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:i<2?"1px solid var(--border)":"none",alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"var(--accent)",color:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</div>
                  <span style={{fontSize:12.5,color:"var(--text2)",lineHeight:1.65}}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab==="behavior"&&(
        <div className="two-col">
          <div>
            <div className="card" style={{marginBottom:16}}>
              <div className="sec-t">
                <span>Belanja Per Hari</span>
                <span style={{fontSize:11,color:"var(--text3)",fontWeight:400,textTransform:"none",letterSpacing:0}}>
                  Terboros: <span style={{color:"var(--red)",fontWeight:600}}>{peakDay2}</span>
                </span>
              </div>
              <MiniBarChart data={dayMap2} labels={DAY_NAMES2} color="var(--red)" height={70}/>
              {peakDay2&&dayMap2[DAY_NAMES2.indexOf(peakDay2)]>0&&(
                <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:"var(--glass)",border:"1px solid var(--border)",fontSize:12,color:"var(--text2)",display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="trending" size={12} color="var(--amber)"/>
                  Pengeluaran paling tinggi di hari <strong style={{color:"var(--text)"}}>{peakDay2}</strong> — sebesar <strong style={{color:"var(--red)"}}>{fmt(dayMap2[DAY_NAMES2.indexOf(peakDay2)])}</strong>
                </div>
              )}
            </div>

            <div className="card" style={{marginBottom:16}}>
              <div className="sec-t">
                <span>Jam Belanja</span>
                <span style={{fontSize:11,color:"var(--text3)",fontWeight:400,textTransform:"none",letterSpacing:0}}>
                  Puncak: <span style={{color:"var(--red)",fontWeight:600}}>{hasHourData&&peakHour2>=0?`${String(peakHour2).padStart(2,"0")}:00`:"—"}</span>
                </span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(24,1fr)",gap:2}}>
                {hourMap2.map((v,h)=>{
                  const intensity=maxHour2>0?v/maxHour2:0;
                  const bg=intensity>0.7?"var(--red)":intensity>0.4?"var(--amber)":intensity>0.1?"var(--green)":"var(--glass2)";
                  const op=intensity>0?Math.max(0.25,intensity):0.12;
                  return(
                    <div key={h}
                      className="hour-cell"
                      data-label={`${String(h).padStart(2,"0")}:00 · ${v>0?fmt(v):"kosong"}`}
                      style={{height:20,borderRadius:3,background:bg,opacity:op,cursor:v>0?"pointer":"default",position:"relative"}}
                    />
                  );
                })}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6,fontSize:8.5,color:"var(--text3)",fontFamily:"'DM Mono',monospace"}}>
                <span>00</span><span>03</span><span>06</span><span>09</span><span>12</span><span>15</span><span>18</span><span>21</span><span>23</span>
              </div>
              <div style={{display:"flex",gap:12,marginTop:8,fontSize:10,color:"var(--text3)",alignItems:"center"}}>
                {[["var(--red)","Tinggi"],["var(--amber)","Sedang"],["var(--green)","Rendah"]].map(([c,l])=>(
                  <div key={l} style={{display:"flex",alignItems:"center",gap:4}}>
                    <div style={{width:10,height:10,borderRadius:2,background:c,opacity:.8}}/>
                    <span>{l}</span>
                  </div>
                ))}
              </div>
              {!hasHourData&&(
                <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:"var(--glass)",border:"1px solid var(--border)",fontSize:11.5,color:"var(--text3)",display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="clock" size={12} color="var(--text3)"/>
                  Data jam akan muncul untuk transaksi baru yang ditambahkan
                </div>
              )}
              {hasHourData&&peakHour2>=0&&(
                <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:"var(--red-dim)",border:"1px solid var(--red)",fontSize:12,color:"var(--red)",display:"flex",alignItems:"center",gap:8}}>
                  <Icon name="alertTriangle" size={12} color="var(--red)"/>
                  Paling boros jam <strong>{String(peakHour2).padStart(2,"0")}:00</strong> — total <strong>{fmt(hourMap2[peakHour2])}</strong>
                  {peakHour2>=21||peakHour2<5?" · ⚠ Belanja malam cenderung impulsif":""}
                </div>
              )}
            </div>

            <div className="card">
              <div className="sec-t">
                <span>Breakdown Kategori</span>
                <span style={{fontSize:11,color:"var(--text3)",fontWeight:400,textTransform:"none",letterSpacing:0}}>{sortedCats.length} kategori</span>
              </div>
              {sortedCats.length===0&&(
                <div style={{fontSize:12.5,color:"var(--text3)",textAlign:"center",padding:"20px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <Icon name="inbox" size={24} color="var(--text3)"/>
                  Belum ada pengeluaran bulan ini
                </div>
              )}
              {sortedCats.slice(0,6).map(([cat,amt],idx)=>{
                const pct=Math.round(amt/Math.max(expense,1)*100);
                const cc=CAT_COLORS[cat]||"#888";
                const isTop=idx===0;
                return(
                  <div key={cat} style={{marginBottom:idx<sortedCats.slice(0,6).length-1?14:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:5,fontSize:12.5}}>
                      <span style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:8,height:8,borderRadius:2,background:cc,display:"inline-block"}}/>
                        <span style={{color:"var(--text)",fontWeight:500}}>{CAT_NAMES[cat]||cat}</span>
                        {isTop&&<span style={{fontSize:9,padding:"1px 6px",borderRadius:99,background:`${cc}22`,color:cc,border:`1px solid ${cc}44`,fontFamily:"'DM Mono',monospace"}}>TERBESAR</span>}
                      </span>
                      <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:"var(--text2)"}}>{fmt(amt)} <span style={{color:cc,fontWeight:600}}>({pct}%)</span></span>
                    </div>
                    <div style={{height:5,background:"var(--glass2)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:cc,borderRadius:99,transition:"width .6s ease"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="sec-t"><span>Streak Bebas Impulsif</span></div>
              <div style={{display:"flex",alignItems:"center",gap:18,padding:"12px 0"}}>
                <div style={{width:64,height:64,borderRadius:16,background:streak>0?"var(--red-dim)":"var(--glass2)",border:`1px solid ${streak>0?"var(--red)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Icon name={streak>0?"flame":"sadFace"} size={30} color={streak>0?"var(--red)":"var(--text3)"}/>
                </div>
                <div>
                  <div style={{fontSize:34,fontWeight:700,letterSpacing:-2,lineHeight:1}}>{streak}</div>
                  <div style={{fontSize:12,color:"var(--text2)",marginTop:3}}>hari berturut-turut</div>
                  {streak>=7&&<div style={{fontSize:11,color:"var(--green)",marginTop:4,display:"flex",alignItems:"center",gap:5}}><Icon name="trophy" size={11} color="var(--green)"/>Luar biasa! Pertahankan!</div>}
                  {streak>=3&&streak<7&&<div style={{fontSize:11,color:"var(--amber)",marginTop:4}}>Bagus, terus lanjutkan!</div>}
                  {streak===0&&imps.length>0&&<div style={{fontSize:11,color:"var(--amber)",marginTop:4}}>Mulai streak hari ini!</div>}
                  {streak===0&&imps.length===0&&<div style={{fontSize:11,color:"var(--green)",marginTop:4}}>Belum ada data impulsif 🎉</div>}
                </div>
              </div>

              {(()=>{
                const milestones=[3,7,14,30];
                const next=milestones.find(m=>streak<m)||null;
                if(!next) return null;
                const prev=milestones[milestones.indexOf(next)-1]||0;
                const pct=Math.round((streak-prev)/(next-prev)*100);
                return(
                  <div style={{borderTop:"1px solid var(--border)",paddingTop:12,marginTop:4}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--text3)",marginBottom:6}}>
                      <span>Milestone berikutnya: <strong style={{color:"var(--text)"}}>{next} hari</strong></span>
                      <span>{next-streak} hari lagi</span>
                    </div>
                    <div style={{height:4,background:"var(--glass2)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:"var(--red)",borderRadius:99,transition:"width .6s"}}/>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="card">
              <div className="sec-t">
                <span>Transaksi Impulsif</span>
                <span style={{fontSize:11,color:imps.length>0?"var(--red)":"var(--green)",fontWeight:600,textTransform:"none",letterSpacing:0,background:imps.length>0?"var(--red-dim)":"var(--green-dim)",padding:"2px 8px",borderRadius:99,border:`1px solid ${imps.length>0?"var(--red)":"var(--green)"}`}}>{imps.length} total</span>
              </div>
              {imps.length===0?(
                <div style={{display:"flex",gap:10,alignItems:"center",padding:"20px 0",flexDirection:"column",color:"var(--green)"}}>
                  <Icon name="checkCircle" size={28} color="var(--green)"/>
                  <div style={{textAlign:"center"}}>
                    <div style={{fontSize:13,fontWeight:600}}>Tidak ada transaksi impulsif!</div>
                    <div style={{fontSize:11.5,color:"var(--text3)",marginTop:4}}>Kontrol keuanganmu luar biasa 👏</div>
                  </div>
                </div>
              ):(<>
                {imps.length>0&&(
                  <div style={{padding:"8px 12px",borderRadius:8,background:"var(--amber-dim)",border:"1px solid var(--amber)",fontSize:11.5,color:"var(--amber)",marginBottom:12,display:"flex",alignItems:"center",gap:7}}>
                    <Icon name="alertTriangle" size={12} color="var(--amber)"/>
                    Total kerugian impulsif: <strong style={{marginLeft:4}}>{fmt(imps.reduce((s,t)=>s+t.amount,0))}</strong>
                  </div>
                )}
                {imps.slice(0,5).map((t,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<Math.min(imps.length,5)-1?"1px solid var(--border)":"none"}}>
                    <div>
                      <div style={{fontSize:12.5,fontWeight:500,color:"var(--text)"}}>{t.desc||"Transaksi"}</div>
                      <div style={{fontSize:10,color:"var(--text3)",marginTop:2,display:"flex",gap:6,alignItems:"center"}}>
                        <span>{t.date||"—"}</span>
                        <span style={{width:3,height:3,borderRadius:"50%",background:"var(--text3)",display:"inline-block"}}/>
                        <span>{CAT_NAMES[t.cat]||t.cat}</span>
                      </div>
                    </div>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11.5,color:"var(--red)",fontWeight:600}}>-{fmt(t.amount)}</span>
                  </div>
                ))}
                {imps.length>5&&(
                  <div style={{textAlign:"center",padding:"8px 0",fontSize:11.5,color:"var(--text3)"}}>+{imps.length-5} transaksi lainnya</div>
                )}
              </>)}
            </div>
          </div>
        </div>
      )}

      {activeTab==="goals"&&(
        <div className="two-col">
          <div>
            <div className="card" style={{marginBottom:16}}>
              <div className="sec-t">
                <span>Target Keuangan</span>
                <span style={{fontSize:11,color:"var(--text3)",fontWeight:400,textTransform:"none",letterSpacing:0}}>{goals.filter(g=>g.done).length}/{goals.length} tercapai</span>
              </div>
              {goals.map((g,i)=>{
                const pct=Math.min(Math.round(g.current/g.target*100),100);
                return(
                  <div key={i} style={{marginBottom:i<goals.length-1?18:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:28,height:28,borderRadius:8,background:g.done?`${g.color}18`:"var(--glass2)",border:`1px solid ${g.done?g.color:"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                          <Icon name={g.icon} size={13} color={g.done?g.color:"var(--text3)"}/>
                        </div>
                        <span style={{fontSize:12.5,fontWeight:500,color:g.done?"var(--text)":"var(--text2)"}}>{g.label}</span>
                      </div>
                      {g.done
                        ?<span style={{fontSize:9,fontFamily:"'DM Mono',monospace",color:"var(--green)",background:"var(--green-dim)",border:"1px solid var(--green)",padding:"2px 8px",borderRadius:99}}>SELESAI</span>
                        :<span style={{fontFamily:"'DM Mono',monospace",fontSize:10.5,color:"var(--text3)"}}>{g.current}/{g.target} {g.unit}</span>
                      }
                    </div>
                    <div style={{height:5,background:"var(--glass2)",borderRadius:99,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:g.done?"var(--green)":g.color,borderRadius:99,transition:"width .7s ease"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="card">
              <div className="sec-t"><span>Saran Personal</span></div>
              {tips.slice(0,3).map((tip,i)=>(
                <div key={i} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:i<2?"1px solid var(--border)":"none",alignItems:"flex-start"}}>
                  <div style={{width:22,height:22,borderRadius:"50%",background:"var(--accent)",color:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9.5,fontWeight:700,flexShrink:0,marginTop:1}}>{i+1}</div>
                  <span style={{fontSize:12.5,color:"var(--text2)",lineHeight:1.65}}>{tip}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="card">
              <div className="sec-t"><span>Skor Per Dimensi</span></div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                {dims.map(d=>{
                  const pct=Math.round(d.v);
                  return(
                    <div key={d.n} style={{display:"flex",gap:14,alignItems:"center"}}>
                      <DNARing score={pct} size={52} strokeWidth={4}/>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12.5,fontWeight:500,marginBottom:4}}>{d.n}</div>
                        <div style={{fontSize:11,color:"var(--text3)",lineHeight:1.5}}>{pct>=70?"Baik — pertahankan!":pct>=45?"Cukup — bisa ditingkatkan":"Perlu perhatian lebih"}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab==="simulator"&&(
        <div className="two-col">
          <div>
            <div className="card" style={{marginBottom:16}}>
              <div className="sec-t">
                <span style={{display:"flex",alignItems:"center",gap:7}}>
                  <Icon name="lightbulb" size={13} color="var(--amber)"/>Simulasi "Bagaimana Jika"
                </span>
              </div>
              <div style={{fontSize:12.5,color:"var(--text2)",marginBottom:18,lineHeight:1.6,padding:"10px 12px",background:"var(--glass)",borderRadius:10,border:"1px solid var(--border)"}}>
                Geser slider untuk melihat berapa yang bisa kamu hemat jika mengurangi pengeluaran di kategori tertentu.
              </div>
              {[
                {label:"Belanja",  icon:"shop",     val:simShopping,  set:setSimShopping,  spend:shopSpend,    color:"#C084FC"},
                {label:"Hiburan", icon:"entertain", val:simEntertain, set:setSimEntertain, spend:entertainSpend,color:"#FBBF24"},
                {label:"Makanan", icon:"food",      val:simFood,      set:setSimFood,      spend:foodSpend,    color:"#FF7043"},
              ].map((s,i)=>(
                <div key={i} style={{marginBottom:i<2?20:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <Icon name={s.icon} size={14} color={s.color}/>
                      <span style={{fontSize:13,fontWeight:500}}>{s.label}</span>
                      <span style={{fontSize:10,color:"var(--text3)",fontFamily:"'DM Mono',monospace"}}>({fmt(s.spend)})</span>
                    </div>
                    <span style={{fontSize:12,fontWeight:600,color:"var(--green)",fontFamily:"'DM Mono',monospace",minWidth:70,textAlign:"right"}}>
                      {s.val>0?`+${fmt(s.spend*(s.val/100))}`:"—"}
                    </span>
                  </div>
                  <input type="range" min={0} max={100} step={5} value={s.val}
                    onChange={e=>s.set(Number(e.target.value))} className="sim-slider"/>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:9,color:"var(--text3)",fontFamily:"'DM Mono',monospace",marginTop:3}}>
                    <span>0%</span><span>kurangi {s.val}%</span><span>100%</span>
                  </div>
                </div>
              ))}
              {simSaved>0&&(
                <div style={{marginTop:20,padding:"16px",borderRadius:12,background:"var(--green-dim)",border:"1px solid var(--green)",display:"flex",alignItems:"center",gap:14}}>
                  <div style={{width:44,height:44,borderRadius:12,background:"var(--green-dim)",border:"1px solid var(--green)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <Icon name="moneyBag" size={22} color="var(--green)"/>
                  </div>
                  <div>
                    <div style={{fontSize:11.5,color:"var(--green)",fontWeight:600,marginBottom:4,fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".06em"}}>Potensi hemat/bulan</div>
                    <div style={{fontSize:24,fontWeight:700,letterSpacing:-1,color:"var(--green)"}}>{fmt(simSaved)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            <div className="card" style={{marginBottom:14}}>
              <div className="sec-t">
                <span style={{display:"flex",alignItems:"center",gap:7}}>
                  <Icon name="barChart" size={13} color="var(--text2)"/>Proyeksi Tabungan
                </span>
              </div>
              <div style={{fontSize:12.5,color:"var(--text2)",marginBottom:14}}>
                Kalau kamu hemat <span style={{color:"var(--green)",fontWeight:600}}>{fmt(simSaved)}</span>/bulan:
              </div>
              {[3,6,12].map((m,i)=>(
                <div key={m} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?"1px solid var(--border)":"none"}}>
                  <div>
                    <div style={{fontSize:12.5,color:"var(--text)"}}>{m} bulan ke depan</div>
                    <div style={{fontSize:10,color:"var(--text3)",marginTop:1}}>{new Date(new Date().setMonth(new Date().getMonth()+m)).toLocaleDateString("id-ID",{month:"long",year:"numeric"})}</div>
                  </div>
                  <span style={{fontFamily:"'DM Mono',monospace",fontWeight:700,fontSize:14,color:simSaved>0?"var(--green)":"var(--text3)"}}>{fmt(simSaved*m)}</span>
                </div>
              ))}
              {simSaved===0&&(
                <div style={{fontSize:12,color:"var(--text3)",textAlign:"center",padding:"16px 0",display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                  <Icon name="lightbulb" size={22} color="var(--text3)"/>
                  Geser slider di kiri untuk melihat proyeksi
                </div>
              )}
            </div>
            <div className="card">
              <div className="sec-t"><span>Pengeluaran Saat Ini</span></div>
              {sortedCats.slice(0,4).map(([cat,amt],i)=>{
                const pct=Math.round(amt/Math.max(expense,1)*100);
                const cc=CAT_COLORS[cat]||"#888";
                return(
                  <div key={cat} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<Math.min(sortedCats.length,4)-1?"1px solid var(--border)":"none",fontSize:13}}>
                    <div style={{display:"flex",alignItems:"center",gap:7}}>
                      <span style={{width:8,height:8,borderRadius:2,background:cc,display:"inline-block"}}/>
                      <span style={{color:"var(--text2)"}}>{CAT_NAMES[cat]||cat}</span>
                    </div>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11.5,color:"var(--text)",fontWeight:500}}>{fmt(amt)} <span style={{color:cc}}>({pct}%)</span></span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
// FinBot — Full Page AI Chat
// ═══════════════════════════════════════════════════
function FinBotPage({txns, user, prediction}){
  const income  = txns.filter(t=>t.type==="income").reduce((s,t)=>s+t.amount,0);
  const expense = txns.filter(t=>t.type==="expense").reduce((s,t)=>s+t.amount,0);
  const balance = income-expense;
  const imps    = txns.filter(t=>t.imp);
  const impAmt  = imps.reduce((s,t)=>s+t.amount,0);
  const dna     = prediction?.dna?.total_score||72;
  const dnaType = prediction?.dna?.type_label||"Balanced Planner";
  const userName= user?.name||"Pengguna";

  const SUGGESTIONS = [
    // Analisis keuangan
    "Gimana kondisi keuanganku bulan ini?",
    "Kategori mana yang paling boros?",
    "Prediksi saldo akhir bulan aku gimana?",
    "Berapa rata-rata pengeluaran harianku?",
    // Tips & strategi
    "Tips berhemat buat aku yang sering impulsif",
    "Strategi nabung yang cocok buat aku",
    "Cara mengurangi pengeluaran tidak perlu",
    "Bagaimana cara mulai investasi dengan saldo sekarang?",
    // DNA & perilaku
    "Apa arti Financial DNA skorku?",
    "Kenapa aku sering belanja impulsif?",
    "Gimana cara ningkatin skor DNA-ku?",
    "Apakah pengeluaranku sudah sehat?",
  ];

  const makeWelcome = () => ({
    role:"assistant",
    content:`Halo ${userName.split(" ")[0]}! Aku **NaviBot** — asisten keuangan AI kamu di NaviKas.

Aku udah lihat profil keuanganmu. Kamu punya **${imps.length} transaksi impulsif** bulan ini dan saldo bersih **${fmt(balance)}**. Ada yang mau kamu tanyain?`,
    time: new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"})
  });

  // History sesi — persist ke localStorage
  const STORAGE_KEY = "fintrack_finbot_sessions";
  const ACTIVE_KEY  = "fintrack_finbot_active";

  const [sessions, setSessions] = useState(()=>{
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if(saved) {
        const parsed = JSON.parse(saved);
        if(parsed.length>0) return parsed;
      }
    } catch{}
    return [{id:1, title:"Sesi Baru", msgs:[makeWelcome()], time: new Date()}];
  });

  const [activeId, setActiveId] = useState(()=>{
    try {
      const saved = localStorage.getItem(ACTIVE_KEY);
      if(saved) return JSON.parse(saved);
    } catch{}
    return 1;
  });

  // Simpan ke localStorage setiap kali sessions/activeId berubah
  useEffect(()=>{
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions)); } catch{}
  },[sessions]);
  useEffect(()=>{
    try { localStorage.setItem(ACTIVE_KEY, JSON.stringify(activeId)); } catch{}
  },[activeId]);

  const [showHistory, setShowHistory] = useState(false);
  const [isMobile, setIsMobile] = useState(()=>typeof window!=="undefined"&&window.innerWidth<=640);
  useEffect(()=>{
    const check=()=>setIsMobile(window.innerWidth<=640);
    window.addEventListener("resize",check);
    return()=>window.removeEventListener("resize",check);
  },[]);

  const activeSession = sessions.find(s=>s.id===activeId) || sessions[0];
  const msgs = activeSession.msgs;
  const setMsgs = (updater) => {
    setSessions(prev=>prev.map(s=>{
      if(s.id!==activeId) return s;
      const newMsgs = typeof updater==="function" ? updater(s.msgs) : updater;
      // Auto-update judul sesi dari pesan user pertama
      const firstUser = newMsgs.find(m=>m.role==="user");
      const title = firstUser ? firstUser.content.slice(0,35)+(firstUser.content.length>35?"…":"") : s.title;
      return {...s, msgs:newMsgs, title, time:new Date()};
    }));
  };

  const newSession = () => {
    const id = Date.now();
    setSessions(prev=>[{id, title:"Sesi Baru", msgs:[makeWelcome()], time:new Date()}, ...prev]);
    setActiveId(id);
    setShowHistory(false);
  };

  const deleteSession = (id, e) => {
    e.stopPropagation();
    setSessions(prev=>{
      const next = prev.filter(s=>s.id!==id);
      if(next.length===0){
        const newId=Date.now();
        return [{id:newId,title:"Sesi Baru",msgs:[makeWelcome()],time:new Date()}];
      }
      return next;
    });
    if(activeId===id){
      setSessions(prev=>{
        const next=prev.filter(s=>s.id!==id);
        if(next.length>0) setActiveId(next[0].id);
        return prev;
      });
    }
  };

  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const endRef  = useRef(null);
  const inputRef= useRef(null);
  const sugRef  = useRef(null);
  const dragRef = useRef({dragging:false,startX:0,scrollLeft:0});

  const onSugPointerDown = (e) => {
    const el = sugRef.current; if(!el) return;
    dragRef.current = {dragging:true, startX:e.clientX||e.touches?.[0]?.clientX||0, scrollLeft:el.scrollLeft};
    el.style.cursor="grabbing";
  };
  const onSugPointerMove = (e) => {
    if(!dragRef.current.dragging) return;
    const el = sugRef.current; if(!el) return;
    const x = e.clientX||(e.touches?.[0]?.clientX||0);
    el.scrollLeft = dragRef.current.scrollLeft - (x - dragRef.current.startX);
  };
  const onSugPointerUp = () => {
    dragRef.current.dragging=false;
    if(sugRef.current) sugRef.current.style.cursor="grab";
  };

  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"})},[msgs]);

  const GEMINI_BACKEND_URL = "http://localhost:8000/api/finbot";

  const send = async(text) => {
    const q = (text||input).trim();
    if(!q || loading) return;
    setInput("");
    const now = new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
    const newMsgs = [...msgs, {role:"user", content:q, time:now}];
    setMsgs(newMsgs);
    setLoading(true);

    try {
      const token = localStorage.getItem("fintrack_token");
      const res = await fetch(GEMINI_BACKEND_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: newMsgs.map(m => ({role: m.role, content: m.content})),
          context: {
            userName, dnaType, dna, balance, income, expense,
            impsCount: imps.length, impAmt, txnCount: txns.length,
            predictedBalance: prediction?.predicted_balance ?? null,
            riskLevel: prediction?.risk_level || "low",
          }
        }),
      });
      const data = await res.json();
      const reply = data?.reply || "Maaf, NaviBot lagi gangguan. Coba lagi ya!";
      const replyTime = new Date().toLocaleTimeString("id-ID",{hour:"2-digit",minute:"2-digit"});
      setMsgs(p=>[...p,{role:"assistant",content:reply,time:replyTime}]);
    } catch {
      setMsgs(p=>[...p,{role:"assistant",content:"Waduh, koneksi ke server terputus. Pastikan backend Python sudah jalan!"}]);
    } finally {
      setLoading(false);
      setTimeout(()=>inputRef.current?.focus(), 100);
    }
  };
  
  const renderText = (text) => {
    return text.split("\n").map((line, li) => {
      if(!line.trim()) return <br key={li}/>;
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={li} style={{display:"block",marginBottom:2}}>
          {parts.map((p,i)=>p.startsWith("**")&&p.endsWith("**")
            ?<strong key={i} style={{color:"var(--text)",fontWeight:700}}>{p.slice(2,-2)}</strong>
            :<span key={i}>{p}</span>
          )}
        </span>
      );
    });
  };

  return(
    <div className="page fi-a" style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden",padding:0,margin:0,minHeight:0}}>

      <div className="ph" style={{marginBottom:0,flexShrink:0,padding:"14px 20px",borderBottom:"1px solid var(--border)"}}>
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button onClick={()=>setShowHistory(p=>!p)} style={{width:36,height:36,borderRadius:10,background:"var(--glass2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}}>
            <Icon name="list" size={16} color="var(--text2)"/>
          </button>
          <div className="finbot-avatar-pulse" style={{flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:"linear-gradient(135deg,var(--grad1),var(--grad2))",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Icon name="bot" size={18} color="var(--bg)"/>
            </div>
          </div>
          <div>
            <div className="pt" style={{fontSize:17}}>NaviBot AI</div>
            <div className="ps" style={{display:"flex",alignItems:"center",gap:5,fontSize:11}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:"var(--green)",display:"inline-block"}}/>
              <span className="finbot-status-text">Online · Asisten Keuangan Pribadi</span>
              <span className="finbot-status-mini" style={{display:"none"}}>
                <span style={{color:balance>=0?"var(--green)":"var(--red)",fontWeight:600}}>{fmtK(balance)}</span>
                <span style={{color:"var(--text3)"}}> · DNA {dna}</span>
              </span>
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <div className="finbot-header-stats card" style={{padding:"6px 12px",display:"flex",gap:14}}>
            {[
              {l:"Saldo",v:fmtK(balance),c:balance>=0?"var(--green)":"var(--red)"},
              {l:"Impulsif",v:`${imps.length}x`,c:"var(--amber)"},
              {l:"DNA",v:`${dna}/100`,c:"var(--text)"},
            ].map((s,i)=>(
              <div key={i} style={{textAlign:"center"}}>
                <div style={{fontSize:8.5,color:"var(--text3)",fontFamily:"'DM Mono',monospace",textTransform:"uppercase",letterSpacing:".08em"}}>{s.l}</div>
                <div style={{fontSize:12,fontWeight:700,color:s.c,marginTop:1}}>{s.v}</div>
              </div>
            ))}
          </div>
          <button onClick={newSession} className="finbot-header-newchat" style={{padding:"6px 12px",borderRadius:8,background:"var(--glass2)",border:"1px solid var(--border)",color:"var(--text2)",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
            <Icon name="plus" size={12} color="var(--text2)"/><span>Chat Baru</span>
          </button>
        </div>
      </div>

      <div style={{display:"flex",flex:1,overflow:"hidden",position:"relative"}}>

        {showHistory&&(
          <>

            {isMobile&&(
              <div onClick={()=>setShowHistory(false)} style={{
                position:"fixed",inset:0,zIndex:55,
                background:"rgba(0,0,0,0.5)",
                backdropFilter:"blur(3px)",WebkitBackdropFilter:"blur(3px)"
              }}/>
            )}
            <div style={{
              ...(isMobile ? {
                position:"fixed",top:0,left:0,bottom:0,zIndex:60,
                width:"82vw",maxWidth:"300px",
                boxShadow:"6px 0 40px rgba(0,0,0,0.4)",
              } : {
                width:260,flexShrink:0,
              }),
              background:"var(--surface)",
              borderRight:"1px solid var(--border)",
              display:"flex",flexDirection:"column",overflow:"hidden",
            }}>
              <div style={{padding:"12px 14px",borderBottom:"1px solid var(--border)",fontSize:11,fontFamily:"'DM Mono',monospace",color:"var(--text3)",textTransform:"uppercase",letterSpacing:".08em",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>Riwayat Chat</span>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{color:"var(--text3)",fontSize:10}}>{sessions.length} sesi</span>
                  {isMobile&&(
                    <button onClick={()=>setShowHistory(false)} style={{width:24,height:24,borderRadius:6,background:"var(--glass2)",border:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                      <Icon name="close" size={12} color="var(--text2)"/>
                    </button>
                  )}
                </div>
              </div>
              <div style={{flex:1,overflowY:"auto",padding:"8px"}}>
                {sessions.map(s=>(
                  <div key={s.id} onClick={()=>{setActiveId(s.id);setShowHistory(false);}}
                    style={{padding:"10px 12px",borderRadius:10,marginBottom:4,cursor:"pointer",
                      background:s.id===activeId?"var(--accent-dim)":"transparent",
                      border:`1px solid ${s.id===activeId?"var(--accent)":"transparent"}`,
                      display:"flex",alignItems:"center",gap:8,transition:"all .15s"}}
                    onMouseEnter={e=>{ if(s.id!==activeId) e.currentTarget.style.background="var(--glass2)"; }}
                    onMouseLeave={e=>{ if(s.id!==activeId) e.currentTarget.style.background="transparent"; }}
                  >
                    <div style={{width:28,height:28,borderRadius:8,background:"linear-gradient(135deg,var(--grad1),var(--grad2))",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <Icon name="bot" size={13} color="var(--bg)"/>
                    </div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:12,fontWeight:500,color:s.id===activeId?"var(--accent)":"var(--text)",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{s.title}</div>
                      <div style={{fontSize:10,color:"var(--text3)",marginTop:2}}>
                        {s.msgs.length-1} pesan · {new Date(s.time).toLocaleDateString("id-ID",{day:"numeric",month:"short"})}
                      </div>
                    </div>
                    {sessions.length>1&&(
                      <button onClick={(e)=>deleteSession(s.id,e)}
                        title="Hapus sesi"
                        style={{padding:"3px 5px",borderRadius:6,background:"transparent",border:"none",cursor:"pointer",color:"var(--text3)",flexShrink:0,display:"flex",alignItems:"center",opacity:isMobile?1:0,transition:"opacity .15s"}}
                        onMouseEnter={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.color="var(--red)";}}
                        onMouseLeave={e=>{e.currentTarget.style.opacity=isMobile?"1":"0";e.currentTarget.style.color="var(--text3)";}}>
                        <Icon name="trash" size={11} color="currentColor"/>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
          <div className="finbot-msgs" style={{padding:"16px 20px"}}>
            {msgs.map((m,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.role==="user"?"flex-end":"flex-start",gap:3}}>
                {m.role==="assistant"&&(
                  <div style={{display:"flex",alignItems:"center",gap:7,marginLeft:2}}>
                    <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,var(--grad1),var(--grad2))",display:"flex",alignItems:"center",justifyContent:"center"}}>
                      <Icon name="bot" size={11} color="var(--bg)"/>
                    </div>
                    <span style={{fontSize:10.5,color:"var(--text3)",fontFamily:"'DM Mono',monospace"}}>NaviBot</span>
                    {m.time&&<span style={{fontSize:10,color:"var(--text3)"}}>{m.time}</span>}
                  </div>
                )}
                <div className={m.role==="user"?"finbot-bubble-user":"finbot-bubble-bot"}>
                  {m.role==="assistant"?renderText(m.content):m.content}
                </div>
                {m.role==="user"&&(
                  <div style={{display:"flex",gap:6,alignItems:"center",marginRight:2}}>
                    {m.time&&<span style={{fontSize:10,color:"var(--text3)"}}>{m.time}</span>}
                    <span style={{fontSize:10.5,color:"var(--text3)",fontFamily:"'DM Mono',monospace"}}>Kamu</span>
                  </div>
                )}
              </div>
            ))}
            {loading&&(
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <div style={{width:22,height:22,borderRadius:"50%",background:"linear-gradient(135deg,var(--grad1),var(--grad2))",display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <Icon name="bot" size={11} color="var(--bg)"/>
                </div>
                <div className="finbot-bubble-bot" style={{display:"flex",gap:5,alignItems:"center",padding:"9px 13px"}}>
                  {[0,1,2].map(i=>(
                    <span key={i} style={{width:6,height:6,borderRadius:"50%",background:"var(--accent)",display:"inline-block",animation:`typingBounce 1.2s ease-in-out ${i*0.18}s infinite`}}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef}/>
          </div>

          <div className="finbot-suggestions-wrap" style={{padding:"8px 20px 0"}}>
            <div className="finbot-sug-label">Saran Pertanyaan:</div>
            <div ref={sugRef} className="finbot-suggestions"
              onMouseDown={onSugPointerDown}
              onMouseMove={onSugPointerMove}
              onMouseUp={onSugPointerUp}
              onMouseLeave={onSugPointerUp}
              onTouchStart={onSugPointerDown}
              onTouchMove={onSugPointerMove}
              onTouchEnd={onSugPointerUp}
            >
              {SUGGESTIONS.map((s,i)=>(
                <button key={i} className="finbot-sug-chip" onClick={()=>!dragRef.current.dragging&&send(s)} disabled={loading}>{s}</button>
              ))}
            </div>
          </div>

          <div className="finbot-input-row" style={{flexShrink:0,paddingBottom:20,padding:"10px 20px 20px"}}>
            <input
              ref={inputRef}
              className="fi"
              style={{flex:1,fontSize:13.5,padding:"12px 16px"}}
              placeholder="Tanya soal keuanganmu… (Enter untuk kirim)"
              value={input}
              onChange={e=>setInput(e.target.value)}
              onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}}
              disabled={loading}
            />
            <button className="btn btn-p" onClick={()=>send()} disabled={loading||!input.trim()}
              style={{padding:"12px 20px",display:"flex",alignItems:"center",gap:8}}>
              <Icon name="send" size={14} color="currentColor"/>
              {loading?"...":"Kirim"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Settings({toast,isDark,setIsDark,user,onUpdateProfile,txns,prediction,onResetData}){
  const initTogs=()=>{
    try{ return JSON.parse(localStorage.getItem("ft_togs"))||{notif:true,imp:true,pred:false,wk:true}; }
    catch{ return {notif:true,imp:true,pred:false,wk:true}; }
  };
  const [togs,setTogs]=useState(initTogs);
  const tog=k=>{
    setTogs(p=>{
      const next={...p,[k]:!p[k]};
      localStorage.setItem("ft_togs",JSON.stringify(next));
      return next;
    });
  };

  const [prof,setProf]=useState({name:user?.name||"",email:user?.email||"",budget:user?.budget||"8000000"});
  const [saving,setSaving]=useState(false);
  useEffect(()=>{if(user)setProf(p=>({...p,name:user.name||"",email:user.email||"",budget:user.budget||p.budget}))},[user]);

  const saveProfile=async()=>{
    if(!prof.name.trim()){toast("Nama tidak boleh kosong","error");return;}
    const bud=parseFloat(prof.budget);
    if(isNaN(bud)||bud<0){toast("Budget tidak valid","error");return;}
    setSaving(true);
    try{
      await onUpdateProfile({name: prof.name.trim(), budget: bud});
      toast("Profil berhasil disimpan","success");
    }catch(e){
      const detail=e?.response?.data?.detail||e?.response?.data?.message||e?.message||"";
      toast(detail?`Gagal: ${detail}`:"Gagal menyimpan profil","error");
    }finally{setSaving(false);}
  };

  const [pw,setPw]=useState({cur:"",next:"",conf:""});
  const [pwSaving,setPwSaving]=useState(false);
  const [showPw,setShowPw]=useState({cur:false,next:false,conf:false});

  const updatePassword=async()=>{
    if(!pw.cur){toast("Masukkan password saat ini","error");return;}
    if(pw.next.length<8){toast("Password baru minimal 8 karakter","error");return;}
    if(pw.next!==pw.conf){toast("Konfirmasi password tidak cocok","error");return;}
    setPwSaving(true);
    try{
      await new Promise(r=>setTimeout(r,800));
      setPw({cur:"",next:"",conf:""});
      toast("Fitur ganti password belum tersedia","warn");
    }catch(e){
      toast("Gagal mengubah password","error");
    }finally{setPwSaving(false);}
  };

  const handleExportPDF=()=>{
    exportToPDF(txns,user,prediction);
    toast("Membuka preview laporan PDF...","success");
  };
  const handleExportCSV=()=>{
    if(txns.length===0){toast("Belum ada transaksi untuk diekspor","warn");return;}
    const header="Tanggal,Waktu,Deskripsi,Kategori,Jenis,Jumlah,Impulsif";
    const rows=txns.map(t=>
      `${t.date},${t.time},"${(t.desc||"").replace(/"/g,"\"")}",${CM[t.cat]?.name||t.cat},${t.type},${t.amount},${t.imp?"Ya":"Tidak"}`
    ).join("\n");
    const blob=new Blob([header+"\n"+rows],{type:"text/csv;charset=utf-8;"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=`fintrack_${currentMonth()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast(`${txns.length} transaksi berhasil diekspor ke CSV`,"success");
  };

  const [showReset,setShowReset]=useState(false);
  const [resetLoading,setResetLoading]=useState(false);
  const doReset=async()=>{
    setResetLoading(true);
    try{
      await Promise.all(txns.map(t=>transactionAPI.remove(t.id)));
      onResetData&&onResetData();
      setShowReset(false);
      toast("Semua data berhasil direset","success");
    }catch{
      toast("Gagal mereset data","error");
    }finally{setResetLoading(false);}
  };

  return(
    <div className="page fi-a">
      <div className="ph"><div><div className="pt">Pengaturan</div><div className="ps">Kelola profil & preferensi aplikasi</div></div></div>
      <div className="two-col">
        <div>
          <div className="card" style={{marginBottom:16}}>
            <div className="sec-t"><span>Profil</span></div>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
              <div className="ava" style={{width:48,height:48,fontSize:16}}>{initials(prof.name)}</div>
              <div>
                <div style={{fontWeight:600,marginBottom:2}}>{prof.name||"—"}</div>
                <div style={{fontSize:12,color:"var(--text3)"}}>{prof.email}</div>
              </div>
            </div>
            <div className="fg">
              <label className="fl">Nama Lengkap</label>
              <input className="fi" value={prof.name} onChange={e=>setProf(p=>({...p,name:e.target.value}))} placeholder="Nama lengkap"/>
            </div>
            <div className="fg">
              <label className="fl">Email</label>
              <input className="fi" type="email" value={prof.email} disabled style={{opacity:.5,cursor:"not-allowed"}}/>
            </div>
            <div className="fg" style={{marginBottom:0}}>
              <label className="fl">Budget Bulanan (Rp)</label>
              <input className="fi" type="number" min="0" value={prof.budget} onChange={e=>setProf(p=>({...p,budget:e.target.value}))} placeholder="Contoh: 5000000"/>
            </div>
            <button className="btn btn-p btn-sm" style={{marginTop:14}} onClick={saveProfile} disabled={saving}>
              {saving?<><span className="loading-spin"/>Menyimpan...</>:"Simpan Perubahan"}
            </button>
          </div>

          <div className="card">
            <div className="sec-t"><span>Keamanan</span></div>
            {[
              {k:"cur",  lbl:"Password Saat Ini",   ph:"Masukkan password saat ini"},
              {k:"next", lbl:"Password Baru",        ph:"Min. 8 karakter"},
              {k:"conf", lbl:"Konfirmasi Password",  ph:"Ulangi password baru"},
            ].map(({k,lbl,ph},i)=>(
              <div className="fg" key={k} style={i===2?{marginBottom:0}:{}}>
                <label className="fl">{lbl}</label>
                <div style={{position:"relative"}}>
                  <input className="fi" type={showPw[k]?"text":"password"}
                    value={pw[k]} placeholder={ph}
                    onChange={e=>setPw(p=>({...p,[k]:e.target.value}))}
                    style={{paddingRight:40}}
                  />
                  <span onClick={()=>setShowPw(p=>({...p,[k]:!p[k]}))}
                    style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",
                      cursor:"pointer",color:"var(--text3)",fontSize:12,userSelect:"none"}}>
                    {showPw[k]?"Semb.":"Lihat"}
                  </span>
                </div>
                {k==="next"&&pw.next.length>0&&pw.next.length<8&&(
                  <div style={{fontSize:10,color:"var(--red)",marginTop:4}}>Minimal 8 karakter</div>
                )}
                {k==="conf"&&pw.conf.length>0&&pw.next!==pw.conf&&(
                  <div style={{fontSize:10,color:"var(--red)",marginTop:4}}>Password tidak cocok</div>
                )}
              </div>
            ))}
            <button className="btn btn-g btn-sm" style={{marginTop:14}} onClick={updatePassword} disabled={pwSaving}>
              {pwSaving?<><span className="loading-spin"/>Mengubah...</>:"Update Password"}
            </button>
          </div>
        </div>

        <div>
          <div className="card card-glow" style={{marginBottom:14}}>
            <div className="sec-t"><span>Tema Tampilan</span></div>
            <div style={{display:"flex",gap:10}}>
              {[
                {dark:true,  icon:"moon", label:"Dark Mode",  desc:"Gelap & elegan"},
                {dark:false, icon:"sun",  label:"Light Mode", desc:"Terang & bersih"},
              ].map(({dark,icon,label,desc})=>(
                <div key={label} onClick={()=>setIsDark(dark)}
                  style={{flex:1,padding:"14px",borderRadius:12,
                    background:isDark===dark?"var(--accent-dim)":"var(--glass)",
                    border:`1.5px solid ${isDark===dark?"var(--border2)":"var(--border)"}`,
                    cursor:"pointer",textAlign:"center",transition:"all .15s"}}>
                  <div style={{display:"flex",justifyContent:"center",marginBottom:8}}>
                    <Icon name={icon} size={22} color={isDark===dark?"var(--accent)":"var(--text3)"}/>
                  </div>
                  <div style={{fontSize:12.5,fontWeight:600,color:isDark===dark?"var(--accent)":"var(--text2)"}}>{label}</div>
                  <div style={{fontSize:10.5,color:"var(--text3)",marginTop:2}}>{desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{marginBottom:14}}>
            <div className="sec-t"><span>Notifikasi</span></div>
            {[
              {k:"notif",l:"Notifikasi Harian",    d:"Ringkasan pengeluaran tiap hari"},
              {k:"imp",  l:"Alert Impulsif",       d:"Peringatan saat transaksi impulsif"},
              {k:"pred", l:"Prediksi Akhir Bulan", d:"Risiko keuangan mingguan"},
              {k:"wk",   l:"Laporan Mingguan",     d:"Ringkasan setiap Senin"},
            ].map(sw=>(
              <div className="sw-row" key={sw.k}>
                <div>
                  <div style={{fontSize:13,fontWeight:500}}>{sw.l}</div>
                  <div style={{fontSize:11,color:"var(--text3)",marginTop:2}}>{sw.d}</div>
                </div>
                <div className={`tog${togs[sw.k]?" on":""}`} onClick={()=>tog(sw.k)}/>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="sec-t"><span>Data & Privasi</span></div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid var(--border)"}}>
              <div>
                <div style={{fontSize:13,color:"var(--text)"}}>Export data CSV</div>
                <div style={{fontSize:10.5,color:"var(--text3)",marginTop:2}}>{txns.length} transaksi tersedia</div>
              </div>
              <button className="btn btn-g btn-sm" onClick={handleExportCSV} style={{display:"flex",alignItems:"center",gap:6}}>
                <Icon name="download" size={12} color="currentColor"/>Export
              </button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:"1px solid var(--border)"}}>
              <div>
                <div style={{fontSize:13,color:"var(--text)"}}>Export laporan PDF</div>
                <div style={{fontSize:10.5,color:"var(--text3)",marginTop:2}}>Laporan bulan ini</div>
              </div>
              <button className="btn btn-g btn-sm" onClick={handleExportPDF} style={{display:"flex",alignItems:"center",gap:6}}>
                <Icon name="filePdf" size={12} color="currentColor"/>Export
              </button>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0"}}>
              <div>
                <div style={{fontSize:13,color:"var(--text)"}}>Reset semua data</div>
                <div style={{fontSize:10.5,color:"var(--text3)",marginTop:2}}>Hapus seluruh transaksi</div>
              </div>
              <button className="btn btn-d btn-sm" onClick={()=>setShowReset(true)} style={{display:"flex",alignItems:"center",gap:6}}>
                <Icon name="alertTriangle" size={12} color="currentColor"/>Reset
              </button>
            </div>
          </div>
        </div>
      </div>

      {showReset&&(
        <div className="modal-ov" onClick={e=>{if(e.target===e.currentTarget)setShowReset(false)}}>
          <div className="modal">
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{width:40,height:40,borderRadius:10,background:"var(--red-dim)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <Icon name="alertTriangle" size={20} color="var(--red)"/>
              </div>
              <div>
                <div className="m-title" style={{fontSize:17}}>Reset Semua Data?</div>
                <div className="m-sub" style={{marginBottom:0}}>Tindakan ini tidak bisa dibatalkan</div>
              </div>
            </div>
            <div style={{background:"var(--red-dim)",border:"1px solid var(--red)",borderRadius:10,padding:"12px 14px",fontSize:12.5,color:"var(--red)",lineHeight:1.6,marginBottom:16}}>
              Seluruh <strong>{txns.length} transaksi</strong> akan dihapus permanen dari akun Anda. Data yang sudah dihapus tidak dapat dipulihkan.
            </div>
            <div className="m-foot">
              <button className="btn btn-g btn-sm" onClick={()=>setShowReset(false)} disabled={resetLoading}>Batal</button>
              <button className="btn btn-d btn-sm" onClick={doReset} disabled={resetLoading}>
                {resetLoading?<><span className="loading-spin"/>Menghapus...</>:<><Icon name="alertTriangle" size={12} color="currentColor"/>Ya, Reset Semua</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default function App(){
  const [view,     setView]     = useState("landing");
  const [page,     setPage]     = useState("dashboard");
  const [txns,     setTxns]     = useState([]);
  const [showAdd,  setShowAdd]  = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [isDark,   setIsDark]   = useState(false);
  const [loadingTxn,  setLoadingTxn]  = useState(false);
  const [loadingAdd,  setLoadingAdd]  = useState(false);
  const [prediction,  setPrediction]  = useState(null);
  const [loadingPred, setLoadingPred] = useState(false);
  const [user,     setUser]     = useState(null);

  const storeToken   = useStore(s=>s.token);
  const storeUser    = useStore(s=>s.user);
  const storeSetUser = useStore(s=>s.setUser);
  const storeLogout  = useStore(s=>s.logout);
  const storeSetToken= useStore(s=>s.setToken);

  const toast=(m,t="success")=>setToastMsg({m,t});

  const applyTheme=(dark)=>{
    const th=dark?DARK:LIGHT;
    Object.entries(th).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));
  };

  useEffect(()=>{applyTheme(isDark)},[isDark]);

  useEffect(()=>{
    if(storeToken&&storeUser){
      setUser(storeUser);
      applyTheme(isDark);
    }
  },[]);

  const loadTransactions=async()=>{
    if(!storeToken)return;
    setLoadingTxn(true);
    try{
      const month=currentMonth();
      const res=await transactionAPI.getAll(month);
      setTxns((res.data||[]).map(normalizeTxn));
    }catch(e){
      console.error("Gagal load transaksi:",e);
    }finally{setLoadingTxn(false);}
  };

  const loadPrediction=async()=>{
    if(!storeToken)return;
    setLoadingPred(true);
    try{
      const month=currentMonth();
      const res=await predictionAPI.get(month);
      setPrediction(res.data);
    }catch(e){
      console.error("Gagal load prediksi:",e);
    }finally{setLoadingPred(false);}
  };

  useEffect(()=>{
    if(view==="dashboard"&&storeToken){
      loadTransactions();
      loadPrediction();
    }
  },[view,storeToken]);

  const handleEnterDashboard=()=>{
    window.scrollTo(0,0);
    setView(user?"dashboard":"auth");
  };

  const handleAuthSuccess=async(token,userData)=>{
    storeSetToken(token);
    if(userData){setUser(userData);storeSetUser(userData);}
    applyTheme(isDark);
    window.scrollTo(0,0);
    setView("dashboard");
  };

  const handleBackFromAuth=()=>{window.scrollTo(0,0);setView("landing");};

  const handleBackToLanding=()=>{
    window.scrollTo(0,0);
    setView("landing");
  };

  const handleLogout=()=>{
    storeLogout();
    setUser(null);
    setTxns([]);
    setPrediction(null);
    window.scrollTo(0,0);
    setView("landing");
  };

  const addTxn=async(f)=>{
    setLoadingAdd(true);
    try{
      const payload={
        amount:parseFloat(f.amount),
        type:f.type,
        description:f.desc,
        category_id:f.cat,
        date:new Date(f.date+"T"+new Date().toTimeString().slice(0,8)).toISOString(),
      };
      const res=await transactionAPI.create(payload);
      setTxns(p=>[normalizeTxn(res.data),...p]);
      setShowAdd(false);
      toast("Transaksi berhasil ditambahkan","success");
      loadPrediction();
    }catch(e){
      toast("Gagal menambah transaksi","error");
    }finally{setLoadingAdd(false);}
  };

  const deleteTxn=async(id)=>{
    try{
      await transactionAPI.remove(id);
      setTxns(p=>p.filter(t=>t.id!==id));
      toast("Transaksi dihapus","success");
      loadPrediction();
    }catch{
      toast("Gagal menghapus transaksi","error");
    }
  };

  const editTxn=async(id,payload)=>{
    try{
      const res=await transactionAPI.update(id,payload);
      setTxns(p=>p.map(t=>t.id===id?normalizeTxn(res.data):t));
      loadPrediction();
    }catch(e){
      throw e;
    }
  };

  const updateProfile=async(data)=>{
    const payload={};
    if(data.name!==undefined)   payload.name=data.name;
    if(data.budget!==undefined) payload.budget=data.budget;
    const res=await authAPI.updateMe(payload);
    const updated=res.data;
    if(updated){
      setUser(prev=>({...prev,...updated}));
      storeSetUser({...(storeUser||{}),...updated});
    }
  };

  const handleResetData=()=>{
    setTxns([]);
    setPrediction(null);
  };

  if(view==="landing"){
    return <LandingPage onEnterDashboard={handleEnterDashboard} user={user} onLogout={handleLogout}/>;
  }
  if(view==="auth"){
    return <AuthPage onAuthSuccess={handleAuthSuccess} onBack={handleBackFromAuth}/>;
  }

  return(
    <>
      <style>{CSS}</style>
      <div className="app-bg"/>
      <div className="app">
        <Sidebar page={page} setPage={setPage} onBackToLanding={handleBackToLanding} user={user}/>
        <main className="main" style={{overflow:"hidden"}}>
          {page==="dashboard" && <Dashboard txns={txns} setPage={setPage} toast={toast} user={user} prediction={prediction} loadingPred={loadingPred} onAdd={addTxn}/>}
          {page==="txn"       && <Transactions txns={txns} onAdd={addTxn} onDelete={deleteTxn} onEdit={editTxn} toast={toast} setShowAdd={setShowAdd} loading={loadingTxn}/>}
          {page==="analytics" && <Analytics txns={txns} prediction={prediction} user={user} toast={toast}/>}
          {page==="dna"       && <FinancialDNA txns={txns} user={user} prediction={prediction}/>}
          {page==="finbot"    && <FinBotPage txns={txns} user={user} prediction={prediction}/>}
          {page==="settings"  && <Settings toast={toast} isDark={isDark} setIsDark={setIsDark} user={user} onUpdateProfile={updateProfile} txns={txns} prediction={prediction} onResetData={handleResetData}/>}
        </main>
      </div>

      {page!=="finbot" && (
        <button
          onClick={()=>setPage("finbot")}
          style={{
            position:"fixed", bottom:28, right:28, zIndex:150,
            width:56, height:56, borderRadius:"50%",
            background:"linear-gradient(135deg,var(--grad1),var(--grad2))",
            border:"none", cursor:"pointer",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 4px 24px rgba(0,0,0,0.35)",
            transition:"transform .2s, box-shadow .2s",
          }}
          onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.1)";e.currentTarget.style.boxShadow="0 8px 32px rgba(0,0,0,0.45)"}}
          onMouseLeave={e=>{e.currentTarget.style.transform="scale(1)";e.currentTarget.style.boxShadow="0 4px 24px rgba(0,0,0,0.35)"}}
          title="Buka NaviBot AI"
        >
          <Icon name="bot" size={24} color="var(--bg)"/>
        </button>
      )}

      {showAdd && <AddModal onClose={()=>setShowAdd(false)} onAdd={addTxn} loading={loadingAdd}/>}
      {toastMsg && <Toast msg={toastMsg.m} type={toastMsg.t} onDone={()=>setToastMsg(null)}/>}
    </>
  );
}