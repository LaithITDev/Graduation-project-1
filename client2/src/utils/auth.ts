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
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:7070";

export function readSession(): AuthSession | null {
  const storedSession = window.localStorage.getItem(SESSION_KEY);
  if (!storedSession) return null;

  try {
    const session = JSON.parse(storedSession) as AuthSession;
    if (session.token && session.user?.username) return session;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
  }

  return null;
}

export function saveSession(session: AuthSession): void {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  window.localStorage.removeItem(SESSION_KEY);
}

async function submitAuthRequest(
  endpoint: "login" | "register",
  values: Record<string, string>
): Promise<AuthSession> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/auth/${endpoint}`, {
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