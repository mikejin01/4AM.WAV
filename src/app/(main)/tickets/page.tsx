import { createClient } from "@/lib/supabase/server";
import { verifySession } from "@/features/auth/dal";
import OrderCard from "@/features/tickets/OrderCard";
import type { Order } from "@/features/tickets/types";

export default async function TicketsPage() {
  const user = await verifySession();
  const supabase = await createClient();

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
  );
}
