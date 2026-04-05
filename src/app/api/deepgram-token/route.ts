import { NextResponse } from "next/server";
import { serverEnv } from "@/lib/env.server";

export async function POST() {
  return NextResponse.json({ token: serverEnv.DEEPGRAM_API_KEY });
}
