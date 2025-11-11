import type { User } from '@/menu/Api'
import casandra from 'cassandra-driver'
import bcrypt from 'bcrypt';
import { createJwt, jwtCookieHeader, verifyJwt } from './jwtUtils';
import { buildGoogleAuthUrl, exchangeCodeForTokens, randomString, setJwtCookie, signCookie, verifyGoogleIdToken, verifySignedCookie } from './oauthUtils';

const BCRYPT_COST = 12; 
async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export class UserManager {
  client: casandra.Client

  constructor(client: casandra.Client) {
    this.client = client
  }

  async getUsers(): Promise<User[]> {
    const b = await this.client.execute('SELECT * FROM user')
    return b.rows.map((e) => ({
      user_id: e.user_id,
      name: e.name,
      email: e.email,
      password: e.password,
    }))
  }

 async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const uuid = Bun.randomUUIDv7();
    const hashed = await hashPassword(password);

    await this.client.execute(
      `INSERT INTO user (user_id, name, email, password)
       VALUES (?, ?, ?, ?)`,
      [uuid, name, email, hashed],
    );

    return {
      user_id: uuid,
      name,
      email,
      password: hashed,
    };
  }

  async verifyUser(name: string, password: string): Promise<boolean> {
    const result = await this.client.execute(
      'SELECT password FROM user WHERE name = ? LIMIT 1 ALLOW FILTERING',
      [name],
    );

    if (result.rowLength === 0) {
      return false;
    }

    const storedHash = result.first()?.password as string | undefined;
    if (!storedHash) {
      return false;
    }

    return comparePassword(password, storedHash);
  }

  getRoutes() {
    return {
      '/u/new': async (req: Bun.BunRequest) => {
        try {
          if (req.headers.get('content-type')?.includes('application/json') === false) {
            return new Response(
              JSON.stringify({ error: 'Content-Type must be application/json' }),
              { status: 415, headers: { 'Content-Type': 'application/json' } },
            );
          }

          const { name, email, password } = await req.json();

          if (!name || !email || !password) {
            return new Response(
              JSON.stringify({ error: 'Missing name, email or password' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
          }

          const newUser = await this.createUser(name, email, password);

          const { password: _hashed, ...publicUser } = newUser;

          return new Response(JSON.stringify({ success: true, user: publicUser }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
          });
        } catch (err) {
          console.error('Error in  /u/new error:', err);
          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          );
        }
      },

      '/u/check': async (req: Bun.BunRequest) => {
        try {
          if (req.headers.get('content-type')?.includes('application/json') === false) {
            return new Response(
              JSON.stringify({ error: 'Content-Type must be application/json' }),
              { status: 415, headers: { 'Content-Type': 'application/json' } },
            );
          }

          const { name, password } = await req.json();

          if (!name || !password) {
            return new Response(
              JSON.stringify({ error: 'Missing name or password' }),
              { status: 400, headers: { 'Content-Type': 'application/json' } },
            );
          }

          const valid = await this.verifyUser(name, password);

          if (!valid) {
            return new Response(
              JSON.stringify({ error: "Invalid credentials", valid }),
              { status: 401, headers: { "Content-Type": "application/json" } },
            );
          }

          const payload = {
            sub: name,            
            iat: Math.floor(Date.now() / 1000),
          };
          const token = createJwt(payload);
          const setCookie = jwtCookieHeader(token);

          return new Response(JSON.stringify({ success: true, valid }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Set-Cookie": setCookie,
              "Access-Control-Allow-Credentials": "true",
            },
          });
        } catch (err) {
          console.error('Error in  /u/check error:', err);
          return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } },
          );
        }
      },
      "/auth/verify": 
      async (req: Bun.BunRequest) => {
        const token = req.cookies.get("token")??"";
        console.log(token)
        try {
          const decodedToken = verifyJwt(token??"");
          return new Response(JSON.stringify(decodedToken), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          return new Response(JSON.stringify({ error: "Invalid token" }), {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
      },
      "/auth/oauth2/start": async (req: Bun.BunRequest) => {
          const state = randomString();

          const signed = signCookie(state, process.env.OAUTH_STATE_SECRET!);
          const cookieHeader = `${encodeURIComponent('oauth_state')}=${encodeURIComponent(
            signed,
          )}; HttpOnly; SameSite=Lax; Path=/; Max-Age=300`; // 5 min

          const redirectUrl = buildGoogleAuthUrl(state);

          return new Response(null, {
            status: 302,
            headers: {
              Location: redirectUrl,
              "Set-Cookie": cookieHeader,
            },
          });
        },
        "/auth/oauth2/callback": async (req: Bun.BunRequest) => {
      const url = new URL(req.url);
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");

      if (!code || !returnedState) {
        return new Response(
          JSON.stringify({ error: "Missing code or state" }),
          { status: 400, headers: { "Content-Type": "application/json" } },
        );
      }

      const cookieHeader = req.headers.get("Cookie") ?? "";
      const cookies = Object.fromEntries(
        cookieHeader
          .split(";")
          .map((c) => c.trim().split("="))
          .map(([k, v]) => [decodeURIComponent(k), decodeURIComponent(v)]),
      );

      const signedState = cookies["oauth_state"];
      if (!signedState) {
        return new Response(
          JSON.stringify({ error: "State cookie missing" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      const expectedState = verifySignedCookie(
        signedState,
        process.env.OAUTH_STATE_SECRET!,
      );

      if (!expectedState || expectedState !== returnedState) {
        return new Response(
          JSON.stringify({ error: "Invalid CSRF state" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      let tokenResponse;
      try {
        tokenResponse = await exchangeCodeForTokens(code);
      } catch (e: any) {
        console.error("Token exchange error:", e);
        return new Response(
          JSON.stringify({ error: "Failed to exchange code for tokens" }),
          { status: 502, headers: { "Content-Type": "application/json" } },
        );
      }

      let googleProfile;
      try {
        googleProfile = await verifyGoogleIdToken(tokenResponse.id_token);
      } catch (e: any) {
        console.error("ID token verification error:", e);
        return new Response(
          JSON.stringify({ error: "Invalid ID token" }),
          { status: 401, headers: { "Content-Type": "application/json" } },
        );
      }

      const existing = await this.client.execute(
        "SELECT * FROM user WHERE email = ? LIMIT 1 ALLOW FILTERING",
        [googleProfile.email],
      );

      let userId: string;
      if (existing.rowLength === 0) {
        userId = Bun.randomUUIDv7();
        await this.client.execute(
          "INSERT INTO user (user_id, name, email, password) VALUES (?, ?, ?, ?)",
          [userId, googleProfile.name ?? googleProfile.email, googleProfile.email, ""],
        );
      } else {
        const row = existing.first()!;
        userId = row.user_id as string;
      }

      console.log('AAAAAAAAAA')
      const jwtPayload = {
        sub: userId,               
        email: googleProfile.email,
        name: googleProfile.name ?? "",
        iat: Math.floor(Date.now() / 1000),
      };
      const ourJwt = createJwt(jwtPayload);
      const setCookie = setJwtCookie(ourJwt);
      console.log(setCookie)

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",                  
          "Set-Cookie": setCookie,
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Origin": "http://127.0.0.1",
        },
      });
    }
    };
  }
}
