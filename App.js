import React, { useState, useEffect, useRef, useCallback } from "react";

// ═══════════════════════════════════════════════════════════════════════════
// GLOBAL STYLES — injected at runtime, no Tailwind dependency required
// ═══════════════════════════════════════════════════════════════════════════
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:    #06090F;
    --surf:  #0C1525;
    --card:  #0F1B2E;
    --b:     #1B2E4A;
    --b2:    #253F62;
    --gold:  #C9A84C;
    --gold2: #EEC060;
    --gdim:  rgba(201,168,76,0.09);
    --em:    #10D99A;
    --red:   #FF3F60;
    --blue:  #4AABFF;
    --t:     #CDE0F6;
    --t2:    #607D9B;
    --t3:    #2B4060;
    --fd:    'Cormorant Garamond', Georgia, serif;
    --fb:    'DM Sans', system-ui, sans-serif;
    --fm:    'JetBrains Mono', 'Courier New', monospace;
  }

  body {
    background: var(--bg);
    color: var(--t);
    font-family: var(--fb);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Keyframes ── */
  @keyframes fadeUp  { from { opacity:0; transform:translateY(22px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
  @keyframes spin    { to   { transform:rotate(360deg); } }
  @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.28} }
  @keyframes shimmer { 0%{background-position:-300% center} 100%{background-position:300% center} }
  @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
  @keyframes gNeedle { from{transform:rotate(-90deg)} to{transform:rotate(var(--r,0deg))} }
  @keyframes popIn   { 0%{transform:scale(0.88);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes slideR  { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scanBar { 0%{top:-2px;opacity:.7} 100%{top:100%;opacity:0} }

  /* ── Card base ── */
  .dc {
    background: var(--card);
    border: 1px solid var(--b);
    border-radius: 12px;
    transition: border-color .22s, box-shadow .22s;
  }
  .dc:hover {
    border-color: rgba(201,168,76,.28);
    box-shadow: 0 4px 44px rgba(0,0,0,.6), 0 0 40px rgba(201,168,76,.045);
  }

  /* ── Gold shimmer text ── */
  .gt {
    background: linear-gradient(120deg, var(--gold), var(--gold2) 40%, var(--gold));
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: shimmer 5s linear infinite;
  }

  /* ── Upload zone ── */
  .uz {
    border: 1.5px dashed var(--b2);
    border-radius: 16px;
    cursor: pointer;
    transition: border-color .2s, background .2s, transform .15s;
  }
  .uz:hover, .uz.drag {
    border-color: var(--gold);
    background: var(--gdim);
    transform: scale(1.004);
  }

  /* ── Buttons ── */
  .bg {
    background: linear-gradient(135deg, var(--gold), var(--gold2));
    color: #04080E;
    font-family: var(--fb);
    font-weight: 600;
    font-size: 14px;
    letter-spacing: .025em;
    border: none;
    border-radius: 8px;
    padding: 11px 26px;
    cursor: pointer;
    transition: opacity .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 2px 22px rgba(201,168,76,.22);
  }
  .bg:hover  { opacity:.88; transform:translateY(-1px); box-shadow:0 6px 30px rgba(201,168,76,.3); }
  .bg:active { transform:translateY(0); }

  .gh {
    background: transparent;
    color: var(--t2);
    border: 1px solid var(--b);
    font-family: var(--fb);
    font-size: 13px;
    font-weight: 500;
    border-radius: 8px;
    padding: 9px 18px;
    cursor: pointer;
    transition: border-color .2s, color .2s;
  }
  .gh:hover { border-color: var(--gold); color: var(--gold); }

  /* ── Mono label ── */
  .ml {
    font-family: var(--fm);
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .14em;
    color: var(--t3);
  }

  /* ── Tags ── */
  .tag {
    font-family: var(--fm);
    font-size: 9px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: 2px 7px;
    border-radius: 4px;
    display: inline-block;
  }
  .tc { background:rgba(255,63,96,.13);  color:#FF3F60; border:1px solid rgba(255,63,96,.22); }
  .th { background:rgba(255,156,50,.13); color:#FFA040; border:1px solid rgba(255,156,50,.22); }
  .tm { background:rgba(201,168,76,.13); color:#C9A84C; border:1px solid rgba(201,168,76,.22); }
  .tl { background:rgba(16,217,154,.13); color:#10D99A; border:1px solid rgba(16,217,154,.22); }

  /* ── Gauge needle ── */
  .gn {
    transform-origin: 140px 138px;
    transform: rotate(-90deg);
    animation: gNeedle 1.9s cubic-bezier(.34,1.56,.64,1) .45s forwards;
  }

  /* ── Dot grid bg ── */
  .dg {
    background-image: radial-gradient(rgba(26,45,74,.88) 1px, transparent 1px);
    background-size: 26px 26px;
  }

  /* ── Float anim ── */
  .fa { animation: float 3.5s ease-in-out infinite; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width:3px; }
  ::-webkit-scrollbar-thumb { background:var(--b); border-radius:2px; }

  /* ── Table row hover ── */
  .rr:hover { background:rgba(201,168,76,.03); }

  /* ── DD item hover ── */
  .ddi:hover { border-color:rgba(201,168,76,.28) !important; }

  /* ── Fade-up entrance ── */
  .fu { animation:fadeUp .5s ease forwards; }
`;

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA  —  Realistic PE / CIM-grade content
// ═══════════════════════════════════════════════════════════════════════════
const DATA = {
  company: {
    name:           "Meridian Packaging Holdings",
    industry:       "Specialty Packaging / Industrials",
    founded:        "2007",
    hq:             "Chicago, Illinois, USA",
    description:    "Meridian Packaging Holdings is a vertically integrated specialty packaging manufacturer serving blue-chip consumer goods, pharmaceutical, and food & beverage clients across North America and Western Europe. The company operates seven production facilities and holds a proprietary barrier coating technology that delivers 34% superior protection versus commodity alternatives, supporting durable premium pricing and deep client stickiness across long-term agreements.",
    revenue:        "$287.4M (TTM)",
    ebitda:         "$52.9M (TTM)",
    ebitda_margin:  "18.4%",
    employees:      "1,840",
    cagr:           "11.2% (3Y CAGR)",
    leverage:       "4.2× Net Debt/EBITDA",
    net_debt:       "$222.2M",
  },

  industry_summary:
    "The global specialty packaging market is valued at approximately $94B, growing at a 5.8% CAGR driven by e-commerce penetration, sustainable packaging mandates, and FMCG premiumisation trends. North American demand is underpinned by near-shoring activity and tightening FDA compliance requirements for pharmaceutical packaging. Competitive intensity is moderate with 3–4 scaled regional incumbents, though Chinese cost pressure at the commodity end remains a structural headwind. Pricing power has improved materially as raw material costs stabilise following the 2021–2023 supply chain disruption cycle.",

  financial_insights: [
    "Revenue CAGR of 11.2% FY2021–FY2024, outpacing the industry average of 5.8% by ~190bps",
    "EBITDA margin expanded 320bps from 15.2% (FY2021) to 18.4% (TTM), reflecting strong operating leverage on fixed-cost base",
    "Inventory days increased from 42 to 61 YoY — inventory growth significantly outpacing revenue growth, signaling potential demand softness",
    "Top 3 customers represent 47% of total revenue — material customer concentration risk identified",
    "FCF conversion of 68% vs. 84% peer median in FY2024 — persistent working capital pressure detected in AR and inventory",
  ],

  strengths: [
    "Proprietary barrier coating technology protected by 3 active patents (expiry 2031–2034), providing durable moat",
    "Long-term supply agreements with 8 Fortune 500 clients averaging 4.2 years remaining tenure",
    "EBITDA margins improving steadily — tracking toward 20% by FY2026E on operating and procurement leverage",
    "Mexico greenfield facility on track for commissioning in H2 FY2025; 23% unit cost reduction projected post-ramp",
  ],

  risks: [
    "Customer concentration: top 3 clients = 47% of revenue with contract renewals clustering in FY2026",
    "High dependence on North American market (88% of revenue) limits geographic diversification and FX optionality",
    "Net Debt/EBITDA at 4.2× post-buyout, above sector median of 3.6×, limiting financial flexibility in a downturn",
    "Raw material exposure to HDPE/PET resin volatility with limited contractual pass-through in fixed-price agreements",
  ],

  red_flags: [
    { text: "Inventory growth outpacing revenue — days outstanding up 45% YoY. May signal demand softness or channel overstocking requiring immediate management clarification.", severity: "Critical" },
    { text: "CFO departed Q3 FY2024; interim CFO in seat 9+ months. Extended leadership gap raises governance concerns and complicates FY2025 budget cycle ownership.", severity: "High" },
    { text: "Key customer (18% of revenue) holds a contractual break-clause in FY2026 agreement, coinciding with reported inbound M&A activity at the customer level.", severity: "High" },
    { text: "Mexico facility capex contingency budget at 8% of total project cost — below the 12–15% industry norm for comparable greenfield builds. Overrun risk material.", severity: "Medium" },
  ],

  swot: {
    strengths:     ["Patented barrier technology moat (3 patents)", "Blue-chip LTA client base", "320bps margin expansion since FY2021"],
    weaknesses:    ["Top 3 customer = 47% revenue", "88% North American revenue concentration", "Interim CFO — governance gap"],
    opportunities: ["Sustainable packaging conversion tailwind", "Mexico facility cost arbitrage", "Pharma packaging segment cross-sell"],
    threats:       ["Chinese commodity packaging competition", "Customer insourcing risk at scale", "HDPE/PET resin price volatility"],
  },

  dd_questions: [
    { q: "What are the specific renewal terms, pricing mechanisms, and renewal probability assessments for the top 3 customer contracts maturing in FY2026?", cat: "Commercial" },
    { q: "Can management provide a detailed unlevered FCF bridge reconciling EBITDA to operating cash flow for FY2022–FY2024, isolating working capital movements?", cat: "Financial" },
    { q: "What triggered the CFO departure in Q3 FY2024, and what is the search timeline, candidate profile, and interim governance structure?", cat: "Management" },
    { q: "How does the proprietary barrier coating compare defensively against emerging bio-based and recyclable packaging alternatives gaining share in the EU and NA markets?", cat: "Technology" },
    { q: "What is the current capex commitment, completion schedule, cost-to-complete estimate, and contingency budget for the Mexico greenfield facility?", cat: "Operational" },
    { q: "Has management stress-tested the EBITDA impact of a 10% resin price increase against the current fixed-price contract structure, and what is the hedge position?", cat: "Financial" },
    { q: "What is the specific break-clause trigger in the 18%-revenue customer contract, and what is the current status of the customer's reported M&A process?", cat: "Commercial" },
    { q: "Are there any pending environmental compliance actions, regulatory reviews, or ESG-related liabilities across the seven production facilities?", cat: "Legal / ESG" },
  ],

  investment_score: 7.2,
  investment_score_rationale:
    "Attractive growth profile and proprietary technology moat are offset by meaningful customer concentration risk, above-median leverage, and a leadership transition. Compelling on margin expansion thesis contingent on Mexico facility delivery and CFO succession resolution.",

  risk_heatmap: [
    { category: "Customer Concentration",  likelihood: "High",   impact: "High",   severity: "Critical" },
    { category: "Leadership / CFO Gap",    likelihood: "High",   impact: "Medium", severity: "High"     },
    { category: "Contract Break-Clause",   likelihood: "Medium", impact: "High",   severity: "High"     },
    { category: "Leverage / Debt Service", likelihood: "Medium", impact: "High",   severity: "High"     },
    { category: "Resin Price Volatility",  likelihood: "Medium", impact: "Medium", severity: "Medium"   },
    { category: "Regulatory / ESG",        likelihood: "Low",    impact: "High",   severity: "Medium"   },
    { category: "Technology Obsolescence", likelihood: "Low",    impact: "High",   severity: "Medium"   },
  ],

  ic_memo: {
    executive_summary:
      "Meridian Packaging Holdings presents a compelling specialty manufacturing opportunity underpinned by a defensible technology moat, strong margin trajectory, and blue-chip customer relationships. The company's 11.2% revenue CAGR and 320bps EBITDA expansion since FY2021 reflect consistent operational execution. However, significant customer concentration (top 3 = 47% revenue), above-median leverage at 4.2×, and a leadership transition create identifiable near-term risk that warrants structured diligence prior to investment finalisation.",
    investment_thesis:
      "The core thesis rests on three pillars: (1) Proprietary barrier coating technology with 3 patents (expiry 2031–2034) providing a durable competitive moat and pricing power well above commodity peers; (2) Mexico greenfield facility driving 23% unit cost reduction, supporting continued margin expansion toward 20%+ EBITDA by FY2026E; and (3) Secular tailwinds from sustainable packaging mandates and pharmaceutical FDA compliance requirements expanding Meridian's addressable market. We see a path to 7–9× entry EBITDA multiple with a 3.5–4.0× MOIC on a 5-year hold at current leverage terms.",
    key_risks:
      "Primary risks include: (1) Customer contract concentration with top 3 clients (47% revenue) facing simultaneous renewal risk in FY2026; (2) CFO succession gap creating a governance overhang and budget cycle risk; (3) Leverage at 4.2× net debt/EBITDA above sector norms, limiting financial flexibility in a demand downturn; and (4) A key customer (18% revenue) holding a break-clause in FY2026 amid active M&A activity. Inventory days expansion (+45% YoY) warrants close monitoring as a potential leading indicator of demand softness ahead of contract renewals.",
    recommendation:
      "RECOMMENDATION: PROCEED TO PHASE 2 DILIGENCE. We recommend proceeding subject to satisfactory resolution of four conditions: (i) management Q&A on customer contract renewal strategy and probability-weighted retention analysis; (ii) independent commercial diligence on the 18%-revenue customer break-clause scenario; (iii) confirmation of permanent CFO appointment timeline (target: Q1 FY2025); and (iv) independent engineering review of Mexico facility budget integrity and completion schedule. Target entry at 7.5–8.0× blended EBITDA. Full IC presentation to be scheduled upon Phase 2 completion.",
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PROCESSING STEPS
// ═══════════════════════════════════════════════════════════════════════════
const STEPS = [
  "Parsing document structure...",
  "Extracting financial statements...",
  "Identifying key metrics & KPIs...",
  "Running risk assessment engine...",
  "Building SWOT framework...",
  "Scoring investment factors...",
  "Generating IC questions...",
  "Compiling deal memo...",
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════
const scoreCol  = s => s >= 7.5 ? "#10D99A" : s >= 5.5 ? "#C9A84C" : "#FF3F60";
const scoreText = s => s >= 7.5 ? "ATTRACTIVE" : s >= 5.5 ? "CONDITIONAL" : "UNATTRACTIVE";

const SevBadge = ({ s }) => {
  const map = { Critical: "tc", High: "th", Medium: "tm", Low: "tl" };
  return <span className={`tag ${map[s] || "tm"}`}>{s}</span>;
};

const LhDot = ({ level }) => {
  const c = { High: "#FF3F60", Medium: "#C9A84C", Low: "#10D99A" }[level] || "#C9A84C";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: c, boxShadow: `0 0 5px ${c}70` }} />
      <span style={{ color: c, fontFamily: "var(--fm)", fontSize: 11, fontWeight: 500 }}>{level}</span>
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGO
// ═══════════════════════════════════════════════════════════════════════════
function Logo({ size = 18 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="20" y2="20">
            <stop offset="0%"   stopColor="#C9A84C" />
            <stop offset="100%" stopColor="#EEC060" />
          </linearGradient>
        </defs>
        <polygon
          points="10,1 13,7 20,7 14.5,11.5 16.5,18.5 10,14.5 3.5,18.5 5.5,11.5 0,7 7,7"
          fill="none" stroke="url(#lg)" strokeWidth="1.5"
        />
      </svg>
      <span style={{
        fontFamily: "var(--fd)", fontWeight: 700, fontSize: size * 1.12,
        letterSpacing: ".055em",
        background: "linear-gradient(135deg,#C9A84C,#EEC060)",
        WebkitBackgroundClip: "text", backgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}>
        DEAL MEMO AI
      </span>
    </span>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SCORE GAUGE
// ═══════════════════════════════════════════════════════════════════════════
function ScoreGauge({ score }) {
  const rot = score * 18 - 90;
  const col = scoreCol(score);
  const cx = 140, cy = 138, r = 98;

  const arc = (a1, a2) => {
    const x1 = cx + r * Math.cos((a1 * Math.PI) / 180);
    const y1 = cy - r * Math.sin((a1 * Math.PI) / 180);
    const x2 = cx + r * Math.cos((a2 * Math.PI) / 180);
    const y2 = cy - r * Math.sin((a2 * Math.PI) / 180);
    const lg = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return `M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${lg},0 ${x2.toFixed(1)},${y2.toFixed(1)}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg viewBox="0 0 280 172" style={{ width: "100%", maxWidth: 280 }}>
        {/* Zone halos */}
        <path d={arc(180, 120)} fill="none" stroke="rgba(255,63,96,0.17)"   strokeWidth={22} strokeLinecap="round" />
        <path d={arc(120, 54)}  fill="none" stroke="rgba(201,168,76,0.17)"  strokeWidth={22} strokeLinecap="round" />
        <path d={arc(54, 0)}    fill="none" stroke="rgba(16,217,154,0.17)"  strokeWidth={22} strokeLinecap="round" />
        {/* Track */}
        <path d={arc(180, 0)}   fill="none" stroke="rgba(27,46,74,0.55)"    strokeWidth={7}  strokeLinecap="round" />
        {/* Filled arc */}
        <path d={arc(180, 180 - score * 18)} fill="none" stroke={col} strokeWidth={7} strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 5px ${col}55)` }} />
        {/* Axis labels */}
        <text x="18"  y="162" style={{ fontFamily:"var(--fm)", fontSize:9, fill:"rgba(255,63,96,0.45)" }}>LOW</text>
        <text x="140" y="42"  style={{ fontFamily:"var(--fm)", fontSize:9, fill:"rgba(201,168,76,0.45)", textAnchor:"middle" }}>MID</text>
        <text x="252" y="162" style={{ fontFamily:"var(--fm)", fontSize:9, fill:"rgba(16,217,154,0.45)", textAnchor:"end" }}>HIGH</text>
        {/* Needle */}
        <g className="gn" style={{ "--r": `${rot}deg` }}>
          <line x1={cx} y1={cy} x2={cx} y2={cy - 86} stroke={col} strokeWidth={2.5} strokeLinecap="round" />
          <line x1={cx} y1={cy} x2={cx} y2={cy + 14} stroke={col} strokeWidth={2}   strokeLinecap="round" opacity={0.4} />
        </g>
        <circle cx={cx} cy={cy} r={7} fill="var(--card)" stroke={col} strokeWidth={2} />
        {/* Score */}
        <text x={cx} y={cy + 46} textAnchor="middle"
          style={{ fontFamily:"var(--fd)", fontSize:42, fontWeight:700, fill:col }}>{score}</text>
        <text x={cx} y={cy + 63} textAnchor="middle"
          style={{ fontFamily:"var(--fm)", fontSize:9, fill:"var(--t3)", letterSpacing:".12em" }}>/10 ATTRACTIVENESS</text>
      </svg>
      {/* Label pill */}
      <span style={{
        fontFamily: "var(--fm)", fontSize: 10, fontWeight: 600,
        textTransform: "uppercase", letterSpacing: ".12em", color: col,
        padding: "4px 12px", borderRadius: 6,
        background: `${col}18`, border: `1px solid ${col}30`,
        marginTop: -6,
      }}>
        {scoreText(score)}
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// SWOT GRID
// ═══════════════════════════════════════════════════════════════════════════
function SwotGrid({ swot }) {
  const quads = [
    { key: "strengths",     label: "Strengths",     icon: "S", col: "#10D99A", bg: "rgba(16,217,154,0.06)",  bd: "rgba(16,217,154,0.18)"  },
    { key: "weaknesses",    label: "Weaknesses",    icon: "W", col: "#C9A84C", bg: "rgba(201,168,76,0.06)", bd: "rgba(201,168,76,0.18)"  },
    { key: "opportunities", label: "Opportunities", icon: "O", col: "#4AABFF", bg: "rgba(74,171,255,0.06)", bd: "rgba(74,171,255,0.18)"  },
    { key: "threats",       label: "Threats",       icon: "T", col: "#FF3F60", bg: "rgba(255,63,96,0.06)",  bd: "rgba(255,63,96,0.18)"   },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
      {quads.map(({ key, label, icon, col, bg, bd }) => (
        <div key={key} style={{ background: bg, border: `1px solid ${bd}`, borderRadius: 10, padding: "14px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <span style={{
              width: 22, height: 22, borderRadius: 6,
              background: `${col}20`, border: `1px solid ${col}40`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--fm)", fontSize: 10, fontWeight: 600, color: col,
            }}>{icon}</span>
            <span style={{ fontFamily: "var(--fm)", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".12em", color: col }}>{label}</span>
          </div>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
            {(swot[key] || []).map((item, i) => (
              <li key={i} style={{ display: "flex", gap: 7, alignItems: "flex-start" }}>
                <span style={{ color: col, marginTop: 2, fontSize: 10, flexShrink: 0 }}>▸</span>
                <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--t)" }}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RISK HEATMAP
// ═══════════════════════════════════════════════════════════════════════════
function RiskHeatmap({ heatmap }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr>
            {["Risk Category", "Likelihood", "Impact", "Severity Assessment"].map(h => (
              <th key={h} style={{
                textAlign: h === "Risk Category" ? "left" : "center",
                padding: "8px 14px",
                fontFamily: "var(--fm)", fontSize: 9, fontWeight: 500,
                textTransform: "uppercase", letterSpacing: ".12em",
                color: "var(--t3)", borderBottom: "1px solid var(--b)",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {heatmap.map((r, i) => (
            <tr key={i} className="rr" style={{ borderBottom: "1px solid rgba(26,44,69,.5)", transition: "background .15s" }}>
              <td style={{ padding: "11px 14px", color: "var(--t)", fontWeight: 500 }}>{r.category}</td>
              <td style={{ padding: "11px 14px", textAlign: "center" }}><LhDot level={r.likelihood} /></td>
              <td style={{ padding: "11px 14px", textAlign: "center" }}><LhDot level={r.impact} /></td>
              <td style={{ padding: "11px 14px", textAlign: "center" }}><SevBadge s={r.severity} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DUE DILIGENCE QUESTIONS
// ═══════════════════════════════════════════════════════════════════════════
function DDPanel({ questions }) {
  const [open, setOpen] = useState(null);

  const catCol = {
    Commercial: "#4AABFF",
    Financial:  "#10D99A",
    Management: "#C9A84C",
    Technology: "#A78BFA",
    Operational:"#FFA040",
    "Legal / ESG": "#FF3F60",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {questions.map((item, i) => {
        const cc = catCol[item.cat] || "#4AABFF";
        const isOpen = open === i;
        return (
          <div key={i} className="ddi"
            style={{ border: "1px solid var(--b)", borderRadius: 9, overflow: "hidden", transition: "border-color .2s" }}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: "100%", background: "transparent", border: "none",
                padding: "12px 16px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12, textAlign: "left",
              }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--gold)", fontWeight: 600, minWidth: 24, flexShrink: 0 }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ flex: 1, fontSize: 13.5, color: "var(--t)", lineHeight: 1.4 }}>{item.q}</span>
              <span style={{
                fontFamily: "var(--fm)", fontSize: 9, padding: "2px 8px",
                borderRadius: 4, flexShrink: 0,
                background: `${cc}18`, border: `1px solid ${cc}30`, color: cc,
              }}>{item.cat}</span>
              <span style={{
                color: "var(--t3)", fontSize: 12, marginLeft: 4,
                display: "inline-block", transition: "transform .2s",
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}>▾</span>
            </button>
            {isOpen && (
              <div style={{
                padding: "4px 16px 14px 52px",
                borderTop: "1px solid var(--b)",
                fontSize: 12.5, color: "var(--t2)", lineHeight: 1.7,
              }}>
                This question targets a critical information gap in the investment thesis. Management responses should be supported by audited financials, third-party verification, or data room documentation. Inadequate or evasive responses warrant escalation to senior diligence leads before proceeding to Phase 2.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// IC MEMO MODAL
// ═══════════════════════════════════════════════════════════════════════════
function ICModal({ memo, company, onClose }) {
  const sections = [
    { label: "Executive Summary",  key: "executive_summary",  col: "#4AABFF" },
    { label: "Investment Thesis",  key: "investment_thesis",  col: "#10D99A" },
    { label: "Key Risks",          key: "key_risks",          col: "#FF3F60" },
    { label: "Recommendation",     key: "recommendation",     col: "#C9A84C" },
  ];

  const stats = [
    ["TARGET",      company.name],
    ["SECTOR",      "Specialty Packaging"],
    ["ENTRY EV",    "~$400–420M (7.5–8.0× EBITDA)"],
    ["HOLD PERIOD", "4–5 years"],
  ];

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 999,
        background: "rgba(3,6,12,0.88)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
      <div className="dc"
        style={{
          width: "100%", maxWidth: 780, maxHeight: "90vh",
          display: "flex", flexDirection: "column",
          border: "1px solid rgba(201,168,76,0.3)",
          animation: "popIn .22s ease forwards",
        }}>

        {/* Header */}
        <div style={{ padding: "18px 24px", borderBottom: "1px solid var(--b)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div className="ml" style={{ marginBottom: 5 }}>Generated Output · Confidential</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 700, color: "var(--t)" }}>
              Investment Committee Memorandum
            </div>
            <div style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--t2)", marginTop: 4 }}>
              RE: {company.name} · {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginLeft: 20, flexShrink: 0 }}>
            <span className="tag tm">DRAFT</span>
            <button onClick={onClose}
              style={{ background: "transparent", border: "none", color: "var(--t2)", cursor: "pointer", fontSize: 22, lineHeight: 1, padding: "2px 4px" }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {/* Deal metrics strip */}
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 6,
            padding: "12px 14px", marginBottom: 22,
            background: "rgba(27,46,74,0.4)", borderRadius: 9,
            fontFamily: "var(--fm)", fontSize: 10,
          }}>
            {stats.map(([k, v]) => (
              <div key={k} style={{ minWidth: 140, padding: "4px 10px", borderRight: "1px solid var(--b)" }}>
                <div style={{ color: "var(--t3)", marginBottom: 2 }}>{k}</div>
                <div style={{ color: "var(--t)", fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          {sections.map(({ label, key, col }) => (
            <div key={key} style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 3, height: 20, background: col, borderRadius: 2, flexShrink: 0 }} />
                <span style={{
                  fontFamily: "var(--fm)", fontSize: 10, fontWeight: 600,
                  textTransform: "uppercase", letterSpacing: ".12em", color: col,
                }}>{label}</span>
              </div>
              <p style={{
                fontSize: 13.5, lineHeight: 1.82, color: "#A8C0D8", margin: 0,
                paddingLeft: 13, borderLeft: `1px solid ${col}22`,
              }}>{memo[key]}</p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{
          padding: "13px 24px", borderTop: "1px solid var(--b)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
        }}>
          <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--t3)" }}>
            CONFIDENTIAL · DEAL MEMO AI · FOR INTERNAL IC USE ONLY
          </span>
          <button className="gh" style={{ fontSize: 12, padding: "7px 16px" }}>Export PDF</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// LANDING PAGE
// ═══════════════════════════════════════════════════════════════════════════
function Landing({ onFileChange, onDemo, isDragging, onDragOver, onDragLeave, onDrop, fileRef }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", position: "relative", overflow: "hidden" }}>
      {/* Dot grid */}
      <div className="dg" style={{ position: "absolute", inset: 0, opacity: .42 }} />
      {/* Radial glow */}
      <div style={{
        position: "absolute", top: "34%", left: "50%", transform: "translate(-50%,-50%)",
        width: 820, height: 820, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(201,168,76,.055) 0%,transparent 68%)",
        pointerEvents: "none",
      }} />
      {/* Corner lines */}
      <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: .07 }}>
        <line x1="0" y1="0" x2="0" y2="100%" stroke="#C9A84C" strokeWidth=".5" />
        <line x1="100%" y1="0" x2="100%" y2="100%" stroke="#C9A84C" strokeWidth=".5" />
      </svg>

      {/* Navbar */}
      <nav style={{
        position: "relative", zIndex: 10, padding: "18px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid rgba(26,44,69,.7)",
      }}>
        <Logo size={18} />
        <div style={{ display: "flex", gap: 30 }}>
          {["Platform", "Research", "Security", "Pricing"].map(l => (
            <span key={l} style={{ fontSize: 13, color: "var(--t2)", cursor: "default", letterSpacing: ".02em" }}>{l}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="gh" style={{ fontSize: 13, padding: "8px 16px" }}>Sign In</button>
          <button className="bg" style={{ padding: "8px 18px", fontSize: 13 }}>Request Access</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", zIndex: 5, maxWidth: 870, margin: "0 auto", padding: "72px 40px 0", textAlign: "center" }}>
        {/* Eyebrow */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)",
          borderRadius: 20, padding: "5px 14px", marginBottom: 28,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", animation: "pulse 2s ease infinite" }} />
          <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--gold)", letterSpacing: ".12em", textTransform: "uppercase" }}>
            AI-Powered Private Equity Platform
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "var(--fd)",
          fontSize: "clamp(44px,6vw,72px)",
          fontWeight: 700, lineHeight: 1.1, margin: "0 0 20px",
          letterSpacing: "-.01em", color: "var(--t)",
        }}>
          Private Equity{" "}
          <span className="gt">Due Diligence,</span>
          <br />Reimagined.
        </h1>

        <p style={{ fontSize: 17, color: "var(--t2)", lineHeight: 1.77, maxWidth: 580, margin: "0 auto 44px", fontWeight: 300 }}>
          Upload a CIM, annual report, or management presentation. Receive IC-grade analysis in seconds — company overview, SWOT, risk heatmap, red-flag detection, and investment committee memo.
        </p>

        {/* Upload zone */}
        <div
          className={`uz ${isDragging ? "drag" : ""}`}
          style={{ padding: "48px 40px", marginBottom: 16, background: "rgba(15,24,40,.6)" }}
          onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={onFileChange} />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div className="fa" style={{
              width: 58, height: 58, borderRadius: 14,
              background: "rgba(201,168,76,.1)", border: "1px solid rgba(201,168,76,.26)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none"
                stroke="#C9A84C" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <polyline points="9 15 12 12 15 15" />
              </svg>
            </div>
            <div>
              <p style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 500, color: "var(--t)" }}>
                Drop your PDF here or click to upload
              </p>
              <p style={{ margin: 0, fontSize: 12.5, color: "var(--t2)" }}>
                CIM · Annual Report · Management Presentation · Info Memo
              </p>
            </div>
            <button className="bg" style={{ pointerEvents: "none", padding: "10px 24px" }}>Choose File</button>
          </div>
        </div>

        <button className="gh" onClick={onDemo} style={{ fontSize: 13, padding: "10px 24px" }}>
          ↗ Load Demo — Meridian Packaging Holdings CIM
        </button>

        {/* Trust bar */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 40,
          marginTop: 56, paddingTop: 28,
          borderTop: "1px solid rgba(26,44,69,.6)",
        }}>
          {[
            ["PE-Grade Analysis",  "Blackstone-caliber quality"],
            ["Instant Results",    "< 15 second turnaround"],
            ["IC-Ready Output",    "Memo & export included"],
            ["100% Private",       "No data stored externally"],
          ].map(([h, s]) => (
            <div key={h} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--t)", marginBottom: 3 }}>{h}</div>
              <div style={{ fontSize: 11.5, color: "var(--t3)" }}>{s}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// PROCESSING PAGE
// ═══════════════════════════════════════════════════════════════════════════
function Processing({ steps, current, fileName }) {
  const pct = Math.min(100, Math.round((current / steps.length) * 100));

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      <div className="dg" style={{ position: "absolute", inset: 0, opacity: .35 }} />
      <div style={{
        position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        width: 620, height: 620, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(201,168,76,.05) 0%,transparent 65%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: 510, padding: "0 24px" }}>
        {/* Spinner header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            display: "inline-flex", width: 70, height: 70,
            alignItems: "center", justifyContent: "center",
            background: "rgba(201,168,76,.08)", border: "1px solid rgba(201,168,76,.2)",
            borderRadius: 18, marginBottom: 20,
          }}>
            <div style={{
              width: 34, height: 34,
              border: "2.5px solid rgba(201,168,76,.18)",
              borderTopColor: "var(--gold)",
              borderRadius: "50%",
              animation: "spin .85s linear infinite",
            }} />
          </div>
          <h2 style={{ fontFamily: "var(--fd)", fontSize: 30, fontWeight: 700, margin: "0 0 8px", color: "var(--t)" }}>
            Analysing Document
          </h2>
          {fileName && (
            <p style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--t3)", margin: 0, letterSpacing: ".06em" }}>
              {fileName.toUpperCase()}
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--t3)" }}>PROGRESS</span>
            <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--gold)" }}>{pct}%</span>
          </div>
          <div style={{ height: 3, background: "var(--b)", borderRadius: 2 }}>
            <div style={{
              height: "100%", borderRadius: 2,
              background: "linear-gradient(90deg,var(--gold),var(--gold2))",
              width: `${pct}%`,
              transition: "width .5s ease",
              boxShadow: "0 0 8px rgba(201,168,76,.4)",
            }} />
          </div>
        </div>

        {/* Step list */}
        <div className="dc" style={{ padding: "6px 0" }}>
          {steps.map((step, i) => {
            const done   = i < current;
            const active = i === current;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 18px",
                opacity: done ? 0.62 : active ? 1 : 0.26,
                transition: "opacity .35s",
              }}>
                <div style={{ width: 22, height: 22, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {done ? (
                    <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="9" r="8" fill="rgba(16,217,154,.14)" stroke="#10D99A" strokeWidth="1" />
                      <path d="M5.5 9l2.5 2.5 4-4" stroke="#10D99A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : active ? (
                    <div style={{
                      width: 15, height: 15,
                      border: "1.5px solid var(--gold)", borderTopColor: "transparent",
                      borderRadius: "50%", animation: "spin .7s linear infinite",
                    }} />
                  ) : (
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--t3)" }} />
                  )}
                </div>
                <span style={{
                  fontFamily: "var(--fb)", fontSize: 13.5,
                  color: active ? "var(--t)" : done ? "var(--t2)" : "var(--t3)",
                  fontWeight: active ? 500 : 400,
                }}>{step}</span>
                {active && (
                  <span style={{ fontFamily: "var(--fm)", fontSize: 9, color: "var(--gold)", marginLeft: "auto", animation: "pulse 1.4s ease infinite" }}>
                    RUNNING
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p style={{ textAlign: "center", fontFamily: "var(--fm)", fontSize: 10, color: "var(--t3)", marginTop: 26, letterSpacing: ".1em" }}>
          DEAL MEMO AI · INSTITUTIONAL GRADE ANALYSIS ENGINE
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════
function Dashboard({ data, fileName, onReset }) {
  const [icOpen, setIcOpen] = useState(false);
  const c = data.company;

  const CardHead = ({ label, title }) => (
    <div style={{ marginBottom: 16 }}>
      <div className="ml" style={{ marginBottom: 5 }}>{label}</div>
      <h3 style={{ fontFamily: "var(--fd)", fontSize: 20, fontWeight: 600, margin: 0, color: "var(--t)", letterSpacing: "-.01em" }}>
        {title}
      </h3>
    </div>
  );

  const Pill = ({ label, value, accent }) => (
    <div style={{
      background: "rgba(26,44,69,.5)", border: "1px solid var(--b)",
      borderRadius: 9, padding: "10px 16px", minWidth: 118,
    }}>
      <div className="ml" style={{ marginBottom: 4 }}>{label}</div>
      <div style={{ fontFamily: "var(--fm)", fontSize: 13.5, fontWeight: 500, color: accent || "var(--t)" }}>
        {value}
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {icOpen && <ICModal memo={data.ic_memo} company={c} onClose={() => setIcOpen(false)} />}

      {/* Sticky nav */}
      <div style={{
        background: "rgba(11,18,32,.96)", borderBottom: "1px solid var(--b)",
        padding: "0 28px", position: "sticky", top: 0, zIndex: 50,
        backdropFilter: "blur(14px)", WebkitBackdropFilter: "blur(14px)",
      }}>
        <div style={{ maxWidth: 1440, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={onReset} title="New Analysis"
              style={{ background: "transparent", border: "none", color: "var(--t3)", cursor: "pointer", fontSize: 20, padding: "2px 6px", lineHeight: 1 }}>
              ←
            </button>
            <div style={{ width: 1, height: 28, background: "var(--b)" }} />
            <Logo size={15} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--t3)" }}>ANALYZING:</span>
            <span style={{ fontFamily: "var(--fd)", fontSize: 17, fontWeight: 600, color: "var(--t)" }}>{c.name}</span>
            <span style={{
              fontFamily: "var(--fm)", fontSize: 10, padding: "3px 8px", borderRadius: 4,
              background: "rgba(74,171,255,.1)", border: "1px solid rgba(74,171,255,.2)", color: "var(--blue)",
            }}>{c.industry}</span>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--t3)" }}>
              {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}
            </span>
            <button className="bg" style={{ padding: "9px 20px", fontSize: 13 }} onClick={() => setIcOpen(true)}>
              Generate IC Memo ↗
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 28px 90px" }}>

        {/* ── Metric strip ── */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
          <Pill label="REVENUE (TTM)"  value={c.revenue} />
          <Pill label="EBITDA (TTM)"   value={c.ebitda}  accent="var(--em)" />
          <Pill label="EBITDA MARGIN"  value={c.ebitda_margin} accent="var(--em)" />
          <Pill label="EMPLOYEES"      value={c.employees} />
          <Pill label="REVENUE CAGR"   value={c.cagr}    accent="var(--blue)" />
          <Pill label="NET LEVERAGE"   value={c.leverage} accent="#FFA040" />
          <div style={{ flex: 1 }} />
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(201,168,76,.06)", border: "1px solid rgba(201,168,76,.22)",
            borderRadius: 9, padding: "10px 18px",
          }}>
            <span className="ml">SCORE</span>
            <span style={{ fontFamily: "var(--fm)", fontSize: 22, fontWeight: 600, color: scoreCol(data.investment_score) }}>
              {data.investment_score}
            </span>
            <span style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--t3)" }}>/10</span>
          </div>
        </div>

        {/* ── Row 1: Company + Gauge ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: 16 }}>
          <div className="dc" style={{ padding: "22px 24px" }}>
            <CardHead label="Company Overview" title={c.name} />
            <p style={{ fontSize: 14, lineHeight: 1.82, color: "var(--t2)", margin: "0 0 20px" }}>{c.description}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
              {[
                { k: "Industry",         v: c.industry },
                { k: "Headquarters",     v: c.hq },
                { k: "Founded",          v: c.founded },
                { k: "Source Document",  v: fileName || "CIM_2024.pdf" },
              ].map(({ k, v }) => (
                <div key={k} style={{ background: "rgba(26,44,69,.45)", borderRadius: 8, padding: "10px 12px" }}>
                  <div className="ml" style={{ marginBottom: 3 }}>{k}</div>
                  <div style={{ fontSize: 12.5, color: "var(--t)", fontWeight: 500 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dc" style={{ padding: "22px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <CardHead label="AI Assessment" title="Investment Score" />
            <ScoreGauge score={data.investment_score} />
            <p style={{ fontSize: 12, lineHeight: 1.65, color: "var(--t2)", textAlign: "center", margin: "12px 0 0", padding: "0 6px" }}>
              {data.investment_score_rationale}
            </p>
          </div>
        </div>

        {/* ── Row 2: Industry Summary ── */}
        <div className="dc" style={{ padding: "22px 24px", marginBottom: 16 }}>
          <CardHead label="Market Context" title="Industry & Market Summary" />
          <p style={{ fontSize: 14, lineHeight: 1.84, color: "var(--t2)", margin: 0 }}>{data.industry_summary}</p>
        </div>

        {/* ── Row 3: Financial Insights + Red Flags ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div className="dc" style={{ padding: "22px 24px" }}>
            <CardHead label="Financial Analysis" title="Key Financial Insights" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.financial_insights.map((ins, i) => (
                <div key={i}
                  style={{
                    display: "flex", gap: 12, padding: "11px 13px",
                    background: "rgba(26,44,69,.4)", borderRadius: 8,
                    border: "1px solid var(--b)", transition: "border-color .2s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,.25)"}
                  onMouseLeave={e => e.currentTarget.style.borderColor = "var(--b)"}
                >
                  <span style={{ fontFamily: "var(--fm)", fontSize: 10, color: "var(--gold)", fontWeight: 600, flexShrink: 0, marginTop: 2 }}>
                    F{String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--t)" }}>{ins}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Red Flags */}
          <div className="dc" style={{ padding: "22px 24px", border: "1px solid rgba(255,63,96,.16)" }}>
            <CardHead label="⚠ Diligence Alerts" title="Operational Red Flags" />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {data.red_flags.map((f, i) => (
                <div key={i} style={{
                  padding: "12px 14px", borderRadius: 9,
                  background: "rgba(255,63,96,.055)",
                  border: "1px solid rgba(255,63,96,.16)",
                }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ color: "var(--red)", fontSize: 14, flexShrink: 0, marginTop: 1 }}>⚠</span>
                    <div>
                      <span style={{ fontSize: 13, lineHeight: 1.55, color: "var(--t)" }}>{f.text}</span>
                      <div style={{ marginTop: 6 }}><SevBadge s={f.severity} /></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 4: Strengths + Risks ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div className="dc" style={{ padding: "22px 24px" }}>
            <CardHead label="Investment Merits" title="Key Strengths" />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {data.strengths.map((s, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "11px 13px", borderRadius: 8,
                  border: "1px solid rgba(16,217,154,.16)",
                  background: "rgba(16,217,154,.04)",
                }}>
                  <span style={{ color: "var(--em)", flexShrink: 0, marginTop: 2, fontSize: 12 }}>✓</span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--t)" }}>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="dc" style={{ padding: "22px 24px" }}>
            <CardHead label="Risk Register" title="Major Investment Risks" />
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {data.risks.map((r, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, alignItems: "flex-start",
                  padding: "11px 13px", borderRadius: 8,
                  border: "1px solid rgba(201,168,76,.15)",
                  background: "rgba(201,168,76,.04)",
                }}>
                  <span style={{ color: "var(--gold)", flexShrink: 0, marginTop: 2, fontSize: 11 }}>◆</span>
                  <span style={{ fontSize: 13.5, lineHeight: 1.55, color: "var(--t)" }}>{r}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Row 5: SWOT ── */}
        <div className="dc" style={{ padding: "22px 24px", marginBottom: 16 }}>
          <CardHead label="Strategic Analysis" title="SWOT Framework" />
          <SwotGrid swot={data.swot} />
        </div>

        {/* ── Row 6: Risk Heatmap ── */}
        <div className="dc" style={{ padding: "22px 24px", marginBottom: 16 }}>
          <CardHead label="Risk Quantification" title="Risk Heatmap" />
          <RiskHeatmap heatmap={data.risk_heatmap} />
        </div>

        {/* ── Row 7: DD Questions ── */}
        <div className="dc" style={{ padding: "22px 24px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div>
              <div className="ml" style={{ marginBottom: 5 }}>IC Preparation</div>
              <h3 style={{ fontFamily: "var(--fd)", fontSize: 20, fontWeight: 600, margin: 0, color: "var(--t)" }}>
                Due Diligence Questions
              </h3>
            </div>
            <span style={{ fontFamily: "var(--fm)", fontSize: 11, color: "var(--t2)" }}>
              {data.dd_questions.length} questions generated
            </span>
          </div>
          <DDPanel questions={data.dd_questions} />
        </div>

        {/* ── IC Memo CTA ── */}
        <div className="dc" style={{
          padding: "28px 32px",
          border: "1px solid rgba(201,168,76,.22)",
          background: "linear-gradient(135deg,rgba(201,168,76,.04) 0%,rgba(15,24,40,.85) 100%)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: 24, flexWrap: "wrap",
        }}>
          <div>
            <div className="ml" style={{ marginBottom: 8 }}>Final Deliverable</div>
            <div style={{ fontFamily: "var(--fd)", fontSize: 24, fontWeight: 700, color: "var(--t)", marginBottom: 7 }}>
              Generate Investment Committee Memo
            </div>
            <div style={{ fontSize: 13.5, color: "var(--t2)", maxWidth: 520 }}>
              Export a fully formatted IC memo with executive summary, investment thesis, risk register, and recommendation — ready for partner review.
            </div>
          </div>
          <button className="bg" style={{ padding: "14px 34px", fontSize: 15, flexShrink: 0 }} onClick={() => setIcOpen(true)}>
            View IC Memo →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP — root component
// ═══════════════════════════════════════════════════════════════════════════
export default function App() {
  const [stage,   setStage]   = useState("landing");
  const [dragging,setDragging]= useState(false);
  const [fileName,setFileName]= useState("");
  const [step,    setStep]    = useState(0);
  const fileRef = useRef(null);

  // Inject CSS once
  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = GLOBAL_CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  const runSim = useCallback((name) => {
    setFileName(name);
    setStage("processing");
    setStep(0);
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setStep(i);
      if (i >= STEPS.length) {
        clearInterval(iv);
        setTimeout(() => setStage("dashboard"), 600);
      }
    }, 500);
  }, []);

  const handleFile = useCallback(file => { if (file) runSim(file.name); }, [runSim]);

  const onDrop     = useCallback(e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]); }, [handleFile]);
  const onDragOver = useCallback(e => { e.preventDefault(); setDragging(true); },  []);
  const onDragLeave= useCallback(() => setDragging(false), []);

  if (stage === "landing") return (
    <Landing
      onFileChange={e => handleFile(e.target.files[0])}
      onDemo={() => runSim("Meridian_Packaging_Holdings_CIM_2024.pdf")}
      isDragging={dragging}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      fileRef={fileRef}
    />
  );

  if (stage === "processing") return (
    <Processing steps={STEPS} current={step} fileName={fileName} />
  );

  return <Dashboard data={DATA} fileName={fileName} onReset={() => setStage("landing")} />;
}
