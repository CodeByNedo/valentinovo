"use client";

import { useMemo, useState, useRef } from "react";
import gsap from "gsap";
import Image from "next/image";

type Props = {
  onClose: () => void;
  onAllOpened?: () => void;
};

type Item = {
  id: string;
  title: string;
  body: React.ReactNode;
};

export default function WhyMartinaPanel({ onClose, onAllOpened }: Props) {
  const items = useMemo<Item[]>(
    () => [
      { id: "1", title: "Jedan razlog…", body: <>Jer si luda… ali na najbolji mogući način.</> },
      { id: "2", title: "Još jedan…", body: <>Jer me razumiješ!</> },
      {
        id: "3",
        title: "Ovaj je malo bezobrazan…",
        body: (
          <span className="inline-flex items-center gap-2">
            Jer me ložiš{" "}
            <Image src="/pictures/tongue.png" alt="tongue" width={22} height={22} />
          </span>
        ),
      },
      { id: "4", title: "Ovo volim kod tebe…", body: <>Jer si avanturista i jedva cekam da obidjemo svijet zajedno.</> },
      { id: "5", title: "Najozbiljniji razlog…", body: <>Jer ćeš jednog dana biti najbolja majka moje djece.</> },
    ],
    []
  );

  const [opened, setOpened] = useState<Record<string, boolean>>({});

  // prati šta je ikad otvoreno + da li je callback već pozvan
  const openedEverRef = useRef<Record<string, boolean>>({});
  const allOpenedCalledRef = useRef(false);

  function toggle(id: string) {
    const willOpen = !opened[id];

    // update UI state (bez side-effecta)
    setOpened((prev) => ({ ...prev, [id]: !prev[id] }));

    // logika "opened ever" + unlock (van setState updaters)
    if (willOpen) {
      openedEverRef.current[id] = true;

      if (!allOpenedCalledRef.current) {
        const all = items.every((it) => openedEverRef.current[it.id] === true);
        if (all) {
          allOpenedCalledRef.current = true;
          onAllOpened?.();
        }
      }
    }

    const card = document.querySelector(`[data-gift-id="${id}"]`);
    if (!card) return;

    if (willOpen) {
      gsap.fromTo(card, { scale: 0.99 }, { scale: 1, duration: 0.2, ease: "power2.out" });
      const body = card.querySelector(".gift-body");
      if (body) {
        gsap.fromTo(body, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
      }
    }
  }

  return (
    <div className="rounded-2xl border border-pink-200/20 bg-gradient-to-br from-pink-900/50 via-rose-900/40 to-fuchsia-900/50 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-pink-200/15 bg-black/20">
        <p className="font-mono text-xs text-pink-100/70">zašto_martina.exe</p>
        <button
          onClick={onClose}
          className="rounded-lg border border-pink-200/20 px-3 py-1 text-xs text-pink-50/90 hover:bg-black/30"
          type="button"
        >
          close
        </button>
      </div>

      <div className="p-5">
        <p className="text-pink-50/85 text-sm">Otvori polje po polje 🎁</p>

        <div className="mt-4 grid gap-3 max-h-[60vh] overflow-y-auto no-scrollbar overscroll-contain [scroll-behavior:smooth] [-webkit-overflow-scrolling:touch]">
          {items.map((it, idx) => {
            const isOpen = !!opened[it.id];

            return (
              <button
                key={it.id}
                type="button"
                data-gift-id={it.id}
                onClick={() => toggle(it.id)}
                className="text-left rounded-xl border border-pink-200/20 bg-black/25 hover:bg-black/30 transition p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{isOpen ? "💝" : "🎁"}</span>
                    <div>
                      <p className="text-pink-50/95 font-medium">
                        {isOpen ? `Razlog #${idx + 1}` : it.title}
                      </p>
                      <p className="text-xs text-pink-100/60">
                        {isOpen ? "Klikni da zatvoriš" : "Klikni da otvoriš"}
                      </p>
                    </div>
                  </div>

                  <span className="text-pink-100/70">{isOpen ? "▾" : "▸"}</span>
                </div>

                {isOpen && (
                  <div className="gift-body mt-3 rounded-lg border border-pink-200/15 bg-black/25 p-3">
                    <p className="text-pink-50/90 text-sm leading-relaxed">{it.body}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 text-center text-pink-100/80 font-semibold">I tek smo počeli 💗</div>
      </div>
    </div>
  );
}
