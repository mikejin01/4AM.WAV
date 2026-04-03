import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="hero-gradient relative flex h-screen w-full flex-col items-center justify-center overflow-hidden">
      {/* Animated ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/5 blur-[128px]" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="max-w-4xl text-5xl font-bold italic uppercase leading-none tracking-tight text-white sm:text-7xl lg:text-8xl">
          Where the
          <br />
          Night Lives
        </h1>

        <Link
          href="#"
          className="mt-4 border border-gold px-8 py-3 text-sm font-medium uppercase tracking-widest text-gold transition-all duration-300 hover:bg-gold hover:text-black"
        >
          See Events
        </Link>
      </div>

      <div className="grain-overlay" />
    </section>
  );
}
