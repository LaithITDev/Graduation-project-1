import { ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@chakra-ui/react";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer: ReactNode;
  children: ReactNode;
};

export default function AuthLayout({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <aside className="auth-visual" aria-label="NeuroNote">
        <Link as={RouterLink} to="/" className="auth-brand">
          <img src="/logo-white.svg" alt="NeuroNote home" />
        </Link>
        <div className="auth-visual-copy">
          <p className="auth-visual-kicker">A quieter way to create</p>
          <h2>Make room for your sound.</h2>
          <p>Turn each session into a small moment of music, at your own pace.</p>
        </div>
        <div className="auth-waveform" aria-hidden="true">
          {[18, 30, 45, 25, 58, 34, 72, 43, 26, 54, 35, 65, 28, 48, 20].map(
            (height, index) => (
              <span
                key={index}
                style={{ height: `${height}px`, animationDelay: `${index * 45}ms` }}
              />
            )
          )}
        </div>
      </aside>

      <section className="auth-side">
        <div className="auth-form-wrap">
          <p className="auth-eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-description">{description}</p>
          <div className="auth-form-card">{children}</div>
          <p className="auth-footer">{footer}</p>
        </div>
      </section>
    </main>
  );
}