import { createHash, randomBytes } from "crypto";
import { jwtCookieHeader } from "./jwtUtils";

export function randomString(): string {
  return randomBytes(32).toString("base64url");
}

export function signCookie(value: string, secret: string): string {
  const hmac = createHash("sha256");
  hmac.update(value + secret);
  const sig = hmac.digest("base64url");
  return `${value}.${sig}`;
}

export function verifySignedCookie(signed: string, secret: string): string | null {
  const [value, sig] = signed.split(".");
  if (!value || !sig) return null;
  const expected = createHash("sha256")
    .update(value + secret)
    .digest("base64url");
  return sig === expected ? value : null;
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeCodeForTokens(code: string): Promise<{
  access_token: string;
  id_token: string;
  expires_in: number;
}> {
  const body = new URLSearchParams({
    code,
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    grant_type: "authorization_code",
  });

  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Token exchange failed (${resp.status}): ${err}`);
  }

  return (await resp.json()) as any;
}

export async function verifyGoogleIdToken(idToken: string): Promise<{
  sub: string;          
  email: string;
  email_verified: boolean;
  name?: string;
}> {
  const resp = await fetch(
    `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(
      idToken,
    )}`,
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`ID token validation failed (${resp.status}): ${txt}`);
  }

  const payload = (await resp.json()) as any;
  if (!payload.email || !payload.sub) {
    throw new Error("Invalid ID token payload");
  }
  return payload;
}

export function setJwtCookie(token: string): string {
  return jwtCookieHeader(token);
}