"use client";

import { useEffect, useState } from "react";

type Props = {
  currentLevel: 1 | 2 | 3;
  progressPercent: number;
  days: number;
};

export default function TopBar({ currentLevel, progressPercent, days }: Props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={[
        "sticky top-0 z-40",
        "transition-all duration-300",
        // safe-area za iPhone notch
        "pt-[env(safe-area-inset-top)]",
        scrolled
          ? "bg-black/35 backdrop-blur-xl border-b border-pink-200/15 shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent",
      ].join(" ")}
    >
      <div className="px-6 py-4">
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
