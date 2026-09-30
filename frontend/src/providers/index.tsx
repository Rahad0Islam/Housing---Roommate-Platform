"use client";

import { ReactNode } from "react";
import QueryProvider from "./query.provider";
import GoogleAuthProvider from "./google-auth.provider";
import { AuthProvider } from "./auth.provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
  <GoogleAuthProvider>
    <QueryProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryProvider>
  </GoogleAuthProvider>
  )
}