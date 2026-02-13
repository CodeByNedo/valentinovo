"use client";

export default function Footer() {
  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-8 pb-12">
      <div className="px-6">
        <div className="mx-auto w-full max-w-4xl">

          {/* suptilni separator */}
          <div className="mb-5 h-px bg-gradient-to-r from-transparent via-pink-300/20 to-transparent" />

          <div className="flex flex-col gap-3 text-center md:flex-row md:items-center md:justify-between md:text-left">

            {/* LEFT */}
            <p className="text-[12px] text-pink-100/40">
              © {new Date().getFullYear()} LoveOS — od Nede za Martinu 💌
            </p>

            {/* CENTER */}
            <p className="text-[12px] text-pink-100/60">
              Napravljeno sa <span className="text-pink-300">❤️</span> za nekog posebnog
            </p>

            {/* RIGHT */}
            <button
              onClick={goTop}
              className="self-center md:self-auto rounded-full border border-pink-200/20 px-4 py-1 text-[11px] text-pink-100/60 hover:text-white hover:border-pink-300/40 transition"
            >
              Na vrh
            </button>

          </div>
        </div>
      </div>
    </footer>
  );
}
