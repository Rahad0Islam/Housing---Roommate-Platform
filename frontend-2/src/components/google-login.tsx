"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

declare global {
  interface Window {
    __havenlyGoogleInitialized?: boolean;
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: Record<string, string>,
          ) => void;
        };
      };
    };
  }
}
export function GoogleLogin() {
  const router = useRouter();
  const target = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || !target.current) return;
    const mount = () => {
      if (!window.google || !target.current) return;
      if (!window.__havenlyGoogleInitialized) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async ({ credential }) => {
            try {
              await api("/auth/google", {
                method: "POST",
                body: JSON.stringify({ idToken: credential }),
              });
              const user = await api<{ role: string }>("/auth/me");
              router.push(`/dashboard/${user.role.toLowerCase()}`);
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "Google sign-in failed",
              );
            }
          },
        });
        window.__havenlyGoogleInitialized = true;
      }
      window.google.accounts.id.renderButton(target.current, {
        theme: "outline",
        size: "large",
        width: "360",
      });
    };
    if (window.google) mount();
    else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.onload = mount;
      document.head.appendChild(script);
      return () => script.remove();
    }
  }, [router]);
  return (
    <div className="google-login">
      <div ref={target} />
      <button
        type="button"
        className="google-fallback"
        onClick={() =>
          setError(
            "Google sign-in is unavailable until a Google client ID is configured.",
          )
        }
      >
        Continue with Google
      </button>
      {error && <p className="form-error">{error}</p>}
    </div>
  );
}
