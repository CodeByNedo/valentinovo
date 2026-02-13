"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const MAX_FILL = 90;
const STEP = 10;

const FINAL_MESSAGE_LINE_1 = "❤️ 90%.";
const FINAL_MESSAGE_LINE_2 = "Ostalih 10% ćemo napuniti zajedno kada dodjes 🙄";

type Props = {
  onReady?: () => void;
};

export default function HeartMonitor({ onReady }: Props) {
  const [progress, setProgress] = useState(0);
  const [overClicks, setOverClicks] = useState(0);
  const [messageVisible, setMessageVisible] = useState(false);
  const [showHint, setShowHint] = useState(true);

  const heartRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const msgRef = useRef<HTMLDivElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);

  const idleTlRef = useRef<gsap.core.Tween | null>(null);
  const readyFiredRef = useRef(false);

  // Idle heartbeat
  useEffect(() => {
    if (!heartRef.current) return undefined;

    idleTlRef.current = gsap.to(heartRef.current, {
      scale: 1.05,
      duration: 1.1,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      idleTlRef.current?.kill();
      idleTlRef.current = null;
    };
  }, []);

  // Ensure fill starts at 0%
  useEffect(() => {
    if (!fillRef.current) return undefined;
    gsap.set(fillRef.current, { width: "0%" });
    return undefined;
  }, []);

  // Animate message
  useEffect(() => {
    if (!messageVisible || !msgRef.current) return undefined;

    gsap.fromTo(
      msgRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );

    return undefined;
  }, [messageVisible]);

  // Hint bounce animation
  useEffect(() => {
    const el = hintRef.current;
    if (!el) return undefined;

    const tween = gsap.to(el, {
      y: -4,
      duration: 0.6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
    };
  }, []);

  function animateFill(nextProgress: number) {
    if (!fillRef.current) return;

    gsap.to(fillRef.current, {
      width: `${nextProgress}%`,
      duration: 0.4,
      ease: "power2.out",
    });
  }

  function smallPulse() {
    if (!heartRef.current) return;
    gsap.killTweensOf(heartRef.current);
    gsap.to(heartRef.current, { scale: 1.15, duration: 0.12, ease: "power2.out" });
    gsap.to(heartRef.current, { scale: 1.05, duration: 0.2, delay: 0.12 });
  }

  function shakeHeart() {
    if (!heartRef.current) return;
    gsap.fromTo(heartRef.current, { x: 0 }, { x: 6, duration: 0.05, repeat: 5, yoyo: true });
  }

  function handleClick() {
    if (showHint) setShowHint(false);

    // 1) Punjenje do 90
    if (progress < MAX_FILL) {
      const next = Math.min(progress + STEP, MAX_FILL);

      setProgress(next);
      animateFill(next);
      smallPulse();

      // kad dođe na 90, resetuj overClicks i sakrij poruku,
      // ali NE završava level još
      if (next === MAX_FILL) {
        setOverClicks(0);
        setMessageVisible(false);
      }
      return;
    }

    // 2) Preko 90: treba 2 klika da se pokaže poruka
    const nextOver = overClicks + 1;
    setOverClicks(nextOver);

    shakeHeart();
    smallPulse();

    if (nextOver >= 2) {
      setMessageVisible(true);

      // ✅ tek sad završava level (kad poruka postane vidljiva)
      if (!readyFiredRef.current) {
        readyFiredRef.current = true;
        onReady?.();
      }
    }
  }

  return (
    <div className="p-4 text-center">
      <h2 className="mt-1 text-lg font-medium">Punjenje srca</h2>

      <div className="mt-5 flex flex-col items-center">
        <button onClick={handleClick} className="relative grid place-items-center" type="button">
          <div
            ref={heartRef}
            className="text-6xl select-none drop-shadow-[0_0_20px_rgba(255,105,180,0.6)] cursor-pointer"
          >
            ❤️
          </div>
        </button>

        {showHint && (
          <div ref={hintRef} className="mt-3 text-sm text-pink-200/80 font-medium">
            Klikci da napuniš srce💗
          </div>
        )}

        <div className="mt-4 w-full max-w-xs h-3 rounded-full bg-pink-900/40 overflow-hidden">
          <div
            ref={fillRef}
            className="h-full bg-gradient-to-r from-pink-400 to-rose-400"
            style={{ width: "0%" }}
          />
        </div>

        <p className="mt-2 text-sm text-pink-100/70">{progress}%</p>

        {messageVisible && (
          <div ref={msgRef} className="mt-4">
            <p className="text-pink-200 font-semibold">{FINAL_MESSAGE_LINE_1}</p>
            <p className="text-pink-100/90">{FINAL_MESSAGE_LINE_2}</p>
          </div>
        )}
      </div>
    </div>
  );
}
