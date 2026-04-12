export type TicketTier = {
  id: string;
  name: string;
  price_cents: number;
  quantity: number;
  sold_count: number;
};

export type EventSummary = {
  id: string;
  title: string;
  image_url: string | null;
  venue_name: string;
  venue_address: string;
  starts_at: string;
  ends_at: string;
  ticket_url: string | null;
  ticket_tiers: Pick<TicketTier, "id" | "name" | "price_cents">[];
};

export type EventDetail = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  venue_name: string;
  venue_address: string;
  starts_at: string;
  ends_at: string;
  ticket_url: string | null;
  ticket_tiers: TicketTier[];
};
