import { notFound } from "next/navigation";
import { createClient } from "@/lib/integrations/supabase/server";
import Navbar from "@/components/layout/Navbar";
import EventDetail from "@/features/events/EventDetail";
import type { EventDetail as EventDetailType } from "@/features/events/types";

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
    .single<EventDetailType>();

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
