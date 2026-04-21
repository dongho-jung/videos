import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  staticFile,
  interpolate,
  useCurrentFrame,
} from "remotion";
import { PLANETS } from "./data";
import { Stars } from "./Stars";
import { Intro } from "./Intro";
import { PlanetScene } from "./PlanetScene";
import { Outro } from "./Outro";
import { THEME, TIMING } from "./theme";

const { INTRO_FRAMES, PLANET_FRAMES, OUTRO_FRAMES, TOTAL_FRAMES } = TIMING;

export const Main: React.FC = () => {
  const frame = useCurrentFrame();

  /* Global fade-in / fade-out */
  const masterOpacity = interpolate(
    frame,
    [0, 15, TOTAL_FRAMES - 60, TOTAL_FRAMES],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  /* Planet scenes start after intro */
  const planetStart = (i: number) => INTRO_FRAMES + i * PLANET_FRAMES;

  return (
    <AbsoluteFill style={{ backgroundColor: THEME.bg, opacity: masterOpacity }}>
      {/* Star background (always visible) */}
      <Stars />

      {/* ── Background ambient audio ──────────────────────────────── */}
      <Audio src={staticFile("solar-system/ambient.wav")} volume={0.35} />

      {/* ── Intro ─────────────────────────────────────────────────── */}
      <Sequence from={0} durationInFrames={INTRO_FRAMES} layout="none">
        <Intro />
      </Sequence>

      {/* Whoosh for intro exit */}
      <Sequence from={INTRO_FRAMES - 15} durationInFrames={30} layout="none">
        <Audio src={staticFile("solar-system/whoosh.wav")} volume={0.25} />
      </Sequence>

      {/* ── Planet scenes ─────────────────────────────────────────── */}
      {PLANETS.map((planet, i) => {
        const from = planetStart(i);
        return (
          <React.Fragment key={planet.name}>
            <Sequence
              from={from}
              durationInFrames={PLANET_FRAMES}
              layout="none"
            >
              <PlanetScene planet={planet} />
            </Sequence>

            {/* Transition whoosh between planets */}
            {i < PLANETS.length - 1 && (
              <Sequence
                from={from + PLANET_FRAMES - 15}
                durationInFrames={30}
                layout="none"
              >
                <Audio
                  src={staticFile("solar-system/whoosh.wav")}
                  volume={0.2}
                />
              </Sequence>
            )}

            {/* Reveal sounds for each feature entrance */}
            {planet.features.map((_, fi) => (
              <Sequence
                key={fi}
                from={from + (fi === 0 ? 90 : 230)}
                durationInFrames={25}
                layout="none"
              >
                <Audio
                  src={staticFile("solar-system/reveal.wav")}
                  volume={0.15}
                />
              </Sequence>
            ))}
          </React.Fragment>
        );
      })}

      {/* Whoosh for outro entrance */}
      <Sequence
        from={INTRO_FRAMES + PLANETS.length * PLANET_FRAMES - 15}
        durationInFrames={30}
        layout="none"
      >
        <Audio src={staticFile("solar-system/whoosh.wav")} volume={0.25} />
      </Sequence>

      {/* ── Outro ─────────────────────────────────────────────────── */}
      <Sequence
        from={INTRO_FRAMES + PLANETS.length * PLANET_FRAMES}
        durationInFrames={OUTRO_FRAMES}
        layout="none"
      >
        <Outro />
      </Sequence>
    </AbsoluteFill>
  );
};
