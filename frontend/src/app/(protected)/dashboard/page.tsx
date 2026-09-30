"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/auth.provider";
import { UserRole } from "@/types/models";
import { Loader2 } from "lucide-react";

export default function DashboardIndexPage() {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/login");
      } else {
        if (user.role === UserRole.TENANT) {
          router.push("/dashboard/tenant");
        } else if (user.role === UserRole.OWNER) {
          router.push("/dashboard/owner");
        } else if (user.role === UserRole.ADMIN) {
          router.push("/dashboard/admin");
        } else {
          router.push("/login");
        }
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
    </div>
  );
}
