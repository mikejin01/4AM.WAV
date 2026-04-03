import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import OrderCard from "@/components/OrderCard";

type OrderItem = {
  id: string;
  quantity: number;
  unit_price_cents: number;
  ticket_tiers: {
    name: string;
  };
};

type Order = {
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

export default async function TicketsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      `
      id,
      status,
      total_cents,
      created_at,
      events ( id, title, image_url, venue_name, starts_at ),
      order_items ( id, quantity, unit_price_cents, ticket_tiers ( name ) )
    `
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .returns<Order[]>();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black px-6 pt-28 pb-16 sm:px-10">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-10 text-center text-4xl font-bold text-white">
            My Tickets
          </h1>

          {orders && orders.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 pt-20 text-center">
              <p className="text-lg text-white/50">No tickets yet.</p>
              <a
                href="/events"
                className="text-sm text-gold transition-colors hover:text-gold-light"
              >
                Browse events
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
