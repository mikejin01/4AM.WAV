import { NextResponse } from "next/server";
import { generateTemporaryToken } from "@/lib/integrations/deepgram/server";

export async function POST() {
  try {
    const token = await generateTemporaryToken();
    return NextResponse.json({ token });
  } catch (err) {
    console.error("Deepgram token error:", err);
    const message = err instanceof Error ? err.message : "Failed to generate token";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
