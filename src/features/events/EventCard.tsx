import Image from "next/image";
import Link from "next/link";

import type { EventSummary } from "./types";

function formatEventDate(startsAt: string, endsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const day = start.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  const startTime = start
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase()
    .replace(" ", "");

  const endTime = end
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    .toLowerCase()
    .replace(" ", "");

  return `${day} ${startTime}-${endTime}`;
}

function formatPrice(tiers: EventSummary["ticket_tiers"]) {
  if (!tiers.length) return "TBA";

  const lowestPrice = Math.min(...tiers.map((t) => t.price_cents));

  if (lowestPrice === 0) {
    const freeTier = tiers.find((t) => t.price_cents === 0);
    return freeTier?.name === "Free RSVP" ? "Free RSVP" : "Free";
  }

  const formatted = `$${(lowestPrice / 100).toFixed(2)}`;
  return tiers.length > 1 ? `From ${formatted}` : formatted;
}

export default function EventCard({ event }: { event: EventSummary }) {
  return (
    <Link href={`/events/${event.id}`} className="group block">
      <div className="overflow-hidden rounded-lg">
        <div className="relative aspect-square overflow-hidden bg-surface">
          {event.image_url ? (
            <Image
              src={event.image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-surface-light">
              <span className="text-4xl font-bold text-white/10">4AM</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-semibold leading-tight text-white line-clamp-2 group-hover:text-gold transition-colors">
          {event.title}
        </h3>
        <p className="text-sm font-medium text-gold">
          {formatEventDate(event.starts_at, event.ends_at)}
        </p>
        <p className="text-sm text-white/50">{event.venue_name}</p>
        <p className="text-sm text-white/40">
          {formatPrice(event.ticket_tiers)}
        </p>
      </div>
    </Link>
  );
}
