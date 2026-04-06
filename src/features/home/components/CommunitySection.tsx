"use client";

import Image from "next/image";

import { useScrollReveal } from "../hooks/useScrollReveal";

const GALLERY_ITEMS = [
  {
    label: "Brooklyn Mirage / Brooklyn",
    image: "/assets/home/community-1.webp",
  },
  {
    label: "00:00 / Long Island City",
    image: "/assets/home/community-0000-2.jpg",
  },
  {
    label: "Aura57 / Midtown Manhattan",
    image: "/assets/home/community-aura57.jpg",
  },
  {
    label: "VShow / Flushing",
    image: "/assets/home/community-vshow.jpg",
  },
  {
    label: "EVOL / SoHo",
    image: "/assets/home/community-evol-1.webp",
  },
  {
    label: "Public Records / Gowanus",
    image: "/assets/home/community-6.webp",
  },
  {
    label: "Knockdown Center / Queens",
    image: "/assets/home/community-7.webp",
  },
];

function GalleryCard({
  label,
  image,
  className,
  sizes,
  visible,
  delay,
}: {
  label: string;
  image: string;
  className: string;
  sizes: string;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl transition-all duration-700 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      <Image
        src={image}
        alt={label}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
        sizes={sizes}
      />
      {/* Dark overlay gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="relative flex h-full items-end p-4 sm:p-6">
        <p className="text-[10px] font-medium uppercase tracking-widest text-white/50 sm:text-xs">
          {label}
        </p>
      </div>
    </div>
  );
}

export default function CommunitySection() {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section ref={ref} className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          className="mb-12 flex flex-col gap-4 transition-all duration-700 ease-out sm:mb-16 sm:flex-row sm:items-end sm:justify-between"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold sm:text-xs">
              The Scene
            </p>
            <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              Nights worth
              <br />
              remembering.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/35">
            From intimate warehouse sets to massive festival stages — every
            night tells a story.
          </p>
        </div>

        {/* Bento grid — explicit row heights so cards in each row match */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-12 sm:grid-rows-[220px_260px_220px] sm:gap-3">
          {/* Row 1: 7 + 5 */}
          <GalleryCard
            {...GALLERY_ITEMS[0]}
            className="col-span-2 aspect-[16/9] sm:col-span-7 sm:row-start-1 sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 58vw"
            visible={visible}
            delay={0}
          />
          <GalleryCard
            {...GALLERY_ITEMS[1]}
            className="col-span-2 aspect-[16/9] sm:col-span-5 sm:row-start-1 sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 42vw"
            visible={visible}
            delay={80}
          />

          {/* Row 2: 4 + 4 + 4 */}
          <GalleryCard
            {...GALLERY_ITEMS[2]}
            className="col-span-1 aspect-square sm:col-span-4 sm:row-start-2 sm:aspect-auto"
            sizes="(max-width: 640px) 50vw, 33vw"
            visible={visible}
            delay={160}
          />
          <GalleryCard
            {...GALLERY_ITEMS[3]}
            className="col-span-1 aspect-square sm:col-span-4 sm:row-start-2 sm:aspect-auto"
            sizes="(max-width: 640px) 50vw, 33vw"
            visible={visible}
            delay={240}
          />
          <GalleryCard
            {...GALLERY_ITEMS[4]}
            className="col-span-2 aspect-[16/9] sm:col-span-4 sm:row-start-2 sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 33vw"
            visible={visible}
            delay={320}
          />

          {/* Row 3: 5 + 7 */}
          <GalleryCard
            {...GALLERY_ITEMS[5]}
            className="col-span-2 aspect-[16/9] sm:col-span-5 sm:row-start-3 sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 42vw"
            visible={visible}
            delay={400}
          />
          <GalleryCard
            {...GALLERY_ITEMS[6]}
            className="col-span-2 aspect-[16/9] sm:col-span-7 sm:row-start-3 sm:aspect-auto"
            sizes="(max-width: 640px) 100vw, 58vw"
            visible={visible}
            delay={480}
          />
        </div>
      </div>
    </section>
  );
}
