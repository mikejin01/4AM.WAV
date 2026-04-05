import "server-only";
import { DeepgramClient } from "@deepgram/sdk";

import { serverEnv } from "@/lib/env.server";

export const deepgram = new DeepgramClient({ apiKey: serverEnv.DEEPGRAM_API_KEY });

export async function generateTemporaryToken(ttlSeconds = 30): Promise<string> {
  const res = await fetch("https://api.deepgram.com/v1/auth/grant", {
    method: "POST",
    headers: {
      Authorization: `Token ${serverEnv.DEEPGRAM_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ttl_seconds: ttlSeconds }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Deepgram ${res.status}: ${text}`);
  }

  const data: { access_token?: string; token?: string } = await res.json();
  const token = data.access_token ?? data.token;
  if (!token) throw new Error("No token in Deepgram response");
  return token;
}
