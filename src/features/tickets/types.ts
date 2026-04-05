export type OrderItem = {
  id: string;
  quantity: number;
  unit_price_cents: number;
  ticket_tiers: {
    name: string;
  };
};

export type Order = {
  id: string;
  status: string;
  total_cents: number;
  created_at: string;
  events: {
    id: string;
    title: string;
    image_url: string | null;
    venue_name: string;
    starts_at: string;
  };
  order_items: OrderItem[];
};
