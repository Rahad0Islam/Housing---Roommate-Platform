"use client";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to send reset code",
      );
    }
  }
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="kicker">Account recovery</p>
        <h1>Find your way back.</h1>
        <p className="muted">
          {sent
            ? "Check your inbox for a reset code."
            : "Enter your account email and we will send a reset code."}
        </p>
        {!sent && (
          <>
            <label>
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button
              type="submit"
              className="button button-primary button-large"
            >
              Send reset code
            </button>
          </>
        )}
        <p className="auth-foot">
          <Link href="/login">Back to sign in</Link>
        </p>
      </form>
    </main>
  );
}
