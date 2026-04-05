import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env.server";

export async function POST() {
  try {
    const res = await fetch("https://api.deepgram.com/v1/auth/token", {
      method: "POST",
      headers: {
        Authorization: `Token ${serverEnv.DEEPGRAM_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttl_in_seconds: 30 }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Deepgram token error:", res.status, text);
      return NextResponse.json(
        { error: "Failed to generate token" },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      token: data.access_token ?? data.token,
    });
  } catch (err) {
    console.error("Deepgram token error:", err);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 502 }
    );
  }
}
