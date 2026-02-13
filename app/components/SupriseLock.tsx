"use client";

import { useState } from "react";
import gsap from "gsap";

type Props = {
  passcode: string;
  onUnlocked?: () => void;
};

function digitsOnly(s: string) {
  return s.replace(/\D/g, "");
}

export default function SupriseLock({ passcode, onUnlocked }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  function submitCode(e: React.FormEvent) {
    e.preventDefault();
    setCodeError("");

    const expected = digitsOnly(passcode.trim());
    const typed = digitsOnly(code.trim());

    const ok = typed.length > 0 && typed === expected;

    if (ok) {
      setUnlocked(true);
      setCode("");
      onUnlocked?.();

      gsap.fromTo(
        ".unlock-card",
        { scale: 0.98, opacity: 0.6 },
        { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }
      );

      return;
    }

    setCodeError("Nope 😄 probaj opet");
    gsap.fromTo(
      ".lock-shake",
      { x: 0 },
      { x: 10, duration: 0.06, repeat: 5, yoyo: true }
    );
  }

  function resetUnlock() {
    setUnlocked(false);
    setCodeError("");
    setCode("");
  }

  return (
    <div className="p-4">
      <h2 className="mt-1 text-lg font-medium">Iznenađenje</h2>

      {!unlocked ? (
        <form onSubmit={submitCode} className="mt-4 space-y-3 lock-shake">
          <p className="text-sm text-pink-50/80">
            Zaključano. Unesi šifru da otključaš poruku.
          </p>

          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="unesi odgovarajuci datum"
            inputMode="text"
            autoComplete="one-time-code"
            enterKeyHint="done"
            className="w-full rounded-lg border border-pink-200/15 bg-black/25 px-3 py-3 font-mono text-base text-pink-50/90 outline-none focus:border-pink-200/35"
            style={{ fontSize: 16 }} // ✅ iOS zoom fix ostaje
          />


          <button
            type="submit"
            className="w-full rounded-lg bg-pink-100 px-4 py-2 text-neutral-950 hover:opacity-90"
          >
            Otključaj
          </button>

          {codeError ? (
            <p className="text-xs text-pink-100/60">{codeError}</p>
          ) : null}

          <p className="font-mono text-xs text-pink-100/50">
            hint: probaj datum😉 dan/mjesec/godina
          </p>
        </form>
      ) : (
        <div className="mt-4 rounded-xl border border-pink-200/20 bg-black/25 p-4 unlock-card">
          <p className="font-mono text-xs text-pink-100/60">
            otključana poruka
          </p>

          <p className="mt-2 text-pink-50/95">
            Nagrada: <b>večera + masaža</b>.
          </p>

          <p className="mt-3 text-sm text-pink-50/80">
            🔓 Otključan je Nivo 2.
          </p>

          <button
            type="button"
            onClick={resetUnlock}
            className="mt-4 text-xs font-mono text-pink-100/50 hover:text-pink-100/80 underline underline-offset-4"
          >
            Resetuj
          </button>
        </div>
      )}
    </div>
  );
}
