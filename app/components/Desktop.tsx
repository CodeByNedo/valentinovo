"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import HearthMonitor from "./HearthMonitor";
import SupriseLock from "./SupriseLock";
import WhyMartinaPanel from "./WhyMartinaPanel";
import QuestionsPanel from "./QuestionsPanel";
import LetterPanel from "./LetterPanel";

type Props = {
  days: number;
  passcode: string;
};

type ProgressState = {
  whyDone: boolean;
  heartDone: boolean;
  codeDone: boolean;
  questionsDone: boolean;
};

function makeProgressKey(passcode: string) {
  const base = passcode.trim();
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) >>> 0;
  return `loveos_progress_v1_${h}`;
}

export default function Desktop({ days, passcode }: Props) {
  const progressKey = useMemo(() => makeProgressKey(passcode), [passcode]);

  const [openWhy, setOpenWhy] = useState(false);

  // ✅ uslovi (source of truth)
  const [whyDone, setWhyDone] = useState(false);
  const [heartDone, setHeartDone] = useState(false);
  const [codeDone, setCodeDone] = useState(false);
  const [questionsDone, setQuestionsDone] = useState(false);

  // ✅ Level 3 delay start
  const [letterStart, setLetterStart] = useState(false);

  // učitaj iz localStorage na mount (client)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(progressKey);
      if (!raw) return;
      const parsed: Partial<ProgressState> = JSON.parse(raw);

      setWhyDone(!!parsed.whyDone);
      setHeartDone(!!parsed.heartDone);
      setCodeDone(!!parsed.codeDone);
      setQuestionsDone(!!parsed.questionsDone);
    } catch {
      // ignore
    }
  }, [progressKey]);

  // snimi kad god se promijeni
  useEffect(() => {
    const payload: ProgressState = {
      whyDone,
      heartDone,
      codeDone,
      questionsDone,
    };

    try {
      localStorage.setItem(progressKey, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [progressKey, whyDone, heartDone, codeDone, questionsDone]);

  const level1Complete = whyDone && heartDone && codeDone;
  const level2Unlocked = level1Complete;
  const level3Unlocked = level1Complete && questionsDone;

  const currentLevel = useMemo(() => {
    if (level3Unlocked) return 3;
    if (level2Unlocked) return 2;
    return 1;
  }, [level2Unlocked, level3Unlocked]);

  const progressPercent = useMemo(() => {
    // 3 taska = 0..60%, questions = 60..90%, letter = 100%
    const lvl1DoneCount = [whyDone, heartDone, codeDone].filter(Boolean).length;
    const lvl1Pct = (lvl1DoneCount / 3) * 60; // 0-60
    const lvl2Pct = questionsDone ? 30 : 0; // +0 ili +30 => 60-90
    const lvl3Pct = level3Unlocked ? 10 : 0; // +10 => 100

    return Math.min(
      100,
      lvl1Pct + (level1Complete ? lvl2Pct : 0) + (questionsDone ? lvl3Pct : 0)
    );
  }, [whyDone, heartDone, codeDone, questionsDone, level1Complete, level3Unlocked]);

  // ✅ Pauza prije starta Level 3 pisma (da se Level 2 poruka "slegne")
  useEffect(() => {
    if (!level3Unlocked) {
      setLetterStart(false);
      return;
    }

    const t = window.setTimeout(() => {
      setLetterStart(true);
    }, 2500);

    return () => window.clearTimeout(t);
  }, [level3Unlocked]);

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
    if (!openWhy) return undefined;

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
    return () => window.removeEventListener("keydown", onKey);
  }, [openWhy, closeModal]);

  return (
    <div className="w-full max-w-4xl relative">
      <div className="rounded-2xl border border-pink-200/15 bg-black/35 backdrop-blur-xl p-6 shadow-lg">
        {/* ===== TOP BAR: LEVELS + PROGRESS ===== */}
        <div className="mb-6">
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
            <p className={`mt-3 text-xs font-mono ${whyDone ? "text-pink-200" : "text-pink-100/50"}`}>
              {whyDone ? "✓ završeno" : ""}
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
            <SupriseLock passcode={passcode} onUnlocked={() => setCodeDone(true)} />
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
              <h3 className="text-lg font-medium">Pitanja (Level 2)</h3>
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
                Završite sva 3 zadatka iz Level 1 da otključate pitanja.
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
              <h3 className="text-lg font-medium">Pismo (Level 3)</h3>
              <span className="font-mono text-xs text-pink-100/60">
                {level3Unlocked ? "otključano" : "zaključano"}
              </span>
            </div>

            {level3Unlocked ? (
              letterStart ? (
                <LetterPanel key={`letter-${questionsDone}`} />
              ) : (
                <p className="mt-2 text-sm text-pink-50/80 font-mono">Pripremam pismo… 💌</p>
              )
            ) : (
              <p className="mt-2 text-sm text-pink-50/70">Završite pitanja da otključate pismo.</p>
            )}
          </div>
        </div>
      </div>

      {/* WHY MODAL */}
      {openWhy && (
        <div ref={modalWrapRef} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button onClick={closeModal} className="absolute inset-0 bg-black/50" type="button" />
          <div ref={modalWinRef} className="relative w-full max-w-2xl">
            <WhyMartinaPanel onClose={closeModal} onAllOpened={() => setWhyDone(true)} />
          </div>
        </div>
      )}
    </div>
  );
}

function LevelBadge({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`px-4 py-1 rounded-full transition-all duration-300 ${
        active
          ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg"
          : "bg-black/30 text-pink-100/40"
      }`}
    >
      {children}
    </div>
  );
}
