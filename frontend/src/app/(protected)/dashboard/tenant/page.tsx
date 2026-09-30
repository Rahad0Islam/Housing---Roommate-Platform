"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTenantAnalytics } from "@/hooks/analytics.hook";
import { CreditCard, FileText, LayoutDashboard, Loader2 } from "lucide-react";
import { useAuthContext } from "@/providers/auth.provider";

export default function TenantOverviewPage() {
  const { user } = useAuthContext();
  const { data, isLoading, isError } = useTenantAnalytics();
  
  const analytics = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Here's an overview of your housing activities.
        </p>
      </div>
      
      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
           <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-500">
          Failed to load analytics data.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Active Bookings
              </CardTitle>
              <LayoutDashboard className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {analytics?.activeBookings || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Rent Paid
              </CardTitle>
              <CreditCard className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                ৳ {analytics?.totalPaidRent?.toLocaleString() || "0"}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Pending Bills
              </CardTitle>
              <FileText className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {analytics?.pendingBills || 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
