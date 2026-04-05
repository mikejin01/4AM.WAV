import { NextResponse } from "next/server";
import { deepgram } from "@/lib/integrations/deepgram/server";

export async function POST() {
  try {
    const response = await deepgram.auth.v1.tokens.grant({
      ttl_seconds: 30,
    });

    if (!response.access_token) {
      console.error("Deepgram token response missing access_token:", response);
      return NextResponse.json(
        { error: "No token returned from Deepgram" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      token: response.access_token,
      expiresIn: response.expires_in,
    });
  } catch (err) {
    console.error("Deepgram token error:", err);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 502 }
    );
  }
}
