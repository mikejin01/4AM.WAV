import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { serverEnv } from "@/lib/env.server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      serverEnv.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;

    if (userId) {
      const supabase = await createClient();
      await supabase
        .from("profiles")
        .upsert({
          id: userId,
          membership_tier: "vip",
          updated_at: new Date().toISOString(),
        });
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId = subscription.customer as string;

    // Look up the user by their checkout session metadata
    const sessions = await stripe.checkout.sessions.list({
      customer: customerId,
      limit: 1,
    });

    const userId = sessions.data[0]?.metadata?.user_id;

    if (userId) {
      const supabase = await createClient();
      await supabase
        .from("profiles")
        .update({
          membership_tier: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
