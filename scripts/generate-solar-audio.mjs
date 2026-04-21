import { writeFileSync, mkdirSync } from "fs";

const SR = 44100;
const TAU = 2 * Math.PI;

function writeWav(filename, samples) {
  const n = samples.length;
  const dataSize = n * 2;
  const buf = Buffer.alloc(44 + dataSize);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + dataSize, 4);
  buf.write("WAVE", 8);
  buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(dataSize, 40);
  for (let i = 0; i < n; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buf.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }
  writeFileSync(filename, buf);
  console.log(`  ${filename} (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
}

/* ── smoothstep helper ────────────────────────────────────────────── */
const ss = (x) => {
  const c = Math.max(0, Math.min(1, x));
  return c * c * (3 - 2 * c);
};

/* ── deterministic noise ──────────────────────────────────────────── */
function makeNoise() {
  let s = 54321;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return ((s >>> 0) / 0xffffffff) * 2 - 1;
  };
}

/* ══════════════════════════════════════════════════════════════════════
   AMBIENT: evolving pad with per-planet chord changes
   ══════════════════════════════════════════════════════════════════════ */
function generateAmbient(seconds) {
  const n = SR * seconds;
  const out = new Float64Array(n);
  const noise = makeNoise();

  // Per-planet chord voicings (start_sec, frequencies)
  const segs = [
    { t: 0, f: [130.81, 196.0, 261.63] }, // Intro – C maj
    { t: 4, f: [164.81, 246.94, 329.63, 493.88] }, // Mercury – E maj (bright, metallic)
    { t: 17, f: [110.0, 138.59, 164.81, 220.0] }, // Venus – A maj (warm, dense)
    { t: 30, f: [130.81, 164.81, 196.0, 261.63] }, // Earth – C maj add9 (full, rich)
    { t: 43, f: [73.42, 87.31, 110.0, 146.83] }, // Mars – D min (dark, ominous)
    { t: 56, f: [65.41, 98.0, 130.81, 164.81] }, // Jupiter – C (deep, grand)
    { t: 69, f: [185.0, 233.08, 277.18, 370.0] }, // Saturn – F# maj (ethereal)
    { t: 82, f: [116.54, 146.83, 164.81, 233.08] }, // Uranus – Bb (unsettling)
    { t: 95, f: [103.83, 123.47, 155.56, 207.65] }, // Neptune – Ab min (cold, distant)
    { t: 108, f: [130.81, 196.0, 261.63] }, // Outro – C maj
  ];

  const subFreq = 38;

  for (let i = 0; i < n; i++) {
    const t = i / SR;
    let sample = 0;

    // ── sub-bass (always present) ──
    const subLfo = 0.7 + 0.3 * Math.sin(TAU * 0.06 * t);
    sample += 0.07 * subLfo * Math.sin(TAU * subFreq * t);

    // ── find current segment ──
    let si = 0;
    for (let s = segs.length - 1; s >= 0; s--) {
      if (t >= segs[s].t) {
        si = s;
        break;
      }
    }
    const seg = segs[si];
    const nextT = si < segs.length - 1 ? segs[si + 1].t : seconds;
    const dur = nextT - seg.t;
    const prog = (t - seg.t) / dur;

    // segment envelope: smooth fade in/out with sustain
    let env;
    if (prog < 0.1) env = ss(prog / 0.1);
    else if (prog > 0.88) env = ss((1 - prog) / 0.12);
    else env = 1;

    // ── chord voices with detuning, vibrato, tremolo ──
    const freqs = seg.f;
    for (let v = 0; v < freqs.length; v++) {
      const freq = freqs[v];
      const detune = 0.4 * (v - freqs.length / 2); // spread detuning
      const vibRate = 0.08 + v * 0.04;
      const vibDepth = 0.003;
      const vibrato = 1 + vibDepth * Math.sin(TAU * vibRate * t + v * 2.1);
      const tremRate = 0.06 + v * 0.035;
      const trem = 0.65 + 0.35 * Math.sin(TAU * tremRate * t + v * 1.7);
      const amp = 0.055 / (1 + v * 0.25);

      const f = (freq + detune) * vibrato;
      // fundamental
      sample += amp * env * trem * Math.sin(TAU * f * t);
      // octave harmonic (softer)
      sample += amp * 0.35 * env * trem * Math.sin(TAU * f * 2 * t);
      // fifth harmonic (very soft)
      sample += amp * 0.15 * env * Math.sin(TAU * f * 1.5 * t + 0.3);
    }

    // ── noise texture (subtle, evolving) ──
    const noiseAmt = 0.012 * env * (0.5 + 0.5 * Math.sin(TAU * 0.03 * t));
    sample += noiseAmt * noise();

    // ── global fade in/out ──
    let gEnv = 1;
    if (t < 3) gEnv = t / 3;
    if (t > seconds - 3) gEnv = (seconds - t) / 3;

    out[i] = sample * gEnv;
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   WHOOSH: layered transition impact
   ══════════════════════════════════════════════════════════════════════ */
function generateWhoosh(seconds) {
  const n = Math.floor(SR * seconds);
  const out = new Float64Array(n);
  const noise = makeNoise();

  for (let i = 0; i < n; i++) {
    const p = i / n; // 0→1 progress
    const t = i / SR;

    // Layer 1: noise burst
    const nEnv = p < 0.06 ? p / 0.06 : Math.exp(-3.5 * (p - 0.06));
    const nVal = noise();

    // Layer 2: rising tonal sweep
    const swFreq = 120 + 5000 * p * p;
    const swEnv = p < 0.12 ? p / 0.12 : Math.exp(-4 * (p - 0.12));
    const sweep = Math.sin(TAU * swFreq * t);

    // Layer 3: sub-bass thump
    const thEnv = Math.exp(-10 * p);
    const thump = Math.sin(TAU * 45 * t);

    // Layer 4: high shimmer (delayed entry)
    const shP = Math.max(0, p - 0.15);
    const shEnv = shP > 0 ? Math.exp(-5 * shP) : 0;
    const shimmer =
      Math.sin(TAU * 3200 * t) * 0.5 +
      Math.sin(TAU * 4800 * t) * 0.3 +
      Math.sin(TAU * 6400 * t) * 0.2;

    // Layer 5: descending tail
    const tailP = Math.max(0, p - 0.3);
    const tailEnv = tailP > 0 ? Math.exp(-3 * tailP) * 0.5 : 0;
    const tail = Math.sin(TAU * (800 - 600 * tailP) * t);

    out[i] =
      (nVal * nEnv * 0.28 +
        sweep * swEnv * 0.22 +
        thump * thEnv * 0.18 +
        shimmer * shEnv * 0.06 +
        tail * tailEnv * 0.12) *
      0.55;
  }
  return out;
}

/* ══════════════════════════════════════════════════════════════════════
   REVEAL: sparkly chord ping with echo
   ══════════════════════════════════════════════════════════════════════ */
function generateReveal(seconds) {
  const n = Math.floor(SR * seconds);
  const out = new Float64Array(n);

  for (let i = 0; i < n; i++) {
    const t = i / SR;

    // Main chord: root + fifth + octave
    const env = Math.exp(-6 * t);
    const root = 0.4 * Math.sin(TAU * 1100 * t);
    const fifth = 0.25 * Math.sin(TAU * 1650 * t);
    const oct = 0.15 * Math.sin(TAU * 2200 * t);

    // Sparkle: fast-decaying high harmonics
    const spEnv = Math.exp(-18 * t);
    const sparkle =
      0.25 * Math.sin(TAU * 4400 * t) +
      0.15 * Math.sin(TAU * 5500 * t) +
      0.1 * Math.sin(TAU * 6600 * t) +
      0.05 * Math.sin(TAU * 8800 * t);

    // Echo at 90 ms
    const echoT = t - 0.09;
    let echo = 0;
    if (echoT > 0) {
      const eEnv = Math.exp(-6 * echoT) * 0.35;
      echo =
        eEnv *
        (0.4 * Math.sin(TAU * 1100 * echoT) +
          0.2 * Math.sin(TAU * 1650 * echoT));
    }

    // Second echo at 170 ms (quieter)
    const echo2T = t - 0.17;
    let echo2 = 0;
    if (echo2T > 0) {
      const e2Env = Math.exp(-6 * echo2T) * 0.15;
      echo2 = e2Env * 0.4 * Math.sin(TAU * 1100 * echo2T);
    }

    out[i] =
      (env * (root + fifth + oct) +
        spEnv * sparkle * 0.12 +
        echo +
        echo2) *
      0.22;
  }
  return out;
}

/* ── generate all audio ───────────────────────────────────────────── */
console.log("Generating solar system audio…");
mkdirSync("public/solar-system", { recursive: true });
writeWav("public/solar-system/ambient.wav", generateAmbient(120));
writeWav("public/solar-system/whoosh.wav", generateWhoosh(1.2));
writeWav("public/solar-system/reveal.wav", generateReveal(0.6));
console.log("Done.");
