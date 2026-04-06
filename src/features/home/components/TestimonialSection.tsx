"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const TESTIMONIALS = [
  {
    quote:
      "The best night of my life. 4AM.WAV events hit different \u2014 the curation, the crowd, the energy. Nothing else comes close.",
    name: "Sarah M.",
    role: "Regular Attendee",
  },
  {
    quote:
      "Found my entire friend group through their events. Moved to NYC knowing no one and now I have a whole community.",
    name: "Jordan T.",
    role: "Community Member",
  },
  {
    quote:
      "I\u2019ve thrown events at every major venue in the city. 4AM.WAV\u2019s platform made it effortless \u2014 sold out in 48 hours.",
    name: "Marcus K.",
    role: "Event Organizer",
  },
  {
    quote:
      "Every event is curated to perfection. The music, the venue, the people \u2014 it\u2019s like they read my mind.",
    name: "Priya D.",
    role: "Music Enthusiast",
  },
];

export default function TestimonialSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [next]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const testimonial = TESTIMONIALS[active];

  return (
    <section ref={sectionRef} className="px-6 py-24 sm:py-32">
      <div
        className="mx-auto max-w-3xl text-center transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(30px)",
        }}
      >
        <p className="mb-10 text-[10px] uppercase tracking-[0.4em] text-gold sm:mb-12 sm:text-xs">
          What people are saying
        </p>

        <div className="relative min-h-[160px] sm:min-h-[200px]">
          <blockquote
            key={active}
            className="home-fade-in font-heading text-xl font-medium leading-relaxed text-white/85 sm:text-2xl lg:text-3xl"
          >
            &ldquo;{testimonial.quote}&rdquo;
          </blockquote>
        </div>

        <div key={`author-${active}`} className="home-fade-in mt-8">
          <p className="text-sm font-medium text-white/70">
            {testimonial.name}
          </p>
          <p className="mt-1 text-xs text-white/35">{testimonial.role}</p>
        </div>

        {/* Navigation dots */}
        <div className="mt-10 flex items-center justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Go to testimonial ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-8 bg-gold"
                  : "w-1.5 bg-white/15 hover:bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
