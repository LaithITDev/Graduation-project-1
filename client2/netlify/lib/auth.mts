import { getConnectionString } from "@netlify/database";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import postgres from "postgres";

type UserRow = {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  password_salt: string;
  disability_type: string;
  created_at: Date;
  updated_at: Date;
};

type PublicUser = Omit<UserRow, "password_hash" | "password_salt">;
type AuthBody = Record<string, unknown>;

class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string
  ) {
    super(message);
  }
}

let database: ReturnType<typeof postgres> | undefined;

function getDatabase(): ReturnType<typeof postgres> {
  if (!process.env.NETLIFY_DB_URL) {
    throw new Error("Netlify Database is not configured");
  }
  if (!database) {
    database = postgres(getConnectionString(), { max: 1, connect_timeout: 5 });
  }
  return database;
}

function jsonResponse(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function methodNotAllowed(allowed: string): Response {
  return new Response(JSON.stringify({ message: "Method not allowed" }), {
    status: 405,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      Allow: allowed,
    },
  });
}

async function readBody(request: Request): Promise<AuthBody> {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    throw new HttpError(415, "Content-Type must be application/json");
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new HttpError(400, "Request body must be valid JSON");
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Request body must be a JSON object");
  }
  return body as AuthBody;
}

async function handleError(error: unknown): Promise<Response> {
  if (error instanceof HttpError) {
    return jsonResponse({ message: error.message }, error.status);
  }
  console.error(
    "Authentication function failed:",
    error instanceof Error ? error.name : "UnknownError"
  );
  return jsonResponse({ message: "Authentication service is unavailable" }, 500);
}

function requireCredentials(body: AuthBody): {
  username: string;
  password: string;
} {
  if (typeof body.username !== "string" || typeof body.password !== "string") {
    throw new HttpError(400, "Username and password are required");
  }
  const username = body.username.trim();
  if (username.length < 3 || username.length > 32) {
    throw new HttpError(400, "Username must be between 3 and 32 characters");
  }
  if (body.password.length < 8 || body.password.length > 128) {
    throw new HttpError(400, "Password must be between 8 and 128 characters");
  }
  return { username, password: body.password };
}

function requireJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error("JWT_SECRET must be configured with at least 32 bytes");
  }
  return secret;
}

function hashPassword(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

function createToken(user: Pick<UserRow, "id" | "username">): string {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url"
  );
  const payload = Buffer.from(
    JSON.stringify({
      id: user.id,
      username: user.username,
      iat: now,
      exp: now + 24 * 60 * 60,
    })
  ).toString("base64url");
  const unsignedToken = `${header}.${payload}`;
  const signature = createHmac("sha256", requireJwtSecret())
    .update(unsignedToken)
    .digest("base64url");
  return `${unsignedToken}.${signature}`;
}

function verifyToken(request: Request): { id: number } {
  const secret = requireJwtSecret();
  const authorization = request.headers.get("authorization") ?? "";
  const match = /^Bearer ([^\s]+)$/i.exec(authorization);
  if (!match) throw new HttpError(401, "Unauthorized");

  const parts = match[1].split(".");
  if (parts.length !== 3) throw new HttpError(401, "Unauthorized");

  try {
    const unsignedToken = `${parts[0]}.${parts[1]}`;
    const header = JSON.parse(
      Buffer.from(parts[0], "base64url").toString("utf8")
    ) as { alg?: unknown; typ?: unknown };
    if (header.alg !== "HS256" || header.typ !== "JWT") {
      throw new HttpError(401, "Unauthorized");
    }
    const expected = createHmac("sha256", secret)
      .update(unsignedToken)
      .digest();
    const received = Buffer.from(parts[2], "base64url");
    if (
      received.length !== expected.length ||
      !timingSafeEqual(Uint8Array.from(received), Uint8Array.from(expected))
    ) {
      throw new HttpError(401, "Unauthorized");
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as { id?: unknown; exp?: unknown };
    if (
      typeof payload.id !== "number" ||
      !Number.isSafeInteger(payload.id) ||
      payload.id < 1 ||
      typeof payload.exp !== "number" ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      throw new HttpError(401, "Unauthorized");
    }
    return { id: payload.id };
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, "Unauthorized");
  }
}

function publicUser(user: UserRow): PublicUser {
  const { password_hash, password_salt, ...result } = user;
  return result;
}

export async function register(request: Request): Promise<Response> {
  if (request.method !== "POST") return methodNotAllowed("POST");
  try {
    const body = await readBody(request);
    const { username, password } = requireCredentials(body);
    if (typeof body.email !== "string") {
      throw new HttpError(400, "A valid email is required");
    }
    const email = body.email.trim().toLowerCase();
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpError(400, "A valid email is required");
    }
    const disabilityType =
      typeof body.disablility_type === "string"
        ? body.disablility_type.trim()
        : "";
    if (!disabilityType || disabilityType.length > 100) {
      throw new HttpError(400, "An accessibility preference is required");
    }

    requireJwtSecret();
    const salt = randomBytes(16).toString("hex");
    const passwordHash = (await hashPassword(password, salt)).toString("hex");
    const sql = getDatabase();
    let rows: UserRow[];
    try {
      rows = await sql<UserRow[]>`
        INSERT INTO users (username, email, password_hash, password_salt, disability_type)
        VALUES (${username}, ${email}, ${passwordHash}, ${salt}, ${disabilityType})
        RETURNING id, username, email, password_hash, password_salt,
                  disability_type, created_at, updated_at
      `;
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
      ) {
        throw new HttpError(409, "Username or email is already in use");
      }
      throw error;
    }
    const user = rows[0];
    return jsonResponse({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return handleError(error);
  }
}

export async function signIn(request: Request): Promise<Response> {
  if (request.method !== "POST") return methodNotAllowed("POST");
  try {
    const { username, password } = requireCredentials(await readBody(request));
    requireJwtSecret();
    const sql = getDatabase();
    const rows = await sql<UserRow[]>`
      SELECT id, username, email, password_hash, password_salt,
             disability_type, created_at, updated_at
      FROM users
      WHERE LOWER(username) = LOWER(${username})
      LIMIT 1
    `;
    const user = rows[0];
    if (!user) throw new HttpError(401, "Invalid username or password");

    const candidate = await hashPassword(password, user.password_salt);
    const storedHash = Buffer.from(user.password_hash, "hex");
    if (
      candidate.length !== storedHash.length ||
      !timingSafeEqual(Uint8Array.from(candidate), Uint8Array.from(storedHash))
    ) {
      throw new HttpError(401, "Invalid username or password");
    }

    return jsonResponse({ token: createToken(user), user: publicUser(user) });
  } catch (error) {
    return handleError(error);
  }
}

export async function getCurrentUser(request: Request): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed("GET");
  try {
    const { id } = verifyToken(request);
    const sql = getDatabase();
    const rows = await sql<UserRow[]>`
      SELECT id, username, email, password_hash, password_salt,
             disability_type, created_at, updated_at
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!rows[0]) throw new HttpError(401, "Unauthorized");
    return jsonResponse(publicUser(rows[0]));
  } catch (error) {
    return handleError(error);
  }
}
