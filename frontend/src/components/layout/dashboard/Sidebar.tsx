"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMe } from "@/hooks/auth.hook";
import {
  LayoutDashboard,
  Building2,
  Home,
  DoorOpen,
  CalendarCheck,
  Users,
  UserCircle,
  LogOut,
  Building,
  ReceiptIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { data: user } = useGetMe();
  const role = user?.data?.role;

  const getLinks = () => {
    const baseLinks = [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ];

    if (role === "TENANT") {
      return [
        ...baseLinks,
        {
          name: "My Bookings",
          href: "/dashboard/bookings",
          icon: CalendarCheck,
        },
        {
          name: "Monthly Bills",
          href: "/dashboard/monthly-bills",
          icon: ReceiptIcon,
        },
        { name: "Find Roommates", href: "/dashboard/roommates", icon: Users },
        {
          name: "Apply as Owner",
          href: "/dashboard/apply-owner",
          icon: Building2,
        },
        { name: "Browse Properties", href: "/buildings", icon: Building },
      ];
    }

    if (role === "OWNER") {
      return [
        ...baseLinks,
        { name: "My Buildings", href: "/dashboard/buildings", icon: Building2 },
        { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
        { name: "Utility Bills", href: "/dashboard/utility-bills", icon: Home },
      ];
    }

    if (role === "ADMIN") {
      return [
        ...baseLinks,
        { name: "Users", href: "/dashboard/users", icon: Users },
        {
          name: "Owner Apps",
          href: "/dashboard/owner-applications",
          icon: Building2,
        },
        { name: "Buildings", href: "/dashboard/buildings", icon: Building2 },
        { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
      ];
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <div
      className={cn(
        "flex h-full flex-col border-r border-border/70 bg-sidebar",
        className,
      )}
    >
      <div className="border-b border-border/70 p-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Home className="h-5 w-5" />
          </span>
          <span className="font-heading text-lg font-bold tracking-tight">
            Roommate<span className="text-primary">Finder</span>
          </span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <p className="px-6 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Workspace
        </p>
        <ul className="space-y-1.5 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/15"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border/70 p-4">
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/profile"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === "/dashboard/profile"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <UserCircle className="h-5 w-5" />
              Profile
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
