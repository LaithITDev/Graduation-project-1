import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { readSession, verifySession } from "../utils/auth";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [status, setStatus] = useState<
    "checking" | "authorized" | "unauthorized" | "error"
  >(() => (readSession() ? "checking" : "unauthorized"));
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    if (!readSession()) {
      setStatus("unauthorized");
      return () => {
        active = false;
      };
    }

    setStatus("checking");
    verifySession()
      .then((isAuthorized) => {
        if (active) setStatus(isAuthorized ? "authorized" : "unauthorized");
      })
      .catch(() => {
        if (active) setStatus("error");
      });

    return () => {
      active = false;
    };
  }, [retry]);

  if (!readSession() || status === "unauthorized") {
    return <Navigate to="/register" replace />;
  }
  if (status === "checking") {
    return <p role="status">Checking your session…</p>;
  }
  if (status === "error") {
    return (
      <main>
        <p role="alert">We could not verify your sign-in.</p>
        <button onClick={() => setRetry((value) => value + 1)} type="button">
          Retry
        </button>
      </main>
    );
  }
  return <>{children}</>;
}
