"use client";

import { useOwnerAnalytics } from "@/hooks/analytics.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Home,
  DoorOpen,
  CalendarCheck,
  Wallet,
  DoorClosed,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OwnerDashboard() {
  const { data: analytics, isLoading, isError } = useOwnerAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !analytics?.data) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">
          Unable to load dashboard data
        </h3>
        <p className="text-red-600 dark:text-red-500 mt-2">
          Something went wrong. Please try again later.
        </p>
      </div>
    );
  }

  const stats = analytics.data;

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="rounded-3xl border border-primary/15 bg-primary/[0.06] p-6 md:flex md:items-center md:justify-between md:p-8">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Property studio
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            Owner Dashboard
          </h2>
          <p className="mt-2 text-muted-foreground">
            How your properties are performing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Link href="/dashboard/buildings">Manage Buildings</Link>
          </Button>
          <Button variant="outline">
            <Link href="/dashboard/bookings">View Bookings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <Card className="motion-rise motion-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              My Buildings
            </CardTitle>
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <Building2 className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.buildings}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Flats
            </CardTitle>
            <span className="rounded-xl bg-sky-500/10 p-2 text-sky-500">
              <Home className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flats}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Available Rooms
            </CardTitle>
            <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <DoorOpen className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.availableRooms}</div>
            <p className="text-xs text-muted-foreground">
              Out of {stats.rooms} total rooms
            </p>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Occupied Rooms
            </CardTitle>
            <span className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <DoorClosed className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.occupiedRooms}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Bookings
            </CardTitle>
            <span className="rounded-xl bg-indigo-500/10 p-2 text-indigo-500">
              <CalendarCheck className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Successful Payments
            </CardTitle>
            <span className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500">
              <Wallet className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats.payments?.successfulAmount?.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.payments?.successfulCount || 0} payments
            </p>
          </CardContent>
        </Card>
      </div>

      {stats.buildings === 0 && (
        <div className="mt-8 p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center">
          <Building2 className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            No properties yet
          </h3>
          <p className="text-gray-500 max-w-sm mt-1 mb-4">
            Start by adding your first building to manage flats and rooms.
          </p>
          <Button>
            <Link href="/dashboard/buildings">Add Building</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
