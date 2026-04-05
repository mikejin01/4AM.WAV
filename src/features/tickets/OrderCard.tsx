import Image from "next/image";
import Link from "next/link";

import type { Order, OrderItem } from "./types";

function formatPrice(cents: number) {
  if (cents === 0) return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
}

function shortOrderId(id: string) {
  return id.slice(0, 8).toUpperCase();
}

function expandItems(orderItems: OrderItem[]) {
  const lines: { name: string; price_cents: number }[] = [];
  for (const item of orderItems) {
    for (let i = 0; i < item.quantity; i++) {
      lines.push({
        name: item.ticket_tiers.name,
        price_cents: item.unit_price_cents,
      });
    }
  }
  return lines;
}

export default function OrderCard({ order }: { order: Order }) {
  const event = order.events;
  const lines = expandItems(order.order_items);

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10">
      {/* Background image with overlay */}
      {event.image_url && (
        <div className="absolute inset-0">
          <Image
            src={event.image_url}
            alt=""
            fill
            className="object-cover blur-sm scale-110"
            sizes="400px"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      )}

      {!event.image_url && (
        <div className="absolute inset-0 bg-surface-light" />
      )}

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 p-5">
        {/* Header */}
        <div className="text-center">
          <h3 className="text-lg font-bold leading-tight text-white">
            {event.title}
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Order #{shortOrderId(order.id)}
          </p>
        </div>

        {/* Ticket lines */}
        <div className="space-y-1.5">
          {lines.map((line, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2 text-white/80">
                <svg
                  className="h-4 w-4 text-white/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                  />
                </svg>
                {line.name}
              </span>
              <span className="text-white/50">
                {formatPrice(line.price_cents)}
              </span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-sm">
          <span className="text-white/50">Total</span>
          <span className="text-lg font-bold text-white">
            {formatPrice(order.total_cents)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link
            href={`/events/${event.id}`}
            className="flex-1 rounded-lg border border-white/15 py-2 text-center text-xs font-medium text-white/70 transition-colors hover:border-white/30 hover:text-white"
          >
            View Event
          </Link>
          <button
            disabled
            className="flex-1 rounded-lg border border-white/15 py-2 text-center text-xs font-medium text-white/30 cursor-not-allowed"
            title="Coming soon"
          >
            QR Code
          </button>
        </div>
      </div>
    </div>
  );
}
