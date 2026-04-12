"use client";

import Image from "next/image";

import { useScrollReveal } from "../home/hooks/useScrollReveal";
import type { Artist } from "./types";

const ARTISTS: Artist[] = [
  {
    name: "Cyberpunk",
    genre: "Melodic Bass / Dubstep",
    image: "/assets/artists/artist-cyberpunk-1.jpg",
  },
  {
    name: "Future",
    genre: "Bass House / Dubstep",
    image: "/assets/artists/artist-future-1.jpg",
  },
  {
    name: "Linsu",
    genre: "Hip-Hop",
    image: "/assets/artists/artist-linsu-1.png",
  },
  {
    name: "Ezzek",
    genre: "Tech House / Techno",
    image: "/assets/artists/artist-ezzek-1.jpg",
  },
];

function ArtistCard({
  artist,
  visible,
  delay,
}: {
  artist: Artist;
  visible: boolean;
  delay: number;
}) {
  return (
    <div
      className="group transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {/* Photo container */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-light">
        {artist.image ? (
          <Image
            src={artist.image}
            alt={artist.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-light to-black">
            <span className="font-heading text-6xl font-bold text-white/[0.06] sm:text-7xl lg:text-8xl">
              {artist.name.charAt(0)}
            </span>
          </div>
        )}

        {/* Hover overlay with genre */}
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <p className="p-4 text-[10px] uppercase tracking-[0.3em] text-gold sm:p-5 sm:text-xs">
            {artist.genre}
          </p>
        </div>
      </div>

      {/* Name */}
      <div className="mt-4 sm:mt-5">
        <h3 className="font-heading text-sm font-semibold uppercase tracking-[0.2em] text-white sm:text-base">
          {artist.name}
        </h3>
        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/30 sm:text-xs">
          {artist.genre}
        </p>
      </div>
    </div>
  );
}

export default function ArtistsPage() {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <main className="min-h-screen px-6 pb-24 pt-32 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div
          ref={ref as React.RefObject<HTMLDivElement>}
          className="mb-16 transition-all duration-700 ease-out sm:mb-20"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
          }}
        >
          <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold sm:text-xs">
            The Roster
          </p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Our Artists
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/40 sm:text-base">
            The sounds behind the night. Meet the DJs and producers pushing NYC
            nightlife forward.
          </p>
        </div>

        {/* Artist grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8">
          {ARTISTS.map((artist, i) => (
            <ArtistCard
              key={artist.name}
              artist={artist}
              visible={visible}
              delay={i * 100}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
