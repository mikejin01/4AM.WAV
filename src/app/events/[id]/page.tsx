import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import EventDetail from "@/components/EventDetail";

type TicketTier = {
  id: string;
  name: string;
  price_cents: number;
  quantity: number;
  sold_count: number;
};

type Event = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  venue_name: string;
  venue_address: string;
  starts_at: string;
  ends_at: string;
  ticket_tiers: TicketTier[];
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(
      `
      id,
      title,
      description,
      image_url,
      venue_name,
      venue_address,
      starts_at,
      ends_at,
      ticket_tiers ( id, name, price_cents, quantity, sold_count )
    `
    )
    .eq("id", id)
    .single<Event>();

  if (!event) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <EventDetail event={event} />
    </>
  );
}
