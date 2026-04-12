export const COOKIE_NAME = "live-support-token";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const MAX_AGE_SECONDS = Math.floor(MAX_AGE_MS / 1000);

async function getKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createToken(secret: string): Promise<string> {
  const timestamp = Date.now().toString();
  const key = await getKey(secret);
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(timestamp)
  );
  return `${timestamp}.${toHex(signature)}`;
}

export async function validateToken(
  token: string,
  secret: string
): Promise<boolean> {
  const dotIndex = token.indexOf(".");
  if (dotIndex === -1) return false;

  const timestamp = token.substring(0, dotIndex);
  const providedSig = token.substring(dotIndex + 1);

  const tokenAge = Date.now() - Number(timestamp);
  if (isNaN(tokenAge) || tokenAge < 0 || tokenAge > MAX_AGE_MS) return false;

  const key = await getKey(secret);
  const expectedSig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(timestamp)
  );

  return toHex(expectedSig) === providedSig;
}
