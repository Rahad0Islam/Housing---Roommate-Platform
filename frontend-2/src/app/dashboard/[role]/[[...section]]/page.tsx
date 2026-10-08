"use client";
import {
  BarChart3,
  Building2,
  CalendarDays,
  CreditCard,
  Home,
  Menu,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/logout-button";
import { WorkspaceView } from "@/components/workspace-view";
import { useMe } from "@/hooks/use-domain";
import { ApiError } from "@/lib/api";

const nav = {
  tenant: [
    ["Dashboard", ""],
    ["Properties", "properties"],
    ["My bookings", "bookings"],
    ["Payments", "payments"],
    ["Monthly rent", "rent"],
    ["Utility bills", "utilities"],
    ["Roommates", "roommates"],
    ["Profile", "profile"],
    ["Settings", "settings"],
  ],
  owner: [
    ["Dashboard", ""],
    ["Buildings", "buildings"],
    ["Flats", "flats"],
    ["Rooms", "rooms"],
    ["Amenities", "amenities"],
    ["Bookings", "bookings"],
    ["Payments", "payments"],
    ["Monthly rent", "rent"],
    ["Utility bills", "utilities"],
    ["Analytics", "analytics"],
    ["Profile", "profile"],
    ["Settings", "settings"],
  ],
  admin: [
    ["Dashboard", ""],
    ["Users", "users"],
    ["Owner applications", "owners"],
    ["Bookings", "bookings"],
    ["Payments", "payments"],
    ["Analytics", "analytics"],
    ["Profile", "profile"],
    ["Settings", "settings"],
  ],
} as const;
const icons = [
  Home,
  Building2,
  Building2,
  CreditCard,
  WalletCards,
  Users,
  Settings,
  CalendarDays,
  BarChart3,
];
export default function DashboardPage() {
  const pathname = usePathname();
  const router = useRouter();
  const me = useMe();
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<"tenant" | "owner" | "admin">("tenant");
  const [, , routeRole, routeSection] = pathname.split("/");
  const section = routeSection ?? "";
  useEffect(() => {
    if (
      routeRole === "owner" ||
      routeRole === "admin" ||
      routeRole === "tenant"
    )
      setRole(routeRole);
  }, [routeRole]);
  useEffect(() => {
    if (me.data?.role && me.data.role.toLowerCase() !== role)
      router.replace(`/dashboard/${me.data.role.toLowerCase()}`);
    if (me.error instanceof ApiError && me.error.status === 401)
      router.replace("/login");
  }, [me.data, me.error, role, router]);
  if (me.isLoading || (me.data?.role && me.data.role.toLowerCase() !== role))
    return (
      <main className="workspace">
        <section className="workspace-content">
          <div className="skeleton table-skeleton" />
        </section>
      </main>
    );
  const items = nav[role];
  const current = section || "Dashboard";
  return (
    <main className="workspace">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="sidebar-top">
          <Link className="brand" href="/">
            <span className="brand-mark">
              <Building2 size={17} />
            </span>
            Havenly
          </Link>
          <button
            type="button"
            className="icon-button mobile-only"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            ×
          </button>
        </div>
        <div className="role-switch">
          <span>Signed in as {role}</span>
        </div>
        <nav className="side-nav">
          {items.map(([label, path], index) => {
            const Icon = icons[index % icons.length];
            return (
              <Link
                className={
                  current.toLowerCase() === label.toLowerCase() ? "current" : ""
                }
                href={`/dashboard/${role}${path ? `/${path}` : ""}`}
                key={label}
                onClick={() => setOpen(false)}
              >
                <Icon size={17} />
                {label}
              </Link>
            );
          })}
        </nav>
        <LogoutButton />
      </aside>
      <section className="workspace-content">
        <div className="workspace-top">
          <button
            type="button"
            className="icon-button mobile-only"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={18} />
          </button>
          <span className="breadcrumb">Workspace / {current}</span>
          <Link className="button button-primary" href="/properties">
            Explore homes
          </Link>
        </div>
        <WorkspaceView role={role} section={section} />
      </section>
    </main>
  );
}
