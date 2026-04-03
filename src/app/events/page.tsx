import { createClient } from "@/lib/supabase/server";
import EventCard from "@/components/EventCard";
import Navbar from "@/components/Navbar";

type Event = {
  id: string;
  title: string;
  image_url: string | null;
  venue_name: string;
  venue_address: string;
  starts_at: string;
  ends_at: string;
  ticket_tiers: {
    id: string;
    name: string;
    price_cents: number;
  }[];
};

export default async function EventsPage() {
  const supabase = await createClient();

  const { data: events } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      image_url,
      venue_name,
      venue_address,
      starts_at,
      ends_at,
      ticket_tiers ( id, name, price_cents )
    `
    )
    .order("starts_at", { ascending: true })
    .returns<Event[]>();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black px-6 pt-28 pb-16 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-4xl font-bold text-white sm:text-5xl">
            <span className="text-gold">Popular Events</span> in New York
          </h1>

          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <p className="text-white/50">No events yet. Check back soon.</p>
          )}
        </div>
      </main>
    </>
  );
}
