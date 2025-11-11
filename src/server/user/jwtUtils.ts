import { sign, verify } from "jsonwebtoken";
import { serialize } from "cookie";

export const JWT_SECRET = process.env.JWT_SECRET ?? "dev‑change‑me!";
export const JWT_EXPIRES_IN = "2h";

export function createJwt(payload: Record<string, unknown>): string {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyJwt(token: string): Record<string, unknown> {
  return verify(token, JWT_SECRET) as Record<string, unknown>;
}

export function jwtCookieHeader(token: string): string {
  const maxAgeSec = (() => {
    const m = JWT_EXPIRES_IN.match(/^(\d+)([smhd])$/);
    if (!m) return 7200; 
    const [, amount, unit] = m;
    const v = Number(amount);
    switch (unit) {
      case "s": return v;
      case "m": return v * 60;
      case "h": return v * 60 * 60;
      case "d": return v * 60 * 60 * 24;
      default: return v;
    }
  })();

  return serialize("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeSec,
  });
}

export function extractTokenFromCookie(cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

