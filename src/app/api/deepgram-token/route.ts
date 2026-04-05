import { NextResponse } from "next/server";
import { deepgram } from "@/lib/integrations/deepgram/server";

export async function POST() {
  try {
    const response = await deepgram.auth.v1.tokens.grant({
      ttl_seconds: 30,
    });

    return NextResponse.json({
      token: response.access_token,
      expiresIn: response.expires_in,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 502 }
    );
  }
}
