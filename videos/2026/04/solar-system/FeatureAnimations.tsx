import React, { useMemo } from "react";

/**
 * Per-planet animated feature demonstrations.
 * Each planet gets 2 features rendered as SVG animations.
 */

const W = 740;
const H = 400;
const CX = W / 2;
const CY = H / 2;
const FF = "system-ui, sans-serif";

/* ── timing helpers ─────────────────────────────────────────────── */
/** visibility envelope: fade in / sustain / fade out */
function vis(p: number) {
  if (p < 0.1) return p / 0.1;
  if (p > 0.9) return (1 - p) / 0.1;
  return 1;
}
/** eased progress (0→1) over the main portion of the animation */
function mp(p: number) {
  const t = Math.max(0, Math.min(1, (p - 0.08) / 0.75));
  return t * t * (3 - 2 * t); // smoothstep
}

function srand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

/* ══════════════════════════════════════════════════════════════════
   MERCURY
   ══════════════════════════════════════════════════════════════════ */

/** Temperature extremes: hot/cold split */
function mercuryTemp(p: number, c: string) {
  const m = mp(p);
  const hotH = m * 300;
  const coldH = m * 300;
  const shimmer = Math.sin(p * 40) * 0.15;
  return (
    <g opacity={vis(p)}>
      <defs>
        <linearGradient id="hotGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#ff2200" />
          <stop offset="50%" stopColor="#ff6600" />
          <stop offset="100%" stopColor="#ffbb30" />
        </linearGradient>
        <linearGradient id="coldGrad" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#0022aa" />
          <stop offset="50%" stopColor="#2255cc" />
          <stop offset="100%" stopColor="#55aaee" />
        </linearGradient>
      </defs>

      {/* Hot side */}
      <rect x={50} y={50} width={290} height={300} rx={12} fill="none" stroke="rgba(255,120,40,0.25)" strokeWidth={1.5} />
      <rect x={50} y={350 - hotH} width={290} height={hotH} rx={12} fill="url(#hotGrad)" opacity={0.7} />
      {/* Heat shimmer waves */}
      {m > 0.3 && [0, 1, 2].map((i) => (
        <path key={i} d={`M ${100 + i * 80},${350 - hotH + 10} Q ${115 + i * 80},${350 - hotH - 5 + shimmer * 20} ${130 + i * 80},${350 - hotH + 10}`}
          fill="none" stroke="rgba(255,200,100,0.3)" strokeWidth={2} />
      ))}
      <text x={195} y={m > 0.3 ? 350 - hotH + 40 : -50} textAnchor="middle" fill="white" fontSize={44} fontWeight={800} fontFamily={FF} opacity={m > 0.3 ? 1 : 0} filter="url(#glow)">
        +430 °C
      </text>
      <text x={195} y={378} textAnchor="middle" fill="#ff9960" fontSize={18} fontWeight={600} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>
        DAY SIDE
      </text>

      {/* Cold side */}
      <rect x={400} y={50} width={290} height={300} rx={12} fill="none" stroke="rgba(60,100,200,0.25)" strokeWidth={1.5} />
      <rect x={400} y={350 - coldH} width={290} height={coldH} rx={12} fill="url(#coldGrad)" opacity={0.6} />
      {/* Frost crystals */}
      {m > 0.4 && [0, 1, 2, 3].map((i) => (
        <text key={i} x={430 + i * 60} y={350 - coldH + 15} fill="rgba(200,230,255,0.5)" fontSize={14}>❄</text>
      ))}
      <text x={545} y={m > 0.3 ? 350 - coldH + 40 : -50} textAnchor="middle" fill="white" fontSize={44} fontWeight={800} fontFamily={FF} opacity={m > 0.3 ? 1 : 0} filter="url(#glow)">
        −180 °C
      </text>
      <text x={545} y={378} textAnchor="middle" fill="#6699dd" fontSize={18} fontWeight={600} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>
        NIGHT SIDE
      </text>

      {/* Delta label — BIG */}
      <text x={CX} y={32} textAnchor="middle" fill={c} fontSize={32} fontWeight={800} fontFamily={FF} opacity={m > 0.5 ? 1 : 0} filter="url(#glow)">
        Δ 600 °C
      </text>
      {/* Connecting double-arrow */}
      <line x1={340} y1={200} x2={400} y2={200} stroke="rgba(255,255,255,0.4)" strokeWidth={2} strokeDasharray="6,4" opacity={m > 0.4 ? 1 : 0} />
      <polygon points="338,195 328,200 338,205" fill="rgba(255,150,80,0.5)" opacity={m > 0.4 ? 1 : 0} />
      <polygon points="402,195 412,200 402,205" fill="rgba(100,150,255,0.5)" opacity={m > 0.4 ? 1 : 0} />
    </g>
  );
}

/** Ice in shadowed craters — cross-section diagram */
function mercuryIce(p: number, c: string) {
  const m = mp(p);
  // Cross-section view of a crater on Mercury's surface
  const surfaceY = 160;
  const craterLeft = 200;
  const craterRight = 540;
  const craterBottom = 320;
  const craterMid = (craterLeft + craterRight) / 2;
  const iceAppear = Math.max(0, (m - 0.45) / 0.4); // ice appears in second half

  return (
    <g opacity={vis(p)}>
      {/* ── Sun (upper right) ── */}
      <circle cx={640} cy={50} r={30} fill="#ffdd66" opacity={m * 0.9} filter="url(#glow)" />
      <circle cx={640} cy={50} r={45} fill="rgba(255,220,80,0.15)" opacity={m * 0.6} />

      {/* ── Sun rays hitting right crater wall ── */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const startX = 630 - i * 8;
        const startY = 70 + i * 5;
        const endX = craterMid + 40 + i * 25;
        const endY = surfaceY + 20 + i * 25;
        return (
          <line key={i} x1={startX} y1={startY} x2={endX} y2={Math.min(endY, craterBottom - 20)}
            stroke="rgba(255,220,100,0.2)" strokeWidth={2} opacity={m > 0.15 ? 1 : 0} />
        );
      })}

      {/* ── Surface (ground level) ── */}
      <rect x={60} y={surfaceY} width={craterLeft - 60} height={220} fill="rgba(100,85,70,0.4)" rx={0} opacity={m} />
      <rect x={craterRight} y={surfaceY} width={W - craterRight - 60} height={220} fill="rgba(100,85,70,0.4)" rx={0} opacity={m} />
      <line x1={60} y1={surfaceY} x2={craterLeft} y2={surfaceY} stroke="rgba(160,140,120,0.6)" strokeWidth={2} opacity={m} />
      <line x1={craterRight} y1={surfaceY} x2={W - 60} y2={surfaceY} stroke="rgba(160,140,120,0.6)" strokeWidth={2} opacity={m} />
      <text x={100} y={surfaceY - 10} fill="rgba(160,140,120,0.6)" fontSize={13} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>Surface</text>

      {/* ── Crater V-shape ── */}
      {/* Left wall */}
      <line x1={craterLeft} y1={surfaceY} x2={craterMid - 10} y2={craterBottom} stroke="rgba(140,120,100,0.6)" strokeWidth={2.5} opacity={m} />
      {/* Right wall (sunlit) */}
      <line x1={craterRight} y1={surfaceY} x2={craterMid + 10} y2={craterBottom} stroke="rgba(200,180,140,0.7)" strokeWidth={2.5} opacity={m} />
      {/* Crater floor */}
      <line x1={craterMid - 10} y1={craterBottom} x2={craterMid + 10} y2={craterBottom} stroke="rgba(120,100,80,0.5)" strokeWidth={2} opacity={m} />

      {/* ── Right wall lit by sun (brighter) ── */}
      <polygon
        points={`${craterMid + 10},${craterBottom} ${craterRight},${surfaceY} ${craterRight - 15},${surfaceY + 10} ${craterMid + 15},${craterBottom - 5}`}
        fill="rgba(180,160,120,0.15)" opacity={m}
      />
      {/* "Sunlit" label on right wall */}
      <text x={craterRight - 30} y={surfaceY + 80} fill="rgba(255,220,100,0.6)" fontSize={13} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}
        transform={`rotate(-50, ${craterRight - 30}, ${surfaceY + 80})`}>
        Sunlit
      </text>

      {/* ── Left wall in permanent shadow (dark) ── */}
      <polygon
        points={`${craterMid - 10},${craterBottom} ${craterLeft},${surfaceY} ${craterLeft + 15},${surfaceY + 10} ${craterMid - 5},${craterBottom - 5}`}
        fill="rgba(5,5,20,0.5)" opacity={m}
      />

      {/* ── "Permanent Shadow" zone ── */}
      <polygon
        points={`${craterMid - 70},${craterBottom - 40} ${craterMid - 10},${craterBottom} ${craterMid + 10},${craterBottom} ${craterMid - 30},${craterBottom - 40}`}
        fill="rgba(5,5,20,0.4)" opacity={m > 0.2 ? 1 : 0}
      />
      <text x={craterLeft + 30} y={(surfaceY + craterBottom) / 2 + 20} fill="rgba(150,150,200,0.6)" fontSize={12} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}
        transform={`rotate(50, ${craterLeft + 30}, ${(surfaceY + craterBottom) / 2 + 20})`}>
        Permanent Shadow
      </text>

      {/* ── ICE at crater bottom ── */}
      {iceAppear > 0 && (
        <g opacity={iceAppear}>
          {/* Ice block */}
          <rect x={craterMid - 45} y={craterBottom - 25} width={50} height={25} rx={3}
            fill="rgba(150,200,255,0.6)" stroke="rgba(200,230,255,0.8)" strokeWidth={1} filter="url(#glow)" />
          {/* Ice crystals */}
          <polygon points={`${craterMid - 35},${craterBottom - 25} ${craterMid - 30},${craterBottom - 38} ${craterMid - 25},${craterBottom - 25}`}
            fill="rgba(180,220,255,0.7)" />
          <polygon points={`${craterMid - 20},${craterBottom - 25} ${craterMid - 17},${craterBottom - 33} ${craterMid - 14},${craterBottom - 25}`}
            fill="rgba(200,230,255,0.6)" />
          {/* Sparkle */}
          <circle cx={craterMid - 25} cy={craterBottom - 32} r={3}
            fill="white" opacity={0.6 + 0.4 * Math.sin(iceAppear * 15)} filter="url(#glow)" />
          {/* ICE label */}
          <text x={craterMid - 20} y={craterBottom - 6} textAnchor="middle"
            fill="rgba(200,230,255,0.95)" fontSize={18} fontWeight={700} fontFamily={FF} filter="url(#glow)">
            ICE
          </text>
        </g>
      )}

      {/* ── "Closest to the Sun, yet…" annotation ── */}
      <text x={CX} y={385} textAnchor="middle" fill="rgba(200,220,255,0.7)" fontSize={15} fontWeight={500} fontFamily={FF} opacity={m > 0.55 ? 1 : 0}>
        Sunlight never reaches the crater floor
      </text>

      {/* ── "Sun →" direction label ── */}
      <text x={580} y={45} fill="rgba(255,220,100,0.5)" fontSize={14} fontFamily={FF} opacity={m > 0.15 ? 1 : 0}>
        Sun ☀
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   VENUS
   ══════════════════════════════════════════════════════════════════ */

/** Retrograde rotation comparison */
function venusRetro(p: number, c: string) {
  const m = mp(p);
  const angle = m * 540; // spin amount in degrees
  const R = 70;
  // Arrow arc helper
  const arcArrow = (cx: number, cy: number, clockwise: boolean, color: string) => {
    const dir = clockwise ? 1 : -1;
    const a1 = -60 * (Math.PI / 180);
    const a2 = 180 * (Math.PI / 180);
    const arR = R + 18;
    return (
      <g>
        <path
          d={`M ${cx + Math.cos(a1 * dir) * arR},${cy + Math.sin(a1 * dir) * arR} A ${arR},${arR} 0 1 ${clockwise ? 1 : 0} ${cx + Math.cos(a2 * dir) * arR},${cy + Math.sin(a2 * dir) * arR}`}
          fill="none" stroke={color} strokeWidth={2.5} opacity={m > 0.3 ? 0.7 : 0}
          markerEnd={`url(#arr${clockwise ? 'CW' : 'CCW'})`}
        />
      </g>
    );
  };
  return (
    <g opacity={vis(p)}>
      <defs>
        <marker id="arrCCW" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill="#8888aa" /></marker>
        <marker id="arrCW" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto"><polygon points="0,0 8,3 0,6" fill={c} /></marker>
      </defs>

      {/* Normal planet (left) */}
      <g transform={`translate(200, ${CY - 10})`}>
        <circle r={R} fill="#555" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
        {/* Surface dot rotating CCW */}
        <circle cx={Math.cos(-angle * Math.PI / 180) * R * 0.6} cy={Math.sin(-angle * Math.PI / 180) * R * 0.6} r={8} fill="#8888aa" opacity={0.8} />
        {arcArrow(0, 0, false, "#8888aa")}
        <text x={0} y={R + 45} textAnchor="middle" fill="#8888aa" fontSize={17} fontFamily={FF}>Most Planets</text>
      </g>

      {/* Venus (right) */}
      <g transform={`translate(540, ${CY - 10})`}>
        <circle r={R} fill="#8a6520" stroke={`${c}40`} strokeWidth={1.5} />
        {/* Surface dot rotating CW (retrograde!) */}
        <circle cx={Math.cos(angle * Math.PI / 180) * R * 0.6} cy={Math.sin(angle * Math.PI / 180) * R * 0.6} r={8} fill={c} opacity={0.9} />
        {arcArrow(0, 0, true, c)}
        <text x={0} y={R + 45} textAnchor="middle" fill={c} fontSize={17} fontWeight={600} fontFamily={FF}>Venus</text>
      </g>

      {/* Motion trails behind surface dots */}
      <g transform={`translate(200, ${CY - 10})`} opacity={0.2}>
        {[1, 2, 3].map((t) => {
          const a = (-angle + t * 15) * Math.PI / 180;
          return <circle key={t} cx={Math.cos(a) * R * 0.6} cy={Math.sin(a) * R * 0.6} r={8 - t * 2} fill="#8888aa" />;
        })}
      </g>
      <g transform={`translate(540, ${CY - 10})`} opacity={0.2}>
        {[1, 2, 3].map((t) => {
          const a = (angle - t * 15) * Math.PI / 180;
          return <circle key={t} cx={Math.cos(a) * R * 0.6} cy={Math.sin(a) * R * 0.6} r={8 - t * 2} fill={c} />;
        })}
      </g>

      {/* VS */}
      <text x={CX} y={CY - 5} textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize={32} fontWeight={800} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>vs</text>
    </g>
  );
}

/** Day longer than year: racing arcs */
function venusDayYear(p: number, c: string) {
  const m = mp(p);
  const yearFrac = Math.min(1, m * 1.3); // year completes at ~77% through
  const dayFrac = Math.min(1, m * 1.3 * (225 / 243)); // day is slower
  const R = 120;
  const arcPath = (radius: number, frac: number) => {
    if (frac <= 0) return "";
    const angle = frac * 360;
    const rad = (angle - 90) * (Math.PI / 180);
    const large = angle > 180 ? 1 : 0;
    const ex = CX + Math.cos(rad) * radius;
    const ey = CY + Math.sin(rad) * radius;
    return `M ${CX},${CY - radius} A ${radius},${radius} 0 ${large} 1 ${ex},${ey}`;
  };
  return (
    <g opacity={vis(p)}>
      {/* Year arc (inner, faster) */}
      <circle cx={CX} cy={CY} r={R - 20} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={16} />
      <path d={arcPath(R - 20, yearFrac)} fill="none" stroke="#aa88ff" strokeWidth={16} strokeLinecap="round" />
      <text x={CX + R + 45} y={CY - 30} fill="#aa88ff" fontSize={16} fontWeight={600} fontFamily={FF} opacity={m > 0.1 ? 1 : 0}>
        1 Year
      </text>
      <text x={CX + R + 45} y={CY - 10} fill="#aa88ff" fontSize={13} fontFamily={FF} opacity={m > 0.1 ? 0.7 : 0}>
        225 days
      </text>
      {yearFrac >= 1 && (
        <text x={CX + R + 45} y={CY - 50} fill="#aa88ff" fontSize={20} fontWeight={700} fontFamily={FF}>✓</text>
      )}

      {/* Day arc (outer, slower) */}
      <circle cx={CX} cy={CY} r={R + 20} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={16} />
      <path d={arcPath(R + 20, dayFrac)} fill="none" stroke={c} strokeWidth={16} strokeLinecap="round" />
      <text x={CX + R + 45} y={CY + 25} fill={c} fontSize={16} fontWeight={600} fontFamily={FF} opacity={m > 0.1 ? 1 : 0}>
        1 Day
      </text>
      <text x={CX + R + 45} y={CY + 45} fill={c} fontSize={13} fontFamily={FF} opacity={m > 0.1 ? 0.7 : 0}>
        243 days
      </text>

      {/* Center label */}
      <text x={CX} y={CY + 5} textAnchor="middle" fill="white" fontSize={18} fontWeight={600} fontFamily={FF} opacity={m > 0.5 ? 0.8 : 0}>
        Year finishes first!
      </text>
      {/* Flash when year completes */}
      {yearFrac >= 1 && (
        <circle cx={CX} cy={CY} r={R * 0.3} fill="#aa88ff" opacity={Math.max(0, 1 - (m - 0.77) * 8) * 0.3} filter="url(#bigGlow)" />
      )}
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   EARTH
   ══════════════════════════════════════════════════════════════════ */

/** Magnetic shield deflecting solar wind */
function earthMagnetic(p: number, c: string) {
  const m = mp(p);
  const particles = useMemo(() => {
    const rng = srand(99);
    return Array.from({ length: 14 }, () => ({
      y0: 60 + rng() * 280,
      speed: 0.6 + rng() * 0.4,
      size: 2 + rng() * 2.5,
    }));
  }, []);
  const earthX = 370;
  const earthY = CY;
  const earthR = 45;
  const fieldR = 130;
  return (
    <g opacity={vis(p)}>
      {/* Magnetic field lines */}
      {[0.7, 1.0, 1.3].map((s, i) => (
        <React.Fragment key={i}>
          <path d={`M ${earthX},${earthY - earthR * 1.1} C ${earthX + fieldR * s},${earthY - fieldR * 0.4} ${earthX + fieldR * s},${earthY + fieldR * 0.4} ${earthX},${earthY + earthR * 1.1}`}
            fill="none" stroke={`${c}40`} strokeWidth={1.5} strokeDasharray="5,4" opacity={m > 0.15 ? 1 : 0} />
          <path d={`M ${earthX},${earthY - earthR * 1.1} C ${earthX - fieldR * s},${earthY - fieldR * 0.4} ${earthX - fieldR * s},${earthY + fieldR * 0.4} ${earthX},${earthY + earthR * 1.1}`}
            fill="none" stroke={`${c}40`} strokeWidth={1.5} strokeDasharray="5,4" opacity={m > 0.15 ? 1 : 0} />
        </React.Fragment>
      ))}
      {/* Earth */}
      <circle cx={earthX} cy={earthY} r={earthR} fill="#1a4488" stroke={`${c}60`} strokeWidth={1.5} />
      <ellipse cx={earthX - 5} cy={earthY - 5} rx={15} ry={20} fill="#2d8c4e" opacity={0.6} />
      {/* Aurora glow */}
      <ellipse cx={earthX} cy={earthY - earthR - 5} rx={22} ry={7} fill={c} opacity={0.5 * (0.5 + 0.5 * Math.sin(m * 20))} filter="url(#glow)" />
      <ellipse cx={earthX} cy={earthY + earthR + 5} rx={18} ry={5} fill={c} opacity={0.3 * (0.5 + 0.5 * Math.sin(m * 20 + 1))} filter="url(#glow)" />
      {/* Solar wind particles */}
      {particles.map((pt, i) => {
        const t = ((m * pt.speed + i * 0.07) % 1);
        const rawX = t * (W + 60) - 30;
        // Deflect near the field
        const dx = rawX - earthX;
        const dy = pt.y0 - earthY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let py = pt.y0;
        if (rawX > earthX - fieldR && rawX < earthX + fieldR && dist < fieldR) {
          const push = ((fieldR - dist) / fieldR) * 60 * Math.sign(dy || 1);
          py = pt.y0 + push;
        }
        return (
          <circle key={i} cx={rawX} cy={py} r={pt.size} fill="#ffcc44" opacity={m > 0.1 ? 0.6 : 0} />
        );
      })}
      {/* "Sun" label left */}
      <text x={40} y={CY + 4} fill="#ffcc44" fontSize={13} fontFamily={FF} opacity={m > 0.3 ? 0.5 : 0}>Solar Wind →</text>
    </g>
  );
}

/** 71% ocean fill */
function earthOcean(p: number, c: string) {
  const m = mp(p);
  const R = 110;
  const fillLevel = m * 0.71; // 0→0.71
  const fillY = CY + R - fillLevel * R * 2;
  const pct = Math.round(fillLevel / 0.71 * 71);
  return (
    <g opacity={vis(p)}>
      <defs>
        <clipPath id="earthClipOcean"><circle cx={CX} cy={CY} r={R} /></clipPath>
      </defs>
      {/* Planet outline */}
      <circle cx={CX} cy={CY} r={R} fill="#1a2840" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} />
      {/* Water fill */}
      <rect x={CX - R} y={fillY} width={R * 2} height={R * 2} fill="#1155aa" opacity={0.7} clipPath="url(#earthClipOcean)" />
      {/* Wave line */}
      <path d={`M ${CX - R},${fillY} Q ${CX - R * 0.5},${fillY - 6} ${CX},${fillY} Q ${CX + R * 0.5},${fillY + 6} ${CX + R},${fillY}`}
        fill="none" stroke="rgba(100,180,255,0.5)" strokeWidth={2} clipPath="url(#earthClipOcean)" />
      {/* Second wave layer */}
      <path d={`M ${CX - R},${fillY + 5} Q ${CX - R * 0.3},${fillY + 10} ${CX + R * 0.2},${fillY + 3} Q ${CX + R * 0.7},${fillY - 3} ${CX + R},${fillY + 5}`}
        fill="none" stroke="rgba(100,180,255,0.3)" strokeWidth={1.5} clipPath="url(#earthClipOcean)" />
      {/* Percentage — BIG */}
      <text x={CX} y={CY + 15} textAnchor="middle" fill="white" fontSize={56} fontWeight={800} fontFamily={FF} filter="url(#glow)">
        {pct}%
      </text>
      <text x={CX} y={CY + 42} textAnchor="middle" fill="rgba(100,180,255,0.9)" fontSize={20} fontWeight={600} fontFamily={FF}>
        ocean
      </text>
      {/* Land label at top */}
      <text x={CX} y={CY - R - 15} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize={14} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}>
        29% land
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   MARS
   ══════════════════════════════════════════════════════════════════ */

/** Olympus Mons vs Everest height comparison */
function marsHeight(p: number, c: string) {
  const m = mp(p);
  const maxH = 280;
  const everestH = (8.8 / 21.9) * maxH * m;
  const olympusH = maxH * m;
  const baseY = 350;
  return (
    <g opacity={vis(p)}>
      {/* Grid lines */}
      {[0, 5, 10, 15, 20].map((km) => {
        const y = baseY - (km / 21.9) * maxH;
        return (
          <g key={km} opacity={m > 0.2 ? 0.25 : 0}>
            <line x1={80} y1={y} x2={660} y2={y} stroke="white" strokeWidth={0.5} strokeDasharray="3,5" />
            <text x={70} y={y + 4} textAnchor="end" fill="white" fontSize={11} fontFamily={FF}>{km} km</text>
          </g>
        );
      })}
      {/* Everest */}
      <polygon points={`${230},${baseY} ${280},${baseY - everestH} ${330},${baseY}`} fill="rgba(150,150,150,0.5)" stroke="rgba(200,200,200,0.4)" strokeWidth={1} />
      <text x={280} y={baseY + 25} textAnchor="middle" fill="#aaa" fontSize={15} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}>Mt. Everest</text>
      <text x={280} y={baseY + 42} textAnchor="middle" fill="#aaa" fontSize={13} fontFamily={FF} opacity={m > 0.4 ? 0.7 : 0}>8.8 km</text>

      {/* Olympus Mons */}
      <polygon points={`${400},${baseY} ${490},${baseY - olympusH} ${580},${baseY}`} fill={`${c}80`} stroke={`${c}aa`} strokeWidth={1.5} />
      <text x={490} y={baseY + 25} textAnchor="middle" fill={c} fontSize={15} fontWeight={600} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}>Olympus Mons</text>
      <text x={490} y={baseY + 42} textAnchor="middle" fill={c} fontSize={13} fontFamily={FF} opacity={m > 0.4 ? 0.7 : 0}>21.9 km</text>

      {/* Comparison label — bigger */}
      <text x={CX} y={30} textAnchor="middle" fill="white" fontSize={24} fontWeight={700} fontFamily={FF} opacity={m > 0.6 ? 0.8 : 0} filter="url(#glow)">
        2.5× taller
      </text>
      {/* Snow cap on Olympus */}
      {m > 0.5 && <ellipse cx={490} cy={baseY - olympusH + 5} rx={18 * m} ry={5 * m} fill="rgba(230,240,255,0.5)" />}
      {/* Cloud line at ~10km */}
      {m > 0.4 && <line x1={100} y1={baseY - (10 / 21.9) * maxH} x2={640} y2={baseY - (10 / 21.9) * maxH} stroke="rgba(200,200,255,0.12)" strokeWidth={12} />}
    </g>
  );
}

/** Blue sunsets */
function marsSunset(p: number, c: string) {
  const m = mp(p);
  const sunY = 220 + (1 - m) * 40; // sun descends slightly
  const sunX = CX;
  return (
    <g opacity={vis(p)}>
      <defs>
        <radialGradient id="marsSky" cx="50%" cy="55%" r="60%">
          <stop offset="0%" stopColor="#4466cc" />
          <stop offset="40%" stopColor="#556699" />
          <stop offset="100%" stopColor="#884422" />
        </radialGradient>
      </defs>
      {/* Sky */}
      <rect x={70} y={40} width={600} height={280} rx={12} fill="url(#marsSky)" opacity={m * 0.8} />
      {/* Sun disc with lens flare */}
      <circle cx={sunX} cy={sunY} r={30} fill="#ffeedd" opacity={m * 0.95} filter="url(#glow)" />
      <circle cx={sunX} cy={sunY} r={55} fill="rgba(100,140,220,0.25)" opacity={m * 0.7} />
      <circle cx={sunX} cy={sunY} r={90} fill="rgba(80,120,200,0.12)" opacity={m * 0.5} />
      <circle cx={sunX} cy={sunY} r={130} fill="rgba(70,100,180,0.05)" opacity={m * 0.4} />
      {/* Lens flare streaks */}
      <line x1={sunX - 60} y1={sunY} x2={sunX + 60} y2={sunY} stroke="rgba(150,180,255,0.15)" strokeWidth={1.5} opacity={m > 0.3 ? 1 : 0} />
      <line x1={sunX} y1={sunY - 40} x2={sunX} y2={sunY + 40} stroke="rgba(150,180,255,0.1)" strokeWidth={1} opacity={m > 0.3 ? 1 : 0} />
      {/* Horizon */}
      <rect x={70} y={280} width={600} height={80} rx={0} fill="#553322" opacity={m * 0.9} />
      <line x1={70} y1={280} x2={670} y2={280} stroke="rgba(200,150,100,0.4)" strokeWidth={1.5} opacity={m} />
      {/* Rocks silhouette */}
      <polygon points="70,320 120,270 160,290 200,260 250,285 300,320" fill="rgba(40,20,10,0.6)" opacity={m} />
      <polygon points="500,320 540,280 570,295 620,265 670,290 670,320" fill="rgba(40,20,10,0.6)" opacity={m} />
      {/* Label */}
      <text x={CX} y={380} textAnchor="middle" fill="#6688bb" fontSize={16} fontWeight={500} fontFamily={FF} opacity={m > 0.4 ? 0.8 : 0}>
        Martian sunsets glow blue
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   JUPITER
   ══════════════════════════════════════════════════════════════════ */

/** Size comparison: 1321 Earths */
function jupiterSize(p: number, c: string) {
  const m = mp(p);
  const jR = 140 * m;
  const eR = 12;
  return (
    <g opacity={vis(p)}>
      {/* Jupiter */}
      <circle cx={330} cy={CY} r={jR} fill={`${c}60`} stroke={`${c}90`} strokeWidth={2} />
      {/* Bands on Jupiter */}
      <clipPath id="jClipSize"><circle cx={330} cy={CY} r={jR} /></clipPath>
      <g clipPath="url(#jClipSize)">
        {[-0.5, -0.2, 0.1, 0.4].map((y, i) => (
          <rect key={i} x={330 - jR} y={CY + y * jR} width={jR * 2} height={jR * 0.12} fill="rgba(255,200,100,0.3)" />
        ))}
      </g>
      {/* Earth dot */}
      <circle cx={560} cy={CY} r={eR} fill="#2266bb" stroke="#55aaee" strokeWidth={1.5} opacity={m > 0.4 ? 1 : 0} />
      <text x={560} y={CY - 22} textAnchor="middle" fill="#55aaee" fontSize={14} fontFamily={FF} opacity={m > 0.4 ? 0.8 : 0}>Earth</text>
      {/* Multiplier — BIG and glowing */}
      <text x={560} y={CY + 45} textAnchor="middle" fill="white" fontSize={48} fontWeight={800} fontFamily={FF} opacity={m > 0.5 ? 1 : 0} filter="url(#glow)">
        ×1 321
      </text>
      {/* Arrow */}
      <line x1={490} y1={CY} x2={540} y2={CY} stroke="rgba(255,255,255,0.3)" strokeWidth={1} markerEnd="url(#sizeArr)" opacity={m > 0.5 ? 1 : 0} />
      <defs><marker id="sizeArr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0,0 6,2 0,4" fill="rgba(255,255,255,0.3)" /></marker></defs>
    </g>
  );
}

/** Great Red Spot — swirling storm */
function jupiterSpot(p: number, c: string) {
  const m = mp(p);
  const swirl = m * 720;
  const spotRx = 110;
  const spotRy = 70;
  return (
    <g opacity={vis(p)}>
      {/* Spot background */}
      <ellipse cx={CX - 40} cy={CY - 10} rx={spotRx * m} ry={spotRy * m} fill="#aa3018" opacity={0.8} />
      <ellipse cx={CX - 40} cy={CY - 10} rx={spotRx * 0.7 * m} ry={spotRy * 0.65 * m} fill="#cc5030" opacity={0.5} />
      {/* Swirl lines */}
      {[0, 60, 120, 180, 240, 300].map((a, i) => {
        const angle = (a + swirl) * (Math.PI / 180);
        const r1 = spotRx * 0.3 * m;
        const r2 = spotRx * 0.75 * m;
        return (
          <line key={i}
            x1={CX - 40 + Math.cos(angle) * r1}
            y1={CY - 10 + Math.sin(angle) * r1 * 0.65}
            x2={CX - 40 + Math.cos(angle + 0.5) * r2}
            y2={CY - 10 + Math.sin(angle + 0.5) * r2 * 0.65}
            stroke="rgba(220,100,60,0.4)" strokeWidth={2} strokeLinecap="round"
          />
        );
      })}
      {/* Earth comparison circle */}
      <circle cx={CX + 140} cy={CY + 60} r={14} fill="#2266bb" stroke="#55aaee" strokeWidth={1.5} opacity={m > 0.5 ? 1 : 0} />
      <text x={CX + 140} y={CY + 90} textAnchor="middle" fill="#55aaee" fontSize={13} fontFamily={FF} opacity={m > 0.5 ? 0.7 : 0}>Earth</text>
      <text x={CX + 140} y={CY + 106} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={12} fontFamily={FF} opacity={m > 0.6 ? 1 : 0}>for scale</text>
      {/* Label */}
      <text x={CX - 40} y={50} textAnchor="middle" fill="white" fontSize={18} fontWeight={600} fontFamily={FF} opacity={m > 0.3 ? 0.8 : 0}>
        Great Red Spot — centuries old
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   SATURN
   ══════════════════════════════════════════════════════════════════ */

/** Float in water */
function saturnFloat(p: number, c: string) {
  const m = mp(p);
  // Saturn descends, then floats at waterline
  const waterY = 260;
  const targetY = waterY - 35; // floats slightly above water
  const saturnY = m < 0.5 ? 80 + (targetY - 80) * (m / 0.5) : targetY + Math.sin(m * 12) * 3;
  const saturnR = 40;
  return (
    <g opacity={vis(p)}>
      {/* Water */}
      <rect x={80} y={waterY} width={580} height={150} fill="rgba(20,60,140,0.35)" rx={4} />
      <line x1={80} y1={waterY} x2={660} y2={waterY} stroke="rgba(60,120,220,0.5)" strokeWidth={2} />
      {/* Wave */}
      <path d={`M 80,${waterY} Q 200,${waterY - 4} 320,${waterY} Q 440,${waterY + 4} 560,${waterY} Q 620,${waterY - 3} 660,${waterY}`}
        fill="none" stroke="rgba(60,120,220,0.3)" strokeWidth={1.5} />
      <text x={650} y={waterY + 25} textAnchor="end" fill="rgba(60,120,220,0.5)" fontSize={13} fontFamily={FF}>water (1 000 kg/m³)</text>

      {/* Saturn */}
      <g transform={`translate(${CX}, ${saturnY})`}>
        <ellipse cx={0} cy={0} rx={saturnR * 2} ry={saturnR * 0.35} fill="none" stroke={`${c}80`} strokeWidth={4} />
        <circle r={saturnR} fill={`${c}aa`} />
      </g>

      {/* Density label — big and prominent */}
      <text x={CX} y={saturnY - saturnR - 25} textAnchor="middle" fill={c} fontSize={28} fontWeight={700} fontFamily={FF} opacity={m > 0.5 ? 1 : 0} filter="url(#glow)">
        687 kg/m³
      </text>
      <text x={CX} y={380} textAnchor="middle" fill="white" fontSize={20} fontWeight={600} fontFamily={FF} opacity={m > 0.6 ? 1 : 0}>
        It would float!
      </text>
      {/* Ripples when saturn reaches water */}
      {m > 0.45 && (
        <g opacity={Math.min(1, (m - 0.45) * 5) * 0.3}>
          <ellipse cx={CX} cy={waterY} rx={80 + (m - 0.45) * 100} ry={4} fill="none" stroke="rgba(60,120,220,0.4)" strokeWidth={1} />
        </g>
      )}
    </g>
  );
}

/** Diamond rain */
function saturnDiamond(p: number, c: string) {
  const m = mp(p);
  const diamonds = useMemo(() => {
    const rng = srand(555);
    return Array.from({ length: 18 }, () => ({
      x: 120 + rng() * 500,
      speed: 0.5 + rng() * 0.6,
      delay: rng() * 0.4,
      size: 5 + rng() * 8,
      sparklePhase: rng() * Math.PI * 2,
    }));
  }, []);
  return (
    <g opacity={vis(p)}>
      {/* Atmospheric layers */}
      <rect x={100} y={40} width={540} height={80} rx={6} fill="rgba(200,160,80,0.15)" />
      <rect x={100} y={120} width={540} height={90} rx={0} fill="rgba(180,140,60,0.12)" />
      <rect x={100} y={210} width={540} height={90} rx={0} fill="rgba(140,100,40,0.1)" />
      <rect x={100} y={300} width={540} height={60} rx={6} fill="rgba(100,70,30,0.08)" />
      <text x={90} y={85} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={11} fontFamily={FF}>H₂</text>
      <text x={90} y={170} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={11} fontFamily={FF}>CH₄</text>
      <text x={90} y={260} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={11} fontFamily={FF}>Deep</text>

      {/* Falling diamonds */}
      {diamonds.map((d, i) => {
        const t = Math.max(0, (m - d.delay) * d.speed);
        const y = 30 + (t % 1) * 340;
        const sparkle = 0.4 + 0.6 * Math.abs(Math.sin(t * 15 + d.sparklePhase));
        return (
          <g key={i} transform={`translate(${d.x}, ${y}) rotate(45)`} opacity={m > d.delay ? sparkle * 0.85 : 0}>
            <rect x={-d.size / 2} y={-d.size / 2} width={d.size} height={d.size} fill="rgba(180,220,255,0.8)" stroke="rgba(220,240,255,0.95)" strokeWidth={0.8} filter="url(#glow)" />
            {/* Trailing glow */}
            <rect x={-d.size / 2} y={-d.size * 1.5} width={d.size} height={d.size * 2} fill="rgba(180,220,255,0.1)" rx={d.size / 4} />
          </g>
        );
      })}
      {/* Label */}
      <text x={CX} y={385} textAnchor="middle" fill="rgba(180,220,255,0.7)" fontSize={15} fontFamily={FF} opacity={m > 0.3 ? 0.8 : 0}>
        Carbon compressed into diamonds as it falls
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   URANUS
   ══════════════════════════════════════════════════════════════════ */

/** Tilt comparison: Earth vs Uranus */
function uranusTilt(p: number, c: string) {
  const m = mp(p);
  const spin = m * 600;
  const R = 65;
  const axisLen = R * 1.6;
  return (
    <g opacity={vis(p)}>
      {/* Earth (left) */}
      <g transform={`translate(210, ${CY})`}>
        <circle r={R} fill="#1a4488" stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} opacity={m} />
        {/* Axis at 23.4° */}
        <g transform="rotate(23.4)">
          <line x1={0} y1={-axisLen} x2={0} y2={axisLen} stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} strokeDasharray="4,3" />
          <circle cx={0} cy={-axisLen} r={3} fill="white" opacity={0.5} />
          {/* Spinning surface mark */}
          <circle cx={Math.cos((-spin) * Math.PI / 180) * R * 0.5} cy={Math.sin((-spin) * Math.PI / 180) * R * 0.5} r={5} fill="#55aaee" opacity={0.7} />
        </g>
        <text x={0} y={R + 35} textAnchor="middle" fill="#55aaee" fontSize={16} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>Earth</text>
        <text x={0} y={R + 58} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize={26} fontWeight={700} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}>23.4°</text>
      </g>

      {/* Uranus (right) */}
      <g transform={`translate(530, ${CY})`}>
        {/* Glow behind Uranus */}
        <circle r={R * 1.3} fill={c} opacity={0.08 * m} filter="url(#softBlur)" />
        <circle r={R} fill="#285860" stroke={`${c}60`} strokeWidth={2} opacity={m} />
        {/* Axis at 97.8° — nearly horizontal! PROMINENT */}
        <g transform="rotate(97.8)">
          <line x1={0} y1={-axisLen} x2={0} y2={axisLen} stroke={c} strokeWidth={3.5} filter="url(#glow)" />
          <circle cx={0} cy={-axisLen} r={5} fill={c} filter="url(#glow)" />
          <circle cx={0} cy={axisLen} r={4} fill={c} opacity={0.6} />
          {/* Spinning surface mark */}
          <circle cx={Math.cos((-spin) * Math.PI / 180) * R * 0.5} cy={Math.sin((-spin) * Math.PI / 180) * R * 0.5} r={6} fill={c} opacity={0.9} />
          {/* Motion trail */}
          {[1, 2].map((t) => {
            const a = (-spin + t * 20) * Math.PI / 180;
            return <circle key={t} cx={Math.cos(a) * R * 0.5} cy={Math.sin(a) * R * 0.5} r={6 - t * 2} fill={c} opacity={0.3 - t * 0.1} />;
          })}
        </g>
        <text x={0} y={R + 38} textAnchor="middle" fill={c} fontSize={18} fontWeight={700} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>Uranus</text>
        <text x={0} y={R + 60} textAnchor="middle" fill="white" fontSize={28} fontWeight={800} fontFamily={FF} opacity={m > 0.3 ? 1 : 0} filter="url(#glow)">97.8°</text>
      </g>

      {/* Orbital plane reference lines */}
      <line x1={120} y1={CY + R + 5} x2={300} y2={CY + R + 5} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="6,4" opacity={m > 0.2 ? 1 : 0} />
      <line x1={440} y1={CY + R + 5} x2={620} y2={CY + R + 5} stroke="rgba(255,255,255,0.1)" strokeWidth={1} strokeDasharray="6,4" opacity={m > 0.2 ? 1 : 0} />
      <text x={CX} y={CY + R + 10} textAnchor="middle" fill="rgba(255,255,255,0.2)" fontSize={11} fontFamily={FF} opacity={m > 0.2 ? 1 : 0}>orbital plane</text>
    </g>
  );
}

/** Coldest atmosphere thermometer */
function uranusCold(p: number, c: string) {
  const m = mp(p);
  const barX = CX;
  const barTop = 50;
  const barBot = 340;
  const barH = barBot - barTop;
  // Temperature scale: -250 to +500 °C
  const tMin = -250;
  const tMax = 500;
  const tempToY = (t: number) => barTop + ((tMax - t) / (tMax - tMin)) * barH;
  const fillY = tempToY(-224 * m);
  const planets = [
    { name: "Venus", t: 465, color: "#d4a84b" },
    { name: "Earth", t: 15, color: "#4488cc" },
    { name: "Neptune", t: -214, color: "#3060c0" },
    { name: "Uranus", t: -224, color: c },
  ];
  return (
    <g opacity={vis(p)}>
      {/* Thermometer bar */}
      <rect x={barX - 20} y={barTop} width={40} height={barH} rx={20} fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)" strokeWidth={1} />
      {/* Fill */}
      <clipPath id="thermoClip"><rect x={barX - 18} y={barTop + 2} width={36} height={barH - 4} rx={18} /></clipPath>
      <rect x={barX - 18} y={fillY} width={36} height={barBot - fillY} fill={`${c}80`} clipPath="url(#thermoClip)" />
      {/* Planet markers */}
      {planets.map((pl, i) => {
        const y = tempToY(pl.t);
        const show = m > 0.2 + i * 0.1;
        return (
          <g key={pl.name} opacity={show ? 1 : 0}>
            <line x1={barX + 25} y1={y} x2={barX + 60} y2={y} stroke={pl.color} strokeWidth={1.5} />
            <circle cx={barX + 25} cy={y} r={3} fill={pl.color} />
            <text x={barX + 68} y={y + 4} fill={pl.color} fontSize={14} fontWeight={pl.name === "Uranus" ? 700 : 400} fontFamily={FF}>{pl.name} {pl.t} °C</text>
          </g>
        );
      })}
      {/* Scale labels */}
      <text x={barX - 30} y={barTop + 5} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={11} fontFamily={FF}>+500 °C</text>
      <text x={barX - 30} y={tempToY(0) + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={11} fontFamily={FF}>0 °C</text>
      <text x={barX - 30} y={barBot + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize={11} fontFamily={FF}>−250 °C</text>
      {/* "Coldest" callout */}
      <text x={barX + 68} y={tempToY(-224) + 22} fill={c} fontSize={12} fontWeight={600} fontFamily={FF} opacity={m > 0.7 ? 0.8 : 0}>
        ← Coldest planet
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   NEPTUNE
   ══════════════════════════════════════════════════════════════════ */

/** Wind speed comparison */
function neptuneWind(p: number, c: string) {
  const m = mp(p);
  const maxBarW = 500;
  const soundW = (343 / 580) * maxBarW * m;
  const neptuneW = maxBarW * m;
  return (
    <g opacity={vis(p)}>
      {/* Speed of sound bar */}
      <rect x={160} y={130} width={soundW} height={40} rx={4} fill="rgba(255,255,255,0.15)" />
      <text x={150} y={155} textAnchor="end" fill="rgba(255,255,255,0.5)" fontSize={15} fontFamily={FF} opacity={m > 0.1 ? 1 : 0}>Speed of Sound</text>
      <text x={165 + soundW} y={155} fill="rgba(255,255,255,0.7)" fontSize={18} fontWeight={600} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}>343 m/s</text>

      {/* Neptune winds bar */}
      <rect x={160} y={220} width={neptuneW} height={40} rx={4} fill={`${c}90`} />
      <text x={150} y={245} textAnchor="end" fill={c} fontSize={15} fontWeight={600} fontFamily={FF} opacity={m > 0.1 ? 1 : 0}>Neptune Winds</text>
      <text x={165 + neptuneW} y={245} fill="white" fontSize={18} fontWeight={700} fontFamily={FF} opacity={m > 0.3 ? 1 : 0}>580 m/s</text>

      {/* Wind streaks on Neptune bar */}
      {m > 0.4 && [0, 1, 2].map((i) => {
        const x = 160 + ((m * 300 + i * 150) % neptuneW);
        return (
          <rect key={i} x={x} y={225} width={30} height={2} rx={1} fill="rgba(255,255,255,0.3)" />
        );
      })}

      {/* Comparison label */}
      <text x={CX} y={310} textAnchor="middle" fill="white" fontSize={16} fontFamily={FF} opacity={m > 0.6 ? 0.7 : 0}>
        1.7× the speed of sound
      </text>

      {/* Mach indicator — BIG glowing */}
      <text x={CX} y={80} textAnchor="middle" fill={c} fontSize={40} fontWeight={800} fontFamily={FF} opacity={m > 0.5 ? 1 : 0} filter="url(#glow)">
        Mach 1.7
      </text>
      {/* Shockwave line */}
      {m > 0.6 && (
        <line x1={160 + (343 / 580) * maxBarW * m} y1={120} x2={160 + (343 / 580) * maxBarW * m} y2={275}
          stroke="rgba(255,255,255,0.15)" strokeWidth={1.5} strokeDasharray="6,4" />
      )}
    </g>
  );
}

/** 165-year orbit */
function neptuneOrbit(p: number, c: string) {
  const m = mp(p);
  const sunR = 16;
  const earthOrbitR = 50;
  const neptuneOrbitR = 160;
  const earthAngle = m * 360 * 5; // Earth completes 5 orbits visually
  const neptuneAngle = m * 360 * (5 / 165); // Neptune barely moves
  const earthRad = (earthAngle - 90) * (Math.PI / 180);
  const neptuneRad = (neptuneAngle - 90) * (Math.PI / 180);
  const years = Math.round(m * 165);
  return (
    <g opacity={vis(p)}>
      {/* Sun */}
      <circle cx={CX} cy={CY} r={sunR} fill="#ffcc33" opacity={m > 0.05 ? 0.9 : 0} />
      <circle cx={CX} cy={CY} r={sunR + 8} fill="rgba(255,200,50,0.2)" opacity={m > 0.05 ? 0.5 : 0} />

      {/* Earth orbit */}
      <circle cx={CX} cy={CY} r={earthOrbitR} fill="none" stroke="rgba(100,150,255,0.2)" strokeWidth={1} strokeDasharray="3,4" opacity={m > 0.1 ? 1 : 0} />
      <circle cx={CX + Math.cos(earthRad) * earthOrbitR} cy={CY + Math.sin(earthRad) * earthOrbitR} r={4} fill="#2266bb" opacity={m > 0.1 ? 1 : 0} />

      {/* Neptune orbit */}
      <circle cx={CX} cy={CY} r={neptuneOrbitR} fill="none" stroke={`${c}30`} strokeWidth={1.5} strokeDasharray="5,4" opacity={m > 0.1 ? 1 : 0} />
      <circle cx={CX + Math.cos(neptuneRad) * neptuneOrbitR} cy={CY + Math.sin(neptuneRad) * neptuneOrbitR} r={7} fill={c} opacity={m > 0.1 ? 1 : 0} />

      {/* Labels */}
      <text x={CX + earthOrbitR + 15} y={CY - 15} fill="#55aaee" fontSize={12} fontFamily={FF} opacity={m > 0.2 ? 0.7 : 0}>Earth</text>
      <text x={CX + neptuneOrbitR + 12} y={CY - 25} fill={c} fontSize={12} fontFamily={FF} opacity={m > 0.2 ? 0.7 : 0}>Neptune</text>

      {/* Year counter */}
      <text x={CX} y={40} textAnchor="middle" fill="white" fontSize={14} fontFamily={FF} opacity={m > 0.1 ? 0.6 : 0}>
        Earth Years Elapsed
      </text>
      <text x={CX} y={75} textAnchor="middle" fill="white" fontSize={48} fontWeight={800} fontFamily={FF} opacity={m > 0.1 ? 1 : 0} filter="url(#glow)">
        {years}
      </text>
      {/* Earth trail */}
      {m > 0.1 && [1, 2, 3, 4, 5].map((t) => {
        const trailAngle = (earthAngle - t * 30 - 90) * (Math.PI / 180);
        return <circle key={t} cx={CX + Math.cos(trailAngle) * earthOrbitR} cy={CY + Math.sin(trailAngle) * earthOrbitR} r={4 - t * 0.6} fill="#2266bb" opacity={0.5 - t * 0.08} />;
      })}
      {/* Neptune orbit count */}
      <text x={CX} y={CY + neptuneOrbitR + 35} textAnchor="middle" fill={c} fontSize={14} fontFamily={FF} opacity={m > 0.5 ? 0.7 : 0}>
        Neptune completes {years >= 165 ? "1" : "< 1"} orbit
      </text>
    </g>
  );
}

/* ══════════════════════════════════════════════════════════════════
   DISPATCH
   ══════════════════════════════════════════════════════════════════ */

interface Props {
  planetName: string;
  featureIndex: number;
  /** local frame within this feature's window */
  frame: number;
  /** total frames for this feature */
  duration: number;
  accentColor: string;
}

export const FeatureAnimation: React.FC<Props> = ({
  planetName,
  featureIndex,
  frame: f,
  duration: dur,
  accentColor: c,
}) => {
  const p = Math.max(0, Math.min(1, f / dur));

  const content = (() => {
    switch (planetName) {
      case "Mercury": return featureIndex === 0 ? mercuryTemp(p, c) : mercuryIce(p, c);
      case "Venus": return featureIndex === 0 ? venusRetro(p, c) : venusDayYear(p, c);
      case "Earth": return featureIndex === 0 ? earthMagnetic(p, c) : earthOcean(p, c);
      case "Mars": return featureIndex === 0 ? marsHeight(p, c) : marsSunset(p, c);
      case "Jupiter": return featureIndex === 0 ? jupiterSize(p, c) : jupiterSpot(p, c);
      case "Saturn": return featureIndex === 0 ? saturnFloat(p, c) : saturnDiamond(p, c);
      case "Uranus": return featureIndex === 0 ? uranusTilt(p, c) : uranusCold(p, c);
      case "Neptune": return featureIndex === 0 ? neptuneWind(p, c) : neptuneOrbit(p, c);
      default: return null;
    }
  })();

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="bigGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="12" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      {content}
    </svg>
  );
};
