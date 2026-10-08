"use client";
export const dynamic = "force-dynamic";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  useEffect(
    () =>
      setEmail(new URLSearchParams(window.location.search).get("email") ?? ""),
    [],
  );
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await api("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ email: email, otp }),
      });
      router.push("/login");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="kicker">One last step</p>
        <h1>Check your inbox.</h1>
        <p className="muted">Enter the six-digit code sent to your email.</p>
        <label>
          Verification code
          <input
            required
            minLength={6}
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button
          type="submit"
          className="button button-primary button-large"
          disabled={busy}
        >
          {busy ? "Verifying..." : "Verify email"}
        </button>
      </form>
    </main>
  );
}
