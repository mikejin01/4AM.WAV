"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { EventDetail as EventDetailType } from "./types";

function formatDate(startsAt: string) {
  const start = new Date(startsAt);
  return start.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const fmt = (d: Date) =>
    d
      .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      .toUpperCase();

  return `${fmt(start)} – ${fmt(end)}`;
}

function extractDominantColor(
  imgEl: HTMLImageElement
): [number, number, number] {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [20, 10, 40];

  canvas.width = 32;
  canvas.height = 32;
  ctx.drawImage(imgEl, 0, 0, 32, 32);

  const data = ctx.getImageData(0, 0, 32, 32).data;
  let r = 0,
    g = 0,
    b = 0,
    count = 0;

  for (let i = 0; i < data.length; i += 16) {
    r += data[i];
    g += data[i + 1];
    b += data[i + 2];
    count++;
  }

  r = Math.round(r / count);
  g = Math.round(g / count);
  b = Math.round(b / count);

  const darken = 0.35;
  return [
    Math.round(r * darken),
    Math.round(g * darken),
    Math.round(b * darken),
  ];
}

export default function EventDetail({ event }: { event: EventDetailType }) {
  const [bgColor, setBgColor] = useState("rgb(10, 5, 20)");
  const imgRef = useRef<HTMLImageElement>(null);
  const extractedRef = useRef(false);

  useEffect(() => {
    if (!event.image_url || extractedRef.current) return;

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = event.image_url;
    img.onload = () => {
      const [r, g, b] = extractDominantColor(img);
      setBgColor(`rgb(${r}, ${g}, ${b})`);
      extractedRef.current = true;
    };
  }, [event.image_url]);

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Dynamic background */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ backgroundColor: bgColor }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
      <div
        className="absolute inset-0 opacity-30 blur-[100px]"
        style={{ backgroundColor: bgColor }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-28 pb-20 sm:px-10">
        {/* Back link */}
        <Link
          href="/events"
          className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
          Back to Events
        </Link>

        <div className="grid gap-10 lg:grid-cols-[380px_1fr] lg:gap-16">
          {/* Left: Event image */}
          <div className="relative aspect-square w-full max-w-[380px] overflow-hidden rounded-xl">
            {event.image_url ? (
              <Image
                ref={imgRef}
                src={event.image_url}
                alt={event.title}
                fill
                className="object-cover"
                sizes="380px"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-surface-light">
                <span className="text-5xl font-bold text-white/10">4AM</span>
              </div>
            )}
          </div>

          {/* Right: Event details */}
          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl">
              {event.title}
            </h1>

            {/* Venue & time */}
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z"
                  />
                </svg>
                <div>
                  <p className="font-medium text-white">{event.venue_name}</p>
                  <p className="text-sm text-white/50">{event.venue_address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <svg
                  className="mt-0.5 h-5 w-5 shrink-0 text-gold"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                  />
                </svg>
                <div>
                  <p className="font-medium text-white">
                    {formatDate(event.starts_at)}
                  </p>
                  <p className="text-sm text-white/50">
                    {formatTime(event.starts_at, event.ends_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Ticket link */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-5">
              {event.ticket_url ? (
                <a
                  href={event.ticket_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light"
                >
                  Buy Tickets
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>
              ) : (
                <p className="text-center text-sm text-white/40">
                  Tickets coming soon
                </p>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-white">About</h2>
                <p className="leading-relaxed text-white/60 whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
