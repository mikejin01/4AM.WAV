"use client";

import { useActionState } from "react";

import { createEvent } from "./actions";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/50"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
      />
    </div>
  );
}

export default function CreateEventForm() {
  const [state, formAction, pending] = useActionState(createEvent, {
    error: null,
  });

  return (
    <form action={formAction} className="space-y-6">
      {state.error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <Field
        label="Event Name"
        name="title"
        placeholder="e.g. Summer Solstice @ Brooklyn Mirage"
        required
      />

      <div>
        <label
          htmlFor="description"
          className="mb-1.5 block text-xs font-medium uppercase tracking-widest text-white/50"
        >
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Tell people about the event..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/30"
        />
      </div>

      <Field
        label="Image URL"
        name="image_url"
        type="url"
        placeholder="https://example.com/flyer.jpg"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Venue Name"
          name="venue_name"
          placeholder="e.g. Brooklyn Mirage"
          required
        />
        <Field
          label="Address"
          name="venue_address"
          placeholder="e.g. 140 Stewart Ave, Brooklyn, NY"
          required
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field
          label="Start Date & Time"
          name="starts_at"
          type="datetime-local"
          required
        />
        <Field
          label="End Date & Time"
          name="ends_at"
          type="datetime-local"
          required
        />
      </div>

      <Field
        label="Ticket Link"
        name="ticket_url"
        type="url"
        placeholder="https://ra.co/events/..."
      />

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-gold py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
