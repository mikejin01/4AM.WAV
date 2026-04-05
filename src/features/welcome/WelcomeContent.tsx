"use client";

import Link from "next/link";

const OPTIONS = [
  {
    label: "Find an experience",
    href: "#",
    description: "Browse upcoming events in NYC",
  },
  {
    label: "Organize an event",
    href: "#",
    description: "Create and manage your own event",
  },
  {
    label: "Find my tickets",
    href: "#",
    description: "View your RSVPs and purchases",
  },
];

export default function WelcomeContent({ name }: { name: string }) {
  return (
    <div className="relative flex min-h-screen items-center bg-black px-6 sm:px-10">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left side */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold leading-tight text-white sm:text-6xl">
              Welcome to
              <br />
              <span className="text-gold">4AM.WAV</span>,{" "}
              {name}!
            </h1>
            <p className="text-lg text-white/50">
              Thanks for joining. What can we help you with first?
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {OPTIONS.map((option) => (
              <Link
                key={option.label}
                href={option.href}
                className="group rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition-all hover:border-gold hover:text-gold"
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side -- decorative visual */}
        <div className="relative hidden aspect-square lg:block">
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            {/* Layered gradient background evoking a concert/nightlife scene */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(212,168,67,0.3),transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(100,50,200,0.4),transparent_50%)]" />

            {/* Simulated light beams */}
            <div className="absolute left-1/4 top-0 h-full w-px bg-gradient-to-b from-gold/40 via-gold/10 to-transparent" />
            <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-purple-400/30 via-purple-400/5 to-transparent" />
            <div className="absolute left-3/4 top-0 h-full w-px bg-gradient-to-b from-blue-400/20 via-blue-400/5 to-transparent" />

            {/* Glow dots */}
            <div className="absolute left-[20%] top-[30%] h-2 w-2 rounded-full bg-gold/60 blur-[2px]" />
            <div className="absolute left-[60%] top-[20%] h-1.5 w-1.5 rounded-full bg-purple-400/50 blur-[2px]" />
            <div className="absolute left-[40%] top-[70%] h-2.5 w-2.5 rounded-full bg-blue-400/40 blur-[3px]" />
            <div className="absolute left-[75%] top-[55%] h-2 w-2 rounded-full bg-gold/40 blur-[2px]" />

            {/* Logo watermark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-bold tracking-wider text-white/10">
                4AM
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
