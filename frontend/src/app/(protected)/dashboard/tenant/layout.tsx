"use client";
import { ProtectedRoute } from "@/providers/auth.provider";
import { DashboardLayout, tenantNavItems } from "@/components/layout/dashboard/DashboardLayout";
import { UserRole } from "@/types/models";

export default function TenantLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.TENANT]}>
      <DashboardLayout navItems={tenantNavItems}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
