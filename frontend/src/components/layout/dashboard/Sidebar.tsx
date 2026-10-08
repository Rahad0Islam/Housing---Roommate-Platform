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
  Building
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
        { name: "My Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
        { name: "Browse Properties", href: "/buildings", icon: Building },
      ];
    }

    if (role === "OWNER") {
      return [
        ...baseLinks,
        { name: "My Buildings", href: "/dashboard/buildings", icon: Building2 },
        { name: "Flats", href: "/dashboard/flats", icon: Home },
        { name: "Rooms", href: "/dashboard/rooms", icon: DoorOpen },
        { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
      ];
    }

    if (role === "ADMIN") {
      return [
        ...baseLinks,
        { name: "Users", href: "/dashboard/users", icon: Users },
        { name: "Buildings", href: "/dashboard/buildings", icon: Building2 },
        { name: "Bookings", href: "/dashboard/bookings", icon: CalendarCheck },
      ];
    }

    return baseLinks;
  };

  const links = getLinks();

  return (
    <div className={cn("flex flex-col h-full bg-white dark:bg-gray-900 border-r dark:border-gray-800", className)}>
      <div className="p-6 border-b dark:border-gray-800">
        <Link href="/" className="flex items-center space-x-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-gray-900 dark:text-gray-100">RoommateFinder</span>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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

      <div className="p-4 border-t dark:border-gray-800">
        <ul className="space-y-1">
          <li>
            <Link
              href="/dashboard/profile"
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === "/dashboard/profile"
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
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
