"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GoogleLogin } from "@/components/google-login";
import { api } from "@/lib/api";
export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      });
      const user = await api<{ role: string }>("/auth/me");
      router.push(`/dashboard/${user.role.toLowerCase()}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="auth-page">
      <form className="auth-card" onSubmit={submit}>
        <p className="kicker">Welcome back</p>
        <h1>Make yourself at home.</h1>
        <p className="muted">Sign in to your Havenly workspace.</p>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </label>
        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <Link className="auth-recovery" href="/forgot-password">
          Forgot password?
        </Link>
        <button
          type="submit"
          className="button button-primary button-large"
          disabled={busy}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        <GoogleLogin />
        <p className="auth-foot">
          New to Havenly? <Link href="/register">Create an account</Link>
        </p>
      </form>
    </main>
  );
}
