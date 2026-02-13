"use client";

import { useEffect, useMemo, useState } from "react";

type Heart = {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
  blurPx: number;
  swayDuration: string;
  swayDelay: string;
  glyph: string;
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const HEART_GLYPHS = ["💗", "💖", "💕", "💞", "💓", "💘", "❤️"];

export default function FallingHearts({ count = 32 }: { count?: number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hearts = useMemo<Heart[]>(() => {
    if (!mounted) return [];

    return Array.from({ length: count }).map((_, i) => {
      const glyph = HEART_GLYPHS[Math.floor(rand(0, HEART_GLYPHS.length))];

      return {
        id: i,
        left: `${rand(0, 100).toFixed(2)}%`,
        size: `${rand(12, 30).toFixed(0)}px`,
        duration: `${rand(7, 16).toFixed(2)}s`,
        delay: `${rand(0, 10).toFixed(2)}s`,
        opacity: Number(rand(0.35, 0.95).toFixed(2)),
        blurPx: Number(rand(0, 1.8).toFixed(2)),
        swayDuration: `${rand(2.2, 4.8).toFixed(2)}s`,
        swayDelay: `${rand(0, 2.5).toFixed(2)}s`,
        glyph,
      };
    });
  }, [count, mounted]);

  if (!mounted) return null;

  return (
    // ✅ FIX: fixed overlay -> srca padaju i kad skrolas
    // z-index: iza UI, iznad pozadine
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart"
          style={{
            left: h.left,
            fontSize: h.size,
            animationDuration: h.duration,
            animationDelay: h.delay,
            opacity: h.opacity,
            filter: `drop-shadow(0 0 14px rgba(255,105,180,0.45)) blur(${h.blurPx}px)`,
          }}
        >
          <span
            style={{
              display: "inline-block",
              animationName: "sway",
              animationDuration: h.swayDuration,
              animationDelay: h.swayDelay,
              animationTimingFunction: "ease-in-out",
              animationIterationCount: "infinite",
            }}
          >
            {h.glyph}
          </span>
        </span>
      ))}
    </div>
  );
}
