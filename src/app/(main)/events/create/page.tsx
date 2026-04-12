import type { Metadata } from "next";

import { verifySession } from "@/features/auth/dal";
import CreateEventForm from "@/features/events/CreateEventForm";

export const metadata: Metadata = {
  title: "Create Event | 4AM.WAV",
};

export default async function CreateEventPage() {
  await verifySession();

  return (
    <main className="min-h-screen px-6 pt-28 pb-20 sm:px-10">
      <div className="mx-auto max-w-xl">
        <p className="mb-3 text-[10px] uppercase tracking-[0.4em] text-gold sm:text-xs">
          New Event
        </p>
        <h1 className="mb-10 font-heading text-3xl font-bold text-white sm:text-4xl">
          Create Event
        </h1>

        <CreateEventForm />
      </div>
    </main>
  );
}
