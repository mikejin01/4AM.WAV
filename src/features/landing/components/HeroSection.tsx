"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface EventFlyer {
  id: number;
  image: string;
  label: string;
  category: string;
  buttonColor: string;
  date: string;
  location: string;
  attendees: number;
}

const EVENT_FLYERS: EventFlyer[] = [
  {
    id: 1,
    image: "/assets/posh/hero/card-1.webp",
    label: "50 Shades of Denim: Live Show | Karaoke | Late Brunch",
    category: "Party.",
    buttonColor: "#a855f7",
    date: "Apr 12",
    location: "Baltimore, MD",
    attendees: 5230,
  },
  {
    id: 2,
    image: "/assets/posh/hero/card-2.webp",
    label: "NCAT Alumni Weekend 2026",
    category: "Festival.",
    buttonColor: "#f97316",
    date: "Apr 17",
    location: "Charlotte, NC",
    attendees: 1716,
  },
  {
    id: 3,
    image: "/assets/posh/hero/card-3.webp",
    label: "Dirty South Rodeo Festival: Atlanta GA",
    category: "Activities.",
    buttonColor: "#facc15",
    date: "May 23",
    location: "Stockbridge, GA",
    attendees: 511,
  },
  {
    id: 4,
    image: "/assets/posh/hero/card-4.webp",
    label: "Indianapolis' First Ever R&B Day Party",
    category: "Food & Drink.",
    buttonColor: "#f43f5e",
    date: "Jun 14",
    location: "Indianapolis, IN",
    attendees: 4912,
  },
  {
    id: 5,
    image: "/assets/posh/hero/card-5.webp",
    label: "THRILLERCON - 2026",
    category: "Art & Fashion.",
    buttonColor: "#10b981",
    date: "Apr 11",
    location: "Houston, TX",
    attendees: 1834,
  },
  {
    id: 6,
    image: "/assets/posh/hero/card-6.webp",
    label: "Sunset & Soul Chicago: Exclusive Sunday Funday Tour",
    category: "Live Performance.",
    buttonColor: "#f59e0b",
    date: "Jun 21",
    location: "Chicago, IL",
    attendees: 580,
  },
  {
    id: 7,
    image: "/assets/posh/hero/card-7.webp",
    label: "Meet Me Upstairs",
    category: "Dating.",
    buttonColor: "#22d3ee",
    date: "Apr 11",
    location: "Houston, TX",
    attendees: 152,
  },
  {
    id: 8,
    image: "/assets/posh/hero/card-8.webp",
    label: "TE TALKS: UNLIMITED LEADS (EP.3)",
    category: "Networking.",
    buttonColor: "#3b82f6",
    date: "Apr 18",
    location: "Tampa, FL",
    attendees: 406,
  },
  {
    id: 9,
    image: "/assets/posh/hero/card-9.webp",
    label: "Decades Sundays To Freetown Day Party",
    category: "Experiences.",
    buttonColor: "#22c55e",
    date: "Apr 26",
    location: "Washington, DC",
    attendees: 47,
  },
];

// Duplicate cards to fill viewport width
function buildCardList(): EventFlyer[] {
  const cards: EventFlyer[] = [];
  let totalCards = 0;
  // Need enough cards so total width > 1.5x viewport (each card is ~8vw + 8px gap)
  const minCards = Math.ceil((1.5 * 100) / 8) + 2; // ~20 cards minimum
  while (totalCards < minCards) {
    for (const flyer of EVENT_FLYERS) {
      cards.push({ ...flyer, id: totalCards + flyer.id });
      totalCards++;
    }
  }
  return cards;
}

const CARDS = buildCardList();

export default function HeroSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const loopRef = useRef<gsap.core.Timeline | null>(null);
  const scrollSpeedRef = useRef(0);
  const targetSpeedRef = useRef(0);
  const tickerRef = useRef<(() => void) | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const activeIndexRef = useRef(-1);
  const cardsRef = useRef<HTMLElement[]>([]);
  const contentsRef = useRef<HTMLElement[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const introCompleteRef = useRef(false);

  const activeFlyer = activeIndex >= 0 ? CARDS[activeIndex] : null;

  const animateCard = useCallback(
    (card: HTMLElement, active: boolean) => {
      gsap.to(card, {
        scale: active ? 1.6 : 1,
        yPercent: active ? 30 : 0,
        zIndex: active ? 100 : 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    },
    [],
  );

  const handleCardEnter = useCallback((index: number) => {
    if (!introCompleteRef.current) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const cards = cardsRef.current;
    const prevIndex = activeIndexRef.current;
    activeIndexRef.current = index;
    setActiveIndex(index);

    if (prevIndex >= 0 && prevIndex !== index && cards[prevIndex]) {
      animateCard(cards[prevIndex], false);
    }
    if (cards[index]) {
      animateCard(cards[index], true);
    }
  }, [animateCard]);

  const resetActiveCard = useCallback(() => {
    const cards = cardsRef.current;
    const prevIndex = activeIndexRef.current;
    activeIndexRef.current = -1;
    setActiveIndex(-1);

    if (prevIndex >= 0 && cards[prevIndex]) {
      animateCard(cards[prevIndex], false);
    }
  }, [animateCard]);

  const handleCarouselLeave = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const leavingIndex = activeIndexRef.current;
    debounceRef.current = setTimeout(() => {
      if (activeIndexRef.current === leavingIndex) resetActiveCard();
    }, 50);
  }, [resetActiveCard]);

  useEffect(() => {
    const section = sectionRef.current;
    const carousel = carouselRef.current;
    if (!section || !carousel) return;

    const cards = Array.from(carousel.querySelectorAll<HTMLElement>(".hero-card"));
    const contents = cards.map((c) => c.querySelector<HTMLElement>(".hero-card-content")!);
    cardsRef.current = cards;
    contentsRef.current = contents;
    const heading = section.querySelector<HTMLElement>(".hero-heading");
    const copy = section.querySelector<HTMLElement>(".hero-copy");

    const ctx = gsap.context(() => {
      // Section starts hidden via CSS opacity: 0, reveal it for GSAP to take over
      gsap.set(section, { opacity: 1 });
      gsap.set(cards, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(heading, { opacity: 0 });
      gsap.set(copy, { opacity: 0 });

      const shuffledCards = gsap.utils.shuffle([...cards]);
      const shuffledContents = shuffledCards.map((c) =>
        c.querySelector<HTMLElement>(".hero-card-content")
      );

      const introTl = gsap.timeline();

      introTl.to(shuffledCards, {
        opacity: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
        stagger: 0.02,
        ease: "power4.out",
      });

      introTl.fromTo(
        shuffledContents,
        { scale: 1.2 },
        { scale: 1, duration: 2, stagger: 0.02, ease: "power4.out" },
        "<"
      );

      introTl.fromTo(
        heading,
        { opacity: 0 },
        { opacity: 0.925, duration: 1, ease: "power2.out" },
        "<1"
      );
      introTl.fromTo(
        copy,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: "power2.out" },
        "<"
      );

      introTl.call(() => { introCompleteRef.current = true; });

      // Pre-compute card positions for the loop to avoid per-frame layout reads
      const cardWidths = cards.map((card) => card.offsetWidth + 8);
      const totalWidth = cardWidths.reduce((sum, w) => sum + w, 0);
      const cardPositions: number[] = [];
      let runningX = 0;
      for (const w of cardWidths) {
        cardPositions.push(runningX);
        runningX += w;
      }

      cards.forEach((card, i) => {
        gsap.set(card, { x: cardPositions[i], position: "absolute", left: 0, top: 0 });
      });

      const loop = gsap.timeline({ repeat: -1, paused: true });
      loop.to(carousel, {
        duration: totalWidth / 50,
        ease: "none",
        onUpdate: () => {
          const offset = loop.progress() * totalWidth;
          cards.forEach((card, i) => {
            const cardW = cardWidths[i];
            let x = cardPositions[i] - offset;
            while (x < -cardW) x += totalWidth;
            while (x > totalWidth - cardW) x -= totalWidth;
            gsap.set(card, { x });
          });
        },
      });

      loopRef.current = loop;

      const handleMouseMove = (e: MouseEvent) => {
        const normX = e.clientX / window.innerWidth;
        if (normX < 0.2) {
          const intensity = Math.pow((0.2 - normX) / 0.2, 3);
          targetSpeedRef.current = -intensity * 3;
        } else if (normX > 0.8) {
          const intensity = Math.pow((normX - 0.8) / 0.2, 3);
          targetSpeedRef.current = intensity * 3;
        } else {
          targetSpeedRef.current = 0;
        }
      };

      const handleMouseLeave = () => {
        targetSpeedRef.current = 0;
      };

      carousel.addEventListener("mousemove", handleMouseMove);
      carousel.addEventListener("mouseleave", handleMouseLeave);

      const ticker = () => {
        scrollSpeedRef.current += (targetSpeedRef.current - scrollSpeedRef.current) * 0.1;
        if (Math.abs(scrollSpeedRef.current) > 0.001 && loopRef.current) {
          const tl = loopRef.current;
          const newTime = tl.totalTime() + scrollSpeedRef.current * 0.05;
          tl.totalTime(newTime);
        }
      };
      gsap.ticker.add(ticker);
      tickerRef.current = ticker;

      const exitTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "2% top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      exitTl.fromTo(heading, { opacity: 0.925 }, { opacity: 0, immediateRender: false, duration: 0.5, ease: "power2.inOut" }, 0);
      exitTl.fromTo(copy, { opacity: 1 }, { opacity: 0, immediateRender: false, duration: 0.5, ease: "power2.inOut" }, 0);
      exitTl.to(cards, {
        clipPath: "inset(0% 0% 100% 0%)",
        immediateRender: false,
        duration: 1,
        stagger: 0.02,
        ease: "power4.out",
      }, 0);

      return () => {
        carousel.removeEventListener("mousemove", handleMouseMove);
        carousel.removeEventListener("mouseleave", handleMouseLeave);
      };
    }, section);

    return () => {
      if (tickerRef.current) gsap.ticker.remove(tickerRef.current);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      cardsRef.current = [];
      contentsRef.current = [];
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-section relative overflow-visible"
      style={{ minHeight: "100svh", opacity: 0 }}
    >
      <h1
        className="hero-heading px-12 pt-[15svh] text-right font-normal tracking-tight text-[#0a0a0a]"
        style={{ fontSize: "clamp(3rem, 9vw, 128px)", lineHeight: 1 }}
      >
        {activeFlyer ? activeFlyer.category : "Find your world."}
      </h1>

      <div
        ref={carouselRef}
        className="hero-carousel-content absolute inset-x-0 top-1/2 z-20 -translate-y-1/2 overflow-visible"
        style={{ height: "calc(8vw * 1.25)" }}
        onMouseLeave={handleCarouselLeave}
      >
        {CARDS.map((flyer, i) => (
          <div
            key={`${flyer.id}-${i}`}
            className="hero-card absolute left-0 top-0 overflow-visible"
            style={{ width: "8vw", maxWidth: 160, aspectRatio: "4/5", transformStyle: "preserve-3d" }}
            onMouseEnter={() => handleCardEnter(i)}
          >
            <div className="hero-card-content relative h-full w-full overflow-hidden">
              <Image
                src={flyer.image}
                alt={flyer.label}
                fill
                className="object-cover"
                sizes="8vw"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="hero-copy absolute bottom-0 left-0 right-0 z-20 px-12 pb-20">
        <div style={{ maxWidth: 440 }}>
          {activeFlyer ? (
            <div className="animate-fade-in">
              <p className="mb-1 text-sm font-normal text-[#0a0a0a]">
                {activeFlyer.label}
              </p>
              <p className="mb-1 text-sm text-[#0a0a0a]/50">
                {activeFlyer.date}, {activeFlyer.location}
              </p>
              <p className="mb-6 text-sm text-[#0a0a0a]/50">
                {activeFlyer.attendees.toLocaleString()} people going
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="rounded-full px-6 py-3 text-sm font-medium text-white transition-colors"
                  style={{ backgroundColor: activeFlyer.buttonColor }}
                >
                  View event
                </a>
                <a
                  href="#"
                  className="rounded-full border border-[#0a0a0a]/20 px-6 py-3 text-sm font-medium text-[#0a0a0a] transition-colors hover:border-[#0a0a0a]/40"
                >
                  View all
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm leading-relaxed text-[#0a0a0a]">
              Posh® is a social platform built for meaningful IRL experiences. From
              club parties to run clubs, fashion shows to music festivals. If
              it&apos;s out there, it&apos;s on Posh®.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
