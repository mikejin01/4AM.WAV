import { NextResponse, type NextRequest } from "next/server";

import { updateSession } from "@/lib/supabase/middleware";
import { validateToken, COOKIE_NAME } from "@/features/live-support/token";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/live-support") {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.LIVE_SUPPORT_SECRET;

    if (!token || !secret || !(await validateToken(token, secret))) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
