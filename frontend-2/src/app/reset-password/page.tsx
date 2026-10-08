"use client";
import Link from "next/link";
import { useState } from "react";
import { api } from "@/lib/api";
export default function ResetPasswordPage() {
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setDone(true);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to reset password",
      );
    }
  }
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="kicker">New password</p>
        <h1>Start fresh.</h1>
        {done ? (
          <>
            <p className="muted">Your password has been updated.</p>
            <Link className="button button-primary button-large" href="/login">
              Continue to sign in
            </Link>
          </>
        ) : (
          <>
            <label>
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </label>
            <label>
              Reset code
              <input
                required
                minLength={6}
                maxLength={6}
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
              />
            </label>
            <label>
              New password
              <input
                required
                type="password"
                minLength={6}
                value={form.newPassword}
                onChange={(e) =>
                  setForm({ ...form, newPassword: e.target.value })
                }
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button
              type="submit"
              className="button button-primary button-large"
            >
              Update password
            </button>
          </>
        )}
      </form>
    </main>
  );
}
