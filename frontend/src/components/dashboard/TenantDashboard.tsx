"use client";

import { useTenantAnalytics } from "@/hooks/analytics.hook";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarCheck, Wallet, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function TenantDashboard() {
  const { data: analytics, isLoading, isError } = useTenantAnalytics();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !analytics?.data) {
    return (
      <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-400">Unable to load dashboard data</h3>
        <p className="text-red-600 dark:text-red-500 mt-2">Something went wrong. Please try again later.</p>
      </div>
    );
  }

  const stats = analytics.data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Tenant Dashboard</h2>
          <p className="text-muted-foreground">Manage your bookings and payments.</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Link href="/buildings">Find a Room</Link>
          </Button>
          <Button variant="outline">
            <Link href="/dashboard/bookings">My Bookings</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.bookings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.payments?.successfulAmount?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">From {stats.payments?.successfulCount || 0} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Rent Records</CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.monthlyPayments}</div>
          </CardContent>
        </Card>
      </div>

      {stats.bookings === 0 && (
        <div className="mt-8 p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center">
          <Search className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No bookings yet</h3>
          <p className="text-gray-500 max-w-sm mt-1 mb-4">You haven&apos;t booked any rooms yet. Browse our properties to find your next home.</p>
          <Button>
            <Link href="/buildings">Browse Properties</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
