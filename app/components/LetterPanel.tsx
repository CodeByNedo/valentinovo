"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";
import { finalLetter } from "../lib/content";

export default function LetterPanel() {
  const paperRef = useRef<HTMLDivElement | null>(null);
  const foldRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const paper = paperRef.current;
    const fold = foldRef.current;
    const seal = sealRef.current;
    if (!paper || !fold || !seal) return;

    const isTouch =
      typeof window !== "undefined" &&
      (navigator.maxTouchPoints > 0 || "ontouchstart" in window);

    // ===== start state (anti-flash + iOS clip-path) =====
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
      y: -60, // odozgo
    });

    // ===== 1) Paper reveal timeline =====
    const paperTl = gsap.timeline({ paused: true });

    paperTl.to(paper, {
      clipPath: "inset(0 0 0% 0)",
      WebkitClipPath: "inset(0 0 0% 0)",
      duration: isTouch ? 3.8 : 5.6,
      ease: "power1.out",
    });

    paperTl.to(
      fold,
      { opacity: 0, duration: isTouch ? 2.1 : 2.8, ease: "power2.out" },
      "-=2.4"
    );

    // ===== 2) Seal timeline (ONLY at bottom on touch) =====
    const sealTl = gsap.timeline({ paused: true });

    sealTl
      .to(seal, { opacity: 1, duration: 0.12 })
      .to(seal, { y: 0, scale: 1, rotate: -6, duration: 0.38, ease: "power3.in" })
      .to(seal, { scaleX: 0.92, scaleY: 1.08, duration: 0.12, ease: "power2.out" })
      .to(seal, { x: -3, duration: 0.05, repeat: 6, yoyo: true, ease: "power1.inOut" })
      .to(seal, { x: 0, scaleX: 1, scaleY: 1, duration: 0.35, ease: "elastic.out(1, 0.5)" })
      .to(
        seal,
        { filter: "drop-shadow(0 7px 9px rgba(0,0,0,0.22))", duration: 0.25, ease: "power2.out" },
        "-=0.22"
      );

    // Desktop: sve odmah (kao prije)
    if (!isTouch) {
      paperTl.play(0);
      // pečat poslije (da zadrži “lup” nakon otkrivanja)
      gsap.delayedCall(0.9, () => sealTl.play(0));
      return () => {
        paperTl.kill();
        sealTl.kill();
      };
    }

    // ===== TOUCH LOGIC =====
    let paperPlayed = false;
    let sealPlayed = false;

    const playPaperIfInView = () => {
      if (paperPlayed) return;

      const rect = paper.getBoundingClientRect();
      const vh = window.innerHeight;

      // kad je “glavni dio” papira u view -> pusti reveal
      const ok = rect.top < vh * 0.7 && rect.bottom > vh * 0.25;
      if (ok) {
        paperPlayed = true;
        paperTl.play(0);
      }
    };

    const playSealOnlyAtBottom = () => {
      if (sealPlayed) return;

      const rect = paper.getBoundingClientRect();
      const vh = window.innerHeight;

      // ✅ uslov: korisnik je došao skroz do dna pisma:
      // dno papira je u donjem dijelu viewporta (vidljivo)
      const bottomVisible = rect.bottom <= vh * 0.98; // skoro skroz u view
      const notTooEarly = rect.top < vh * 0.4; // da nije “tek ušao”

      if (bottomVisible && notTooEarly) {
        sealPlayed = true;
        sealTl.play(0);
      }
    };

    const onScroll = () => {
      playPaperIfInView();
      playSealOnlyAtBottom();
    };

    // Observer da se paper reveal pusti čim dođe u viewport
    const ioPaper = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e?.isIntersecting) playPaperIfInView();
      },
      { threshold: [0.15, 0.25, 0.35, 0.5], rootMargin: "0px 0px -10% 0px" }
    );
    ioPaper.observe(paper);

    // ✅ Bottom trigger: posebni sentinel na dnu papira
    const sentinel = document.createElement("div");
    sentinel.style.position = "absolute";
    sentinel.style.left = "0";
    sentinel.style.right = "0";
    sentinel.style.bottom = "0";
    sentinel.style.height = "1px";
    sentinel.style.pointerEvents = "none";
    paper.appendChild(sentinel);

    const ioBottom = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (!e) return;

        // Kad sentinel (dno) uđe u viewport -> pokušaj pečat
        if (e.isIntersecting) playSealOnlyAtBottom();
      },
      {
        threshold: [0, 0.1],
        rootMargin: "0px 0px -2% 0px",
      }
    );
    ioBottom.observe(sentinel);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // initial check
    requestAnimationFrame(onScroll);

    return () => {
      ioPaper.disconnect();
      ioBottom.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
      paperTl.kill();
      sealTl.kill();
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

        <div
          ref={sealRef}
          className="absolute bottom-7 right-8 select-none pointer-events-none"
          style={{ opacity: 0 }} // ✅ anti-flash
        >
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
