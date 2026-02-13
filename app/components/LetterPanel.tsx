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
    if (!paperRef.current || !foldRef.current || !sealRef.current) return undefined;

    const tl = gsap.timeline();

    // start state: sakrij tekst (bez flash-a)
    gsap.set(paperRef.current, {
      clipPath: "inset(0 0 100% 0)",
      opacity: 1,
    });

    // fold highlight vidljiv na početku
    gsap.set(foldRef.current, { opacity: 1 });

    // ✅ pečat: start "iznad papira" (ka kameri) -> poslije ide ka unutra
    gsap.set(sealRef.current, {
      opacity: 0,
      scale: 1.55, // veći = kao bliže kameri
      rotate: -12,
      filter: "drop-shadow(0 18px 18px rgba(0,0,0,0.35))",
      transformOrigin: "50% 55%",
      x: 0,
      y: 0, // nema pada odozgo
    });

    // 1) SLOW reveal od vrha ka dnu
    tl.to(paperRef.current, {
      clipPath: "inset(0 0 0% 0)",
      duration: 5.6,
      ease: "power1.out",
    });

    // 2) fold highlight neka još malo ostane pa nestane
    tl.to(
      foldRef.current,
      { opacity: 0, duration: 2.8, ease: "power2.out" },
      "-=3.2"
    );

    // 3) ✅ STAMP (ka unutra + shake)
    tl.to(sealRef.current, { opacity: 1, duration: 0.15 }, "+=0.25")

      // "ulazi" u papir (scale ide na 1)
      .to(sealRef.current, {
        scale: 1,
        rotate: -6,
        duration: 0.42,
        ease: "power3.in",
      })

      // udar (squash)
      .to(sealRef.current, {
        scaleX: 0.92,
        scaleY: 1.08,
        duration: 0.12,
        ease: "power2.out",
      })

      // zatrese se kad zapečati
      .to(sealRef.current, {
        x: -3,
        duration: 0.05,
        repeat: 6,
        yoyo: true,
        ease: "power1.inOut",
      })

      // smiri se
      .to(sealRef.current, {
        x: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: -6,
        duration: 0.35,
        ease: "elastic.out(1, 0.5)",
      })

      // shadow manji (kao zalijepljeno)
      .to(
        sealRef.current,
        {
          filter: "drop-shadow(0 7px 9px rgba(0,0,0,0.22))",
          duration: 0.25,
          ease: "power2.out",
        },
        "-=0.22"
      );

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
          // ✅ malo više roza, ali blago (nije napadno)
          background:
            "linear-gradient(135deg, rgba(255,238,245,1) 0%, rgba(255,214,232,1) 100%)",
        }}
      >
        {/* “svjetlo”/fold dok se otkriva */}
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

        {/* WAX SEAL */}
        <div
          ref={sealRef}
          className="absolute bottom-7 right-8 select-none pointer-events-none"
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
