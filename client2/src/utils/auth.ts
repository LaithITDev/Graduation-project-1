export type AuthUser = {
  id: number;
  username: string;
  email: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

const SESSION_KEY = "neuronnote.session";
const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_API_URL?.replace(/\/+$/, "")
    : undefined;
const AUTH_URL = API_URL ? `${API_URL}/auth` : "/api/auth";

export function readSession(): AuthSession | null {
  const storedSession = window.localStorage.getItem(SESSION_KEY);
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession) as AuthSession;
    if (
      typeof session.token === "string" &&
      session.token.length > 0 &&
      Number.isSafeInteger(session.user?.id) &&
      typeof session.user?.username === "string" &&
      typeof session.user?.email === "string"
    ) {
      return session;
    }
  } catch {
    clearSession();
  }

  clearSession();
  return null;
}

export function saveSession(session: AuthSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

export async function verifySession(): Promise<boolean> {
  const session = readSession();
  if (!session) return false;

  let response: Response;
  try {
    response = await fetch(`${AUTH_URL}/me`, {
      headers: { Authorization: `Bearer ${session.token}` },
    });
  } catch {
    throw new Error("Could not verify your session. Check your connection and retry.");
  }

  if (response.status === 401 || response.status === 403) {
    clearSession();
    return false;
  }
  if (!response.ok) {
    throw new Error("Could not verify your session. Please try again.");
  }

  const result = await response.json().catch(() => null);
  if (
    !result ||
    !Number.isSafeInteger(result.id) ||
    typeof result.username !== "string" ||
    typeof result.email !== "string"
  ) {
    clearSession();
    return false;
  }

  saveSession({
    token: session.token,
    user: { id: result.id, username: result.username, email: result.email },
  });
  return true;
}

async function submitAuthRequest(
  endpoint: "login" | "register",
  values: Record<string, string>
): Promise<AuthSession> {
  let response: Response;
  try {
    response = await fetch(`${AUTH_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
  } catch {
    throw new Error("Could not reach the server. Please try again shortly.");
  }

  const result = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("That username and password do not match.");
    }
    const message = Array.isArray(result?.message)
      ? result.message.join(" ")
      : result?.message;
    throw new Error(message || "We could not complete your request.");
  }

  if (!result?.token || !result?.user?.username) {
    throw new Error("The server returned an invalid sign-in response.");
  }

  const session = result as AuthSession;
  saveSession(session);
  return session;
}

export function signIn(username: string, password: string): Promise<AuthSession> {
  return submitAuthRequest("login", { username, password });
}

export function signUp(values: {
  username: string;
  email: string;
  password: string;
  disablility_type: string;
}): Promise<AuthSession> {
  return submitAuthRequest("register", values);
}