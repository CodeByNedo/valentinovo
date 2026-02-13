"use client";

import { useMemo, useState } from "react";
import BootScreen from "./components/BootScreen";
import Desktop from "./components/Desktop";
import FallingHearts from "./components/FallingHearts";
import { daysBetweenUTC } from "./lib/dates";
import { HER_NAME, PASSCODE, START_DATE_ISO, makeBootLines } from "./lib/content";

type Phase = "start" | "boot" | "desktop";

export default function Home() {
  const days = useMemo(() => daysBetweenUTC(START_DATE_ISO, new Date()), []);
  const bootLines = useMemo(() => makeBootLines(days, HER_NAME), [days]);

  const [phase, setPhase] = useState<Phase>("start");

  return (
    <main className="relative min-h-screen text-neutral-100 flex items-center justify-center p-6 overflow-hidden">
      {/* Pink gradient background */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-pink-950 via-fuchsia-900 to-rose-900" />

      {/* Glow blobs */}
      <div className="absolute -z-10 inset-0">
        <div className="absolute -top-28 -left-28 h-96 w-96 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-rose-500/25 blur-3xl" />
      </div>

      {/* Falling hearts */}
      <FallingHearts count={36} />

      {phase === "start" && (
        <div className="w-full max-w-3xl">
          <div className="rounded-2xl border border-pink-200/15 bg-black/35 backdrop-blur-xl p-10 shadow-2xl text-center">
            <p className="font-mono text-xs text-pink-100/60">
              LoveOS / launcher
            </p>

            <h1 className="mt-4 text-5xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-300 bg-clip-text text-transparent">
              Nedo & Martina
            </h1>

            <p className="mt-6 text-pink-100/80 text-lg">
              Spremna za jedno malo iznenađenje? 🎀            </p>

            <button
              onClick={() => setPhase("boot")}
              className="mt-10 rounded-xl bg-pink-200 px-8 py-4 text-neutral-950 font-semibold text-lg hover:scale-105 transition-transform duration-200 shadow-[0_0_30px_rgba(255,105,180,0.4)]"
              type="button"
            >
              Krenimo
            </button>

            <p className="mt-6 text-xs text-pink-100/50 font-mono">
              Martina, ovo je za tebe.
            </p>
          </div>
        </div>
      )}

      {phase === "boot" && (
        <BootScreen
          key="boot-sequence"
          days={days}
          onDone={() => setPhase("desktop")}
        />
      )}

      {phase === "desktop" && <Desktop days={days} passcode={PASSCODE} />}
    </main>
  );
}
