"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

type Props = {
  onCompleted?: () => void;
};

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
};

// mali “neutralni” blur placeholder (radi za sve)
const BLUR =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQwIiBoZWlnaHQ9IjI0MCIgZmlsbD0iIzEwMTAxMCIvPjwvc3ZnPg==";

export default function QuestionsPanel({ onCompleted }: Props) {
  const questions = useMemo<Question[]>(
    () => [
      {
        question: "Gdje nam je bio prvi poljubac?",
        options: ["Đulić", "Vicenza", "Banja Vrućica"],
        correctIndex: 2,
      },
      {
        question: "Koji klub tvoj muž voli?",
        options: ["Arsenal", "Chelsea", "Real Madrid"],
        correctIndex: 1,
      },
      {
        question: "Koju palačinku Martina obožava?",
        options: ["Nutella", "Pistaci", "Kinder"],
        correctIndex: 1,
      },
      {
        question: "Šta Martina kaže kad Nedo pošalje bezobrazan reel?",
        options: ["Aloooo", "Nedoooooooo", "Jesi normalan"],
        correctIndex: 1,
      },
      {
        question: "Koje je najbolje prezime u Jezerima?",
        options: ["Kusić", "Panić"],
        correctIndex: 1,
      },
    ],
    []
  );

  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [completed, setCompleted] = useState(false);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const kusicRef = useRef<HTMLButtonElement | null>(null);
  const panicRef = useRef<HTMLButtonElement | null>(null);

  const isFinal = step === questions.length - 1;

  useEffect(() => {
    if (!isFinal) return;
    if (!kusicRef.current) return;
    gsap.set(kusicRef.current, { x: 16, y: 12 });
  }, [isFinal]);

  function next() {
    setFeedback(null);
    setStep((s) => s + 1);
  }

  function handleAnswer(index: number) {
    const current = questions[step];

    if (isFinal && index === 0) {
      moveKusicSafely();
      return;
    }

    if (index === current.correctIndex) {
      setFeedback("correct");

      const delay = isFinal ? 5000 : 1800;

      setTimeout(() => {
        if (isFinal) {
          setCompleted(true);
          onCompleted?.();
        } else {
          next();
        }
      }, delay);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 1800);
    }
  }

  function moveKusicSafely() {
    if (!panelRef.current || !kusicRef.current || !panicRef.current) return;

    const panel = panelRef.current.getBoundingClientRect();
    const kusic = kusicRef.current.getBoundingClientRect();
    const panic = panicRef.current.getBoundingClientRect();

    const padding = 16;
    const arenaWidth = panel.width;
    const arenaHeight = 160;

    const forbiddenBottom = 74;
    const maxX = Math.max(padding, arenaWidth - kusic.width - padding);
    const maxY = Math.max(padding, arenaHeight - forbiddenBottom - kusic.height);

    const panicX = panic.left - panel.left;
    const panicY = panic.top - panel.top;
    const buffer = 22;

    let tries = 0;
    let x = padding;
    let y = padding;

    while (tries < 60) {
      const rx = padding + Math.random() * (maxX - padding);
      const ry = padding + Math.random() * (maxY - padding);

      const overlap =
        rx < panicX + panic.width + buffer &&
        rx + kusic.width + buffer > panicX &&
        ry < panicY + panic.height + buffer &&
        ry + kusic.height + buffer > panicY;

      if (!overlap) {
        x = rx;
        y = ry;
        break;
      }

      tries++;
    }

    gsap.to(kusicRef.current, {
      x,
      y,
      duration: 0.32,
      ease: "power2.out",
    });
  }

  if (completed) {
    return (
      <div className="rounded-2xl border border-pink-200/20 bg-black/35 p-8 text-center">
        <Image
          src="/pictures/mission-complete-spongebob.webp"
          alt="mission complete"
          width={320}
          height={220}
          className="mx-auto rounded-xl"
          priority
          loading="eager"
          placeholder="blur"
          blurDataURL={BLUR}
        />
        <h2 className="mt-6 text-xl font-semibold text-pink-50">
          ✅ Level 2 Completed!
        </h2>
        <p className="mt-2 text-pink-100/80">Otključan je Level 3 💌</p>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="relative rounded-2xl border border-pink-200/20 bg-black/35 p-6 overflow-hidden"
    >
      <div className="mt-3 text-sm text-pink-100/70">
        Pitanje {step + 1} / {questions.length}
      </div>

      <h2 className="mt-4 text-lg font-semibold text-pink-50">
        {questions[step].question}
      </h2>

      {!isFinal ? (
        <div className="mt-4 grid gap-3">
          {questions[step].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              type="button"
              className="rounded-lg border border-pink-200/20 bg-black/25 px-4 py-2 text-left text-pink-50 hover:bg-black/40 transition"
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <div className="relative mt-8 h-40 overflow-hidden">
          <button
            ref={kusicRef}
            onClick={() => handleAnswer(0)}
            type="button"
            className="absolute rounded-lg border border-pink-200/20 bg-black/25 px-6 py-2 text-pink-50"
          >
            Kusić
          </button>

          <button
            ref={panicRef}
            onClick={() => handleAnswer(1)}
            type="button"
            className="absolute right-6 bottom-6 rounded-lg border border-pink-200/20 bg-black/25 px-6 py-2 text-pink-50 hover:bg-black/40"
          >
            Panić
          </button>
        </div>
      )}

      {feedback && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md z-50 p-6 text-center">
          <Image
            src={
              feedback === "correct"
                ? "/pictures/correct.webp"
                : "/pictures/roll-thinking-meme-1.webp"
            }
            alt="meme"
            width={240}
            height={240}
            className="rounded-xl"
            priority
            loading="eager"
            placeholder="blur"
            blurDataURL={BLUR}
          />

          {feedback === "correct" ? (
            <>
              <p className="mt-4 text-pink-200 font-semibold text-lg">
                Good Girl 😌
              </p>
              {isFinal && (
                <p className="mt-2 text-pink-50/90 text-sm">
                  Napokon si prihvatila da je <b>Panić</b> najbolje prezime.
                  <br />
                  Ali opusteno Kusićka, imaces ga i ti jednog dana 😌
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-pink-200 font-semibold text-lg">
              Kusićka, razmisli bolje 😏
            </p>
          )}
        </div>
      )}
    </div>
  );
}
