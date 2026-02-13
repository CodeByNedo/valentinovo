"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  days: number;
  onDone: () => void;
};

type Line = {
  text: string;
  delayMs?: number;
};

export default function BootScreen({ days, onDone }: Props) {
  const lines = useMemo<Line[]>(
    () => [
      { text: "Hej Martina… jesi li spremna? 👀", delayMs: 500 }, // ✅ ubrzano
      { text: "Budim LoveOS…", delayMs: 900 },
      { text: "Proveravam da li si ti tu… ✅", delayMs: 900 },
      { text: "Učitavam: osmeh", delayMs: 750 },
      { text: "Učitavam: zagrljaj", delayMs: 750 },
      { text: "Učitavam: poljubac (uskoro) 😌", delayMs: 900 },
      { text: "Hemija stabilna. Previsoka zapravo 🔥", delayMs: 1000 },
      { text: "Sve je spremno. Dobro došla, Martina 💗", delayMs: 1100 },
      { text: "Pokrećem nešto posebno za tebe... 🎀", delayMs: 1100 },
    ],
    []
  );

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // ❌ uklonjen početni delay od 700ms (krene odmah)

      for (let i = 0; i < lines.length; i++) {
        if (cancelled) return;

        setIdx(i + 1);

        const delay = lines[i].delayMs ?? 850;
        await new Promise((r) => setTimeout(r, delay));
      }

      await new Promise((r) => setTimeout(r, 2500));

      if (!cancelled) onDone();
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [lines, onDone]);

  return (
    <div className="w-full max-w-3xl">
      <div className="rounded-2xl border border-pink-200/15 bg-black/40 backdrop-blur-xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="font-mono text-sm text-pink-100/60">
            LoveOS / pokretanje sistema
          </p>
          <p className="font-mono text-sm text-pink-100/50">
            uptime: {days} dana
          </p>
        </div>

        <div className="mt-6 font-mono text-sm leading-7">
          {lines.slice(0, idx).map((line, i) => (
            <div key={i} className="text-pink-100/90">
              <span className="text-pink-400">&gt;</span> {line.text}
            </div>
          ))}

          <div className="text-pink-300/70 mt-1">
            <span className="text-pink-400">&gt;</span>{" "}
            <span className="inline-block w-2 animate-pulse">▌</span>
          </div>
        </div>

        <div className="mt-8 text-xs text-pink-100/40 font-mono">
          Pokrećem nešto posebno za tebe…
        </div>
      </div>
    </div>
  );
}
