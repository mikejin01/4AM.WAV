import { NextResponse } from "next/server";

import { serverEnv } from "@/lib/env.server";
import {
  createToken,
  COOKIE_NAME,
  MAX_AGE_SECONDS,
} from "@/features/live-support/token";

const LIVE_SUPPORT_PASSWORD = "888";

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);

  if (
    typeof body !== "object" ||
    body === null ||
    !("password" in body) ||
    typeof (body as Record<string, unknown>).password !== "string"
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { password } = body as { password: string };

  if (password !== LIVE_SUPPORT_PASSWORD) {
    return NextResponse.json(
      { error: "Incorrect password" },
      { status: 401 }
    );
  }

  const token = await createToken(serverEnv.LIVE_SUPPORT_SECRET);

  const response = NextResponse.json({ success: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });

  return response;
}
