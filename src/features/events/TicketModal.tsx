"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/integrations/supabase/client";

import type { EventDetail } from "./types";

type Selection = Record<string, number>;

type Step = "select" | "summary" | "confirmed";

function formatPrice(cents: number) {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(2)}`;
}

function formatShortDate(startsAt: string) {
  const d = new Date(startsAt);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }) + " at " + d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventSidebar({ event }: { event: EventDetail }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <h2 className="text-lg font-bold text-white">{event.title}</h2>
      {event.image_url && (
        <div className="relative aspect-square w-full max-w-[200px] overflow-hidden rounded-lg">
          <Image
            src={event.image_url}
            alt={event.title}
            fill
            className="object-cover"
            sizes="200px"
          />
        </div>
      )}
      <div className="text-sm text-white/50">
        <p>{event.venue_name}</p>
        <p>{formatShortDate(event.starts_at)}</p>
      </div>
    </div>
  );
}

function SelectStep({
  event,
  selection,
  setSelection,
  onNext,
}: {
  event: EventDetail;
  selection: Selection;
  setSelection: (s: Selection) => void;
  onNext: () => void;
}) {
  const hasSelection = Object.values(selection).some((q) => q > 0);
  const isFreeOnly = event.ticket_tiers.every((t) => t.price_cents === 0);

  return (
    <div className="grid min-h-[400px] gap-8 md:grid-cols-[240px_1fr]">
      <div className="hidden md:block">
        <EventSidebar event={event} />
      </div>

      <div className="flex flex-col">
        <div className="flex-1 space-y-3">
          {event.ticket_tiers.map((tier) => {
            const available = tier.quantity - tier.sold_count;
            const qty = selection[tier.id] || 0;
            const soldOut = available <= 0;

            return (
              <div
                key={tier.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{tier.name}</p>
                    <p className="text-sm text-white/50">
                      {formatPrice(tier.price_cents)}
                    </p>
                  </div>

                  {soldOut ? (
                    <span className="text-sm text-white/30">Sold out</span>
                  ) : (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setSelection({
                            ...selection,
                            [tier.id]: Math.max(0, qty - 1),
                          })
                        }
                        disabled={qty === 0}
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 disabled:opacity-30"
                      >
                        &minus;
                      </button>
                      <span className="w-4 text-center text-sm font-medium text-white">
                        {qty}
                      </span>
                      <button
                        onClick={() =>
                          setSelection({
                            ...selection,
                            [tier.id]: Math.min(available, qty + 1, 10),
                          })
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onNext}
          disabled={!hasSelection}
          className="mt-6 w-full rounded-lg bg-gold py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isFreeOnly ? "Continue" : "Checkout"}
        </button>
      </div>
    </div>
  );
}

function SummaryStep({
  event,
  selection,
  onBack,
  onConfirm,
  loading,
}: {
  event: EventDetail;
  selection: Selection;
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  const items = event.ticket_tiers
    .filter((t) => (selection[t.id] || 0) > 0)
    .map((t) => ({ tier: t, qty: selection[t.id] }));

  const totalCents = items.reduce(
    (sum, i) => sum + i.tier.price_cents * i.qty,
    0
  );
  const isFree = totalCents === 0;

  return (
    <div className="grid min-h-[400px] gap-8 md:grid-cols-[240px_1fr]">
      <div className="hidden md:block">
        <EventSidebar event={event} />
      </div>

      <div className="flex flex-col">
        <h3 className="mb-4 text-lg font-bold text-white">Your Order</h3>

        <div className="flex-1 space-y-3">
          {items.map((item) => (
            <div
              key={item.tier.id}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-white">
                {item.qty}x {item.tier.name}
              </span>
              <span className="font-medium text-white">
                {item.tier.price_cents === 0
                  ? "Free"
                  : formatPrice(item.tier.price_cents * item.qty)}
              </span>
            </div>
          ))}

          <div className="border-t border-white/10 pt-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Total Due</span>
              <span className="text-lg font-bold text-white">
                {isFree ? "Free" : formatPrice(totalCents)}
              </span>
            </div>
          </div>
        </div>

        {!isFree && (
          <p className="mt-4 rounded-lg border border-gold/20 bg-gold/5 p-3 text-center text-sm text-gold">
            Stripe payment integration coming soon
          </p>
        )}

        <button
          onClick={onConfirm}
          disabled={loading || (!isFree)}
          className="mt-4 w-full rounded-lg bg-gold py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : isFree ? "RSVP" : "Pay Now"}
        </button>

        <button
          onClick={onBack}
          disabled={loading}
          className="mt-2 w-full py-2 text-center text-sm text-white/50 transition-colors hover:text-white"
        >
          Back
        </button>
      </div>
    </div>
  );
}

function ConfirmedStep({
  event,
  selection,
  onClose,
}: {
  event: EventDetail;
  selection: Selection;
  onClose: () => void;
}) {
  const items = event.ticket_tiers
    .filter((t) => (selection[t.id] || 0) > 0)
    .map((t) => ({ tier: t, qty: selection[t.id] }));

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold/20">
        <svg
          className="h-8 w-8 text-gold"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 12.75l6 6 9-13.5"
          />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white">You&apos;re in!</h3>
        <p className="mt-2 text-white/50">
          Your RSVP for {event.title} is confirmed.
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2 rounded-lg border border-white/10 bg-white/5 p-4 text-sm">
        {items.map((item) => (
          <div key={item.tier.id} className="flex justify-between">
            <span className="text-white/70">
              {item.qty}x {item.tier.name}
            </span>
            <span className="text-white">
              {item.tier.price_cents === 0
                ? "Free"
                : formatPrice(item.tier.price_cents * item.qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="text-sm text-white/40">
        <p>{event.venue_name}</p>
        <p>{formatShortDate(event.starts_at)}</p>
      </div>

      <button
        onClick={onClose}
        className="rounded-lg bg-gold px-8 py-2.5 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light"
      >
        Done
      </button>
    </div>
  );
}

export default function TicketModal({
  event,
  open,
  onClose,
}: {
  event: EventDetail;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("select");
  const [selection, setSelection] = useState<Selection>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setStep("select");
      setSelection({});
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  async function handleConfirm() {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Please log in to continue.");
        setLoading(false);
        return;
      }

      const items = event.ticket_tiers
        .filter((t) => (selection[t.id] || 0) > 0)
        .map((t) => ({ tier_id: t.id, qty: selection[t.id], price_cents: t.price_cents }));

      const totalCents = items.reduce(
        (sum, i) => sum + i.price_cents * i.qty,
        0
      );

      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          event_id: event.id,
          status: "confirmed",
          total_cents: totalCents,
        })
        .select("id")
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map((i) => ({
        order_id: order.id,
        ticket_tier_id: i.tier_id,
        quantity: i.qty,
        unit_price_cents: i.price_cents,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setStep("confirmed");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={step !== "confirmed" ? onClose : undefined}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d12] p-6 shadow-2xl sm:p-8">
        {/* Close button */}
        {step !== "confirmed" && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-white/40 transition-colors hover:text-white"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === "select" && (
          <SelectStep
            event={event}
            selection={selection}
            setSelection={setSelection}
            onNext={() => setStep("summary")}
          />
        )}

        {step === "summary" && (
          <SummaryStep
            event={event}
            selection={selection}
            onBack={() => setStep("select")}
            onConfirm={handleConfirm}
            loading={loading}
          />
        )}

        {step === "confirmed" && (
          <ConfirmedStep
            event={event}
            selection={selection}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
