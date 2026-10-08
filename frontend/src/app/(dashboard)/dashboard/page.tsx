"use client";

import { useGetMe } from "@/hooks/auth.hook";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { OwnerDashboard } from "@/components/dashboard/OwnerDashboard";
import { TenantDashboard } from "@/components/dashboard/TenantDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data: user, isLoading } = useGetMe();

  if (isLoading || !user) {
    return (
      <div className="flex h-full min-h-[500px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const role = user.data?.role;

  if (role === "ADMIN") {
    return <AdminDashboard />;
  }

  if (role === "OWNER") {
    return <OwnerDashboard />;
  }

  if (role === "TENANT") {
    return <TenantDashboard />;
  }

  return (
    <div className="flex h-full min-h-[500px] items-center justify-center text-red-500">
      Invalid Role configuration
    </div>
  );
}
