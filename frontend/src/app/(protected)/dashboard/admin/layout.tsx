"use client";
import { ProtectedRoute } from "@/providers/auth.provider";
import { DashboardLayout, adminNavItems } from "@/components/layout/dashboard/DashboardLayout";
import { UserRole } from "@/types/models";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <DashboardLayout navItems={adminNavItems}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
