"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

type Props = {
  currentLevel: 1 | 2 | 3;
  progressPercent: number;
  days: number;
};

export default function TopBar({ currentLevel, progressPercent, days }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const barRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--topbar-h", `${Math.ceil(h)}px`);
    };

    setVar();

    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);

    window.addEventListener("resize", setVar, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  return (
    <div
      ref={barRef}
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "pt-[env(safe-area-inset-top)]",
        "transition-all duration-300",
        // ✅ uvijek malo glass, a kad skroluješ jače
        scrolled
          ? "bg-black/55 backdrop-blur-md border-b border-pink-200/15 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          : "bg-black/25 backdrop-blur-sm border-b border-pink-200/10",
      ].join(" ")}
    >
      <div className="mx-auto w-full max-w-4xl px-6 py-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <LevelBadge active={currentLevel >= 1}>Level 1</LevelBadge>
          <LevelBadge active={currentLevel >= 2}>Level 2</LevelBadge>
          <LevelBadge active={currentLevel >= 3}>Level 3</LevelBadge>
        </div>

        <div className="mt-3 h-2 rounded-full bg-pink-900/30 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-pink-100/55 font-mono">
          <span>LoveOS</span>
          <span>Online od 21.12.2025 — {days} dana</span>
        </div>
      </div>
    </div>
  );
}

function LevelBadge({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={[
        "px-4 py-1 rounded-full transition-all duration-300",
        active
          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
          : "bg-black/30 text-pink-100/40",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
