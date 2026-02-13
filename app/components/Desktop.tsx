"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import HearthMonitor from "./HearthMonitor";
import SupriseLock from "./SupriseLock";
import WhyMartinaPanel from "./WhyMartinaPanel";
import QuestionsPanel from "./QuestionsPanel";
import LetterPanel from "./LetterPanel";
import TopBar from "./TopBar";
import Footer from "./Footer";

type Props = {
  days: number;
  passcode: string;
};

export default function Desktop({ days, passcode }: Props) {
  const [openWhy, setOpenWhy] = useState(false);

  // ✅ source of truth (NE pamti se; refresh = reset)
  const [whyDone, setWhyDone] = useState(false);
  const [heartDone, setHeartDone] = useState(false);
  const [codeDone, setCodeDone] = useState(false);
  const [questionsDone, setQuestionsDone] = useState(false);

  const level1Complete = useMemo(
    () => whyDone && heartDone && codeDone,
    [whyDone, heartDone, codeDone]
  );

  const level2Unlocked = level1Complete;
  const level3Unlocked = level1Complete && questionsDone;

  const currentLevel = useMemo(() => {
    if (level3Unlocked) return 3;
    if (level2Unlocked) return 2;
    return 1;
  }, [level2Unlocked, level3Unlocked]);

  const progressPercent = useMemo(() => {
    const lvl1DoneCount = [whyDone, heartDone, codeDone].filter(Boolean).length;
    const lvl1Pct = (lvl1DoneCount / 3) * 60; // 0-60
    const lvl2Pct = questionsDone ? 30 : 0; // 60-90
    const lvl3Pct = level3Unlocked ? 10 : 0; // 90-100

    return Math.min(100, lvl1Pct + (level1Complete ? lvl2Pct : 0) + lvl3Pct);
  }, [whyDone, heartDone, codeDone, questionsDone, level1Complete, level3Unlocked]);

  // modal anim refs
  const modalWrapRef = useRef<HTMLDivElement | null>(null);
  const modalWinRef = useRef<HTMLDivElement | null>(null);

  const closeModal = useCallback(() => {
    if (!modalWinRef.current || !modalWrapRef.current) {
      setOpenWhy(false);
      return;
    }

    const tl = gsap.timeline({ onComplete: () => setOpenWhy(false) });
    tl.to(modalWinRef.current, {
      opacity: 0,
      scale: 0.98,
      y: 8,
      duration: 0.18,
      ease: "power2.inOut",
    }).to(modalWrapRef.current, { opacity: 0, duration: 0.15 }, "-=0.08");
  }, []);

  useEffect(() => {
    if (!openWhy) return;

    const tl = gsap.timeline();

    if (modalWrapRef.current) {
      tl.fromTo(modalWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 0.18 });
    }

    if (modalWinRef.current) {
      tl.fromTo(
        modalWinRef.current,
        { opacity: 0, scale: 0.98, y: 8 },
        { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power2.out" },
        "-=0.05"
      );
    }

    return () => {
      tl.kill();
    };
  }, [openWhy]);

  useEffect(() => {
    if (!openWhy) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [openWhy, closeModal]);

  return (
    <>
      {/* ✅ TOP BAR (fixed glass) */}
      <TopBar
        currentLevel={currentLevel as 1 | 2 | 3}
        progressPercent={progressPercent}
        days={days}
      />

      {/* ✅ spacer: gura UI ispod fixed topbara */}
      <div style={{ paddingTop: "var(--topbar-h, 0px)" }}>
        <div className="w-full max-w-4xl relative mx-auto">
          {/* ===== GLAVNI CARD ===== */}
          <div className="rounded-2xl border border-pink-200/15 bg-black/35 backdrop-blur-xl shadow-lg overflow-hidden">
            <div className="p-6">
              {/* ===== LEVEL 1 ===== */}
              <section className="grid gap-4 md:grid-cols-3">
                <button
                  onClick={() => setOpenWhy(true)}
                  className={`rounded-xl border border-pink-200/15 p-4 text-left transition ${
                    whyDone
                      ? "bg-black/35 shadow-[0_0_18px_rgba(236,72,153,0.25)]"
                      : "bg-black/25 hover:bg-black/35"
                  }`}
                  type="button"
                >
                  <h2 className="text-lg font-medium">Zašto Martina?</h2>
                  <p className="text-sm text-pink-50/80 mt-2">Otvori sve razloge 🎁</p>
                  <p
                    className={`mt-3 text-xs font-mono ${
                      whyDone ? "text-pink-200" : "text-pink-100/50"
                    }`}
                  >
                    {whyDone ? "✓ završeno" : "zaključan napredak"}
                  </p>
                </button>

                <div
                  className={`rounded-xl border border-pink-200/15 ${
                    heartDone
                      ? "bg-black/35 shadow-[0_0_18px_rgba(236,72,153,0.25)]"
                      : "bg-black/25"
                  }`}
                >
                  <HearthMonitor onReady={() => setHeartDone(true)} />
                </div>

                <div
                  className={`rounded-xl border border-pink-200/15 ${
                    codeDone
                      ? "bg-black/35 shadow-[0_0_18px_rgba(236,72,153,0.25)]"
                      : "bg-black/25"
                  }`}
                >
                  {/* ✅ build fix: nema onLockStateChange */}
                  <SupriseLock
                    passcode={passcode}
                    onUnlocked={() => setCodeDone(true)}
                  />
                </div>
              </section>

              {/* ===== LEVEL 2 ===== */}
              <div className="mt-6">
                <div
                  className={`rounded-xl border border-pink-200/15 p-4 transition ${
                    level2Unlocked ? "bg-black/25" : "bg-black/15 opacity-50 pointer-events-none"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pitanja (Nivo 2)</h3>
                    <span className="font-mono text-xs text-pink-100/60">
                      {level2Unlocked ? (questionsDone ? "✓ završeno" : "otključano") : "zaključano"}
                    </span>
                  </div>

                  {level2Unlocked ? (
                    <div className="mt-3">
                      <QuestionsPanel onCompleted={() => setQuestionsDone(true)} />
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-pink-50/70">
                      Završi sva 3 zadatka iz Nivoa 1 da otključaš pitanja.
                    </p>
                  )}
                </div>
              </div>

              {/* ===== LEVEL 3 ===== */}
              <div className="mt-6">
                <div
                  className={`rounded-xl border border-pink-200/15 p-4 transition ${
                    level3Unlocked ? "bg-black/25" : "bg-black/15 opacity-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Pismo (Nivo 3)</h3>
                    <span className="font-mono text-xs text-pink-100/60">
                      {level3Unlocked ? "otključano" : "zaključano"}
                    </span>
                  </div>

                  {level3Unlocked ? (
                    <LetterPanel key={`letter-${questionsDone}`} />
                  ) : (
                    <p className="mt-2 text-sm text-pink-50/70">
                      Završi pitanja da otključaš pismo.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ✅ footer izvan carda */}
          <Footer />

          {/* WHY MODAL */}
          {openWhy && (
            <div ref={modalWrapRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <button onClick={closeModal} className="absolute inset-0 bg-black/50" type="button" />
              <div ref={modalWinRef} className="relative w-full max-w-2xl">
                <WhyMartinaPanel
                  onClose={closeModal}
                  onAllOpened={() => setWhyDone(true)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
