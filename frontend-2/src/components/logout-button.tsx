"use client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
export function LogoutButton() {
  const router = useRouter();
  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      router.replace("/login");
      router.refresh();
    }
  };
  return (
    <button type="button" className="side-logout" onClick={logout}>
      <LogOut size={16} /> Sign out
    </button>
  );
}
