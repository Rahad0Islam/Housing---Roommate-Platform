"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Building2, 
  Home, 
  LayoutDashboard, 
  Settings, 
  Users, 
  CreditCard, 
  FileText,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  CheckCircle,
  FileBarChart
} from "lucide-react";
import { useAuthContext } from "@/providers/auth.provider";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/auth.hook";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
}

export function DashboardLayout({ children, navItems }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuthContext();
  const logoutMutation = useLogout();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync(undefined);
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 sticky top-0 z-50">
        <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
          H&R Platform
        </Link>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:flex-shrink-0 flex flex-col",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
          <Link href="/" className="font-bold text-xl tracking-tight text-zinc-900 dark:text-zinc-50">
            H&R Platform
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group",
                  isActive 
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50" 
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-50"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400 group-hover:text-zinc-500 dark:group-hover:text-zinc-300"
                )} />
                {item.title}
              </Link>
            )
          })}
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center mb-4 px-2">
            <div className="h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center flex-shrink-0">
              <UserIcon className="h-5 w-5 text-zinc-500" />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-50 truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Log out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

// Reusable configurations for navigation
export const tenantNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard/tenant", icon: LayoutDashboard },
  { title: "Find Properties", href: "/properties", icon: Building2 },
  { title: "My Bookings", href: "/dashboard/tenant/bookings", icon: FileText },
  { title: "Monthly Rent", href: "/dashboard/tenant/rent", icon: CreditCard },
  { title: "Utility Bills", href: "/dashboard/tenant/utilities", icon: FileBarChart },
  { title: "Roommates", href: "/dashboard/tenant/roommates", icon: Users },
  { title: "Profile", href: "/dashboard/tenant/profile", icon: UserIcon },
];

export const ownerNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
  { title: "Buildings", href: "/dashboard/owner/buildings", icon: Building2 },
  { title: "Flats & Rooms", href: "/dashboard/owner/flats", icon: Home },
  { title: "Bookings", href: "/dashboard/owner/bookings", icon: FileText },
  { title: "Monthly Rent", href: "/dashboard/owner/rent", icon: CreditCard },
  { title: "Utility Bills", href: "/dashboard/owner/utilities", icon: FileBarChart },
  { title: "Analytics", href: "/dashboard/owner/analytics", icon: FileBarChart },
  { title: "Verification", href: "/dashboard/owner/verification", icon: CheckCircle },
  { title: "Profile", href: "/dashboard/owner/profile", icon: UserIcon },
];

export const adminNavItems: NavItem[] = [
  { title: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { title: "Users", href: "/dashboard/admin/users", icon: Users },
  { title: "Owner Apps", href: "/dashboard/admin/owners", icon: CheckCircle },
  { title: "Buildings", href: "/dashboard/admin/buildings", icon: Building2 },
  { title: "Bookings", href: "/dashboard/admin/bookings", icon: FileText },
  { title: "Payments", href: "/dashboard/admin/payments", icon: CreditCard },
  { title: "Analytics", href: "/dashboard/admin/analytics", icon: FileBarChart },
  { title: "Settings", href: "/dashboard/admin/settings", icon: Settings },
];
