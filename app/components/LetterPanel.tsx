"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { finalLetter } from "../lib/content";

export default function LetterPanel() {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const foldRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const paper = paperRef.current;
    const fold = foldRef.current;
    const seal = sealRef.current;
    if (!paper || !fold || !seal) return;

    const isTouch =
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    const tl = gsap.timeline({ paused: isTouch });

    // start state (dodaj WebkitClipPath zbog iOS-a)
    gsap.set(paper, {
      clipPath: "inset(0 0 100% 0)",
      WebkitClipPath: "inset(0 0 100% 0)",
      opacity: 1,
    });
    gsap.set(fold, { opacity: 1 });
    gsap.set(seal, {
      opacity: 0,
      scale: 1.55,
      rotate: -12,
      filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.35))",
      transformOrigin: "50% 55%",
      x: 0,
      y: 0,
    });

    // reveal
    tl.to(paper, {
      clipPath: "inset(0 0 0% 0)",
      WebkitClipPath: "inset(0 0 0% 0)",
      duration: 5.6,
      ease: "power1.out",
    });

    // fold fade
    tl.to(fold, { opacity: 0, duration: 2.8, ease: "power2.out" }, "-=3.2");

    // stamp
    tl.to(seal, { opacity: 1, duration: 0.15 }, "+=0.25")
      .to(seal, { scale: 1, rotate: -6, duration: 0.42, ease: "power3.in" })
      .to(seal, { scaleX: 0.92, scaleY: 1.08, duration: 0.12, ease: "power2.out" })
      .to(seal, { x: -3, duration: 0.05, repeat: 6, yoyo: true, ease: "power1.inOut" })
      .to(seal, { x: 0, scaleX: 1, scaleY: 1, rotate: -6, duration: 0.35, ease: "elastic.out(1, 0.5)" })
      .to(
        seal,
        { filter: "drop-shadow(0 7px 9px rgba(0,0,0,0.22))", duration: 0.25, ease: "power2.out" },
        "-=0.22"
      );

    // ✅ touch: pusti kad je makar 25% vidljivo (mobile-friendly)
    if (isTouch) {
      let played = false;

      const io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (!e) return;

          if (!played && e.isIntersecting && e.intersectionRatio >= 0.25) {
            played = true;
            tl.play(0);
            io.disconnect();
          }
        },
        {
          threshold: [0.15, 0.25, 0.35, 0.5],
          rootMargin: "0px 0px -15% 0px", // krene malo ranije
        }
      );

      io.observe(paper);

      // fallback: "dovoljno vidljivo" (ne mora full u viewport)
      requestAnimationFrame(() => {
        const rect = paper.getBoundingClientRect();
        const vh = window.innerHeight;
        const visibleEnough = rect.top < vh * 0.75 && rect.bottom > vh * 0.25;

        if (!played && visibleEnough) {
          played = true;
          tl.play(0);
          io.disconnect();
        }
      });

      return () => {
        io.disconnect();
        tl.kill();
      };
    }

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="mt-4 flex justify-center">
      <div
        ref={paperRef}
        className="relative w-full max-w-2xl rounded-2xl px-10 py-14 shadow-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,238,245,1) 0%, rgba(255,214,232,1) 100%)",
        }}
      >
        <div
          ref={foldRef}
          className="pointer-events-none absolute top-0 left-0 w-full h-28 bg-gradient-to-b from-white/70 to-transparent"
        />

        <div className="mb-8 text-xs tracking-widest text-pink-400/70 uppercase">
          MARTINA — LOVEOS
        </div>

        <div className="whitespace-pre-line leading-8 text-[17px] text-neutral-800 font-serif">
          {finalLetter}
        </div>

        <div ref={sealRef} className="absolute bottom-7 right-8 select-none pointer-events-none">
          <Image
            src="/pictures/wax.png"
            alt="wax seal"
            width={92}
            height={92}
            className="block"
            priority
          />
        </div>
      </div>
    </div>
  );
}
