"use client";
import { ProtectedRoute } from "@/providers/auth.provider";
import { DashboardLayout, ownerNavItems } from "@/components/layout/dashboard/DashboardLayout";
import { UserRole } from "@/types/models";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
      <DashboardLayout navItems={ownerNavItems}>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
