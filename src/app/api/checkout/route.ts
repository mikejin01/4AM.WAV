import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/server";
import { serverEnv } from "@/lib/env.server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { origin } = new URL(request.url);

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: serverEnv.STRIPE_VIP_PRICE_ID,
        quantity: 1,
      },
    ],
    customer_email: user.email,
    metadata: {
      user_id: user.id,
    },
    success_url: `${origin}/profile?upgraded=true`,
    cancel_url: `${origin}/profile`,
  });

  if (!session.url) {
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }

  return NextResponse.json({ url: session.url });
}
