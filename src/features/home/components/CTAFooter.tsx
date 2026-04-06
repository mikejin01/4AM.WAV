"use client";

import Link from "next/link";

import { useScrollReveal } from "../hooks/useScrollReveal";

export default function CTAFooter() {
  const { ref: ctaRef, visible } = useScrollReveal();

  return (
    <>
      <section
        ref={ctaRef}
        className="relative overflow-hidden px-6 py-32 sm:py-40"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.05] blur-[180px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2
            className="font-heading text-4xl font-bold text-white transition-all duration-700 ease-out sm:text-5xl lg:text-6xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(30px)",
            }}
          >
            Your night
            <br />
            starts here.
          </h2>
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(20px)",
              transitionDelay: "150ms",
            }}
          >
            <p className="mx-auto mt-5 max-w-md text-sm text-white/40 sm:text-base">
              Join thousands of music lovers discovering the best of NYC
              nightlife.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/events"
                className="rounded-full bg-gold px-10 py-3.5 text-sm font-semibold uppercase tracking-widest text-black transition-all duration-300 hover:bg-gold-light hover:shadow-[0_0_40px_rgba(212,168,67,0.25)]"
              >
                Explore Events
              </Link>
              <Link
                href="/signup"
                className="rounded-full border border-white/20 px-10 py-3.5 text-sm font-semibold uppercase tracking-widest text-white/70 transition-all duration-300 hover:border-white/40 hover:text-white"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.06] px-6 py-12 sm:py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div className="text-center sm:text-left">
            <p className="font-mono text-sm tracking-wider text-white/50">
              4AM.WAV
            </p>
            <p className="mt-2 text-xs text-white/25">
              Where the night lives.
            </p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                Platform
              </p>
              <Link
                href="/events"
                className="text-sm text-white/25 transition-colors hover:text-white/50"
              >
                Events
              </Link>
              <Link
                href="/signup"
                className="text-sm text-white/25 transition-colors hover:text-white/50"
              >
                Create Event
              </Link>
              <Link
                href="/signup"
                className="text-sm text-white/25 transition-colors hover:text-white/50"
              >
                Sign Up
              </Link>
            </div>
            <div className="flex flex-col gap-2.5">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/40">
                Connect
              </p>
              <a
                href="#"
                className="text-sm text-white/25 transition-colors hover:text-white/50"
              >
                Instagram
              </a>
              <a
                href="#"
                className="text-sm text-white/25 transition-colors hover:text-white/50"
              >
                Twitter / X
              </a>
              <a
                href="#"
                className="text-sm text-white/25 transition-colors hover:text-white/50"
              >
                Discord
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-white/[0.06] pt-6">
          <p className="text-center text-[11px] text-white/15">
            &copy; 2026 4AM.WAV. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
