"use client";

export default function Footer() {
  return (
    <footer className="mt-16 pb-10">
      <div className="px-6">
        <div className="mx-auto w-full max-w-4xl text-center">

          {/* suptilni separator */}
          <div className="mb-6 h-px bg-gradient-to-r from-transparent via-pink-300/20 to-transparent" />

          <p className="text-[12px] text-pink-100/45 font-mono tracking-wide">
            © {new Date().getFullYear()} LoveOS — od Nede za Martinu 💌
          </p>

          <p className="mt-3 text-[13px] text-pink-100/55">
            Napravljeno sa <span className="text-pink-300">❤️</span> za nekog posebnog
          </p>

        </div>
      </div>
    </footer>
  );
}
