"use client";

import { useAdminAnalytics } from "@/hooks/analytics.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building2,
  Home,
  DoorOpen,
  CalendarCheck,
  Wallet,
} from "lucide-react";

export function AdminDashboard() {
  const { data: analytics, isLoading, isError } = useAdminAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
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
      <div className="rounded-3xl border border-primary/15 bg-primary/[0.06] p-6 md:p-8">
        <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Control center
        </p>
        <h2 className="font-heading text-3xl font-bold tracking-tight">
          Admin Overview
        </h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          What is happening across the entire platform right now.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="motion-rise motion-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <span className="rounded-xl bg-primary/10 p-2 text-primary">
              <Users className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Owners
            </CardTitle>
            <span className="rounded-xl bg-violet-500/10 p-2 text-violet-500">
              <Users className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.owners}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Buildings
            </CardTitle>
            <span className="rounded-xl bg-sky-500/10 p-2 text-sky-500">
              <Building2 className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.buildings}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Flats
            </CardTitle>
            <span className="rounded-xl bg-amber-500/10 p-2 text-amber-500">
              <Home className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.flats}</div>
          </CardContent>
        </Card>

        <Card className="motion-rise motion-delay-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rooms
            </CardTitle>
            <span className="rounded-xl bg-rose-500/10 p-2 text-rose-500">
              <DoorOpen className="h-4 w-4" />
            </span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rooms}</div>
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
              Total Revenue
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
    </div>
  );
}
