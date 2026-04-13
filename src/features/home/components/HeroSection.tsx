"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const HERO_WORDS = ["WHERE", "THE", "NIGHT", "LIVES."];

export default function HeroSection({ animate }: { animate: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lazy-load GSAP only for scroll parallax
  useEffect(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    let ctx: { revert: () => void } | undefined;
    let raf: number;

    import("gsap").then(({ gsap }) =>
      import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
        gsap.registerPlugin(ScrollTrigger);
        raf = requestAnimationFrame(() => {
          ctx = gsap.context(() => {
            gsap.to(content, {
              y: -80,
              opacity: 0.3,
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }, section);
        });
      }),
    );

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
          src="/assets/home/hero-video.mp4"
          poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'/%3E"
        />
        {/* Overlays for text legibility over video */}
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/40" />
      </div>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.04] blur-[160px]" />
      </div>
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center"
      >
        <h1 className="font-heading font-bold uppercase leading-[0.85] tracking-tight text-white">
          {HERO_WORDS.map((word, i) => (
            <span
              key={word}
              className="inline-block"
              style={{
                fontSize: "clamp(2.5rem, 9vw, 9rem)",
                marginRight: i < HERO_WORDS.length - 1 ? "0.3em" : 0,
                opacity: animate ? 1 : 0,
                transform: animate ? "translateY(0)" : "translateY(50px)",
                transition: "none",
                animation: animate
                  ? `hero-word-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.1}s both`
                  : "none",
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        <div
          className="my-8 h-px w-20 bg-gold"
          style={{
            transform: animate ? "scaleX(1)" : "scaleX(0)",
            animation: animate
              ? "hero-line-in 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both"
              : "none",
          }}
        />

        <p
          className="max-w-lg text-sm leading-relaxed text-white/50 sm:text-base"
          style={{
            opacity: animate ? 1 : 0,
            animation: animate
              ? "hero-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.7s both"
              : "none",
          }}
        >
          NYC&apos;s underground music and nightlife community. Discover curated
          events, connect with the scene, and never miss a night worth
          remembering.
        </p>

        <div
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
          style={{
            opacity: animate ? 1 : 0,
            animation: animate
              ? "hero-fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.85s both"
              : "none",
          }}
        >
          <Link
            href="/events"
            className="rounded-full bg-gold px-8 py-3 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_30px_rgba(212,168,67,0.25)]"
          >
            Explore Events
          </Link>
          <Link
            href="/signup"
            className="rounded-full border border-white/20 px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white"
          >
            Host Your Event
          </Link>
        </div>
      </div>

      <div className="grain-overlay" />
    </section>
  );
}
