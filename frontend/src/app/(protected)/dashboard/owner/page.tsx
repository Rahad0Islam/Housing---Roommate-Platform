"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOwnerAnalytics } from "@/hooks/analytics.hook";
import { Building2, CreditCard, Home, Loader2, Users } from "lucide-react";
import { useAuthContext } from "@/providers/auth.provider";

export default function OwnerOverviewPage() {
  const { user } = useAuthContext();
  const { data, isLoading, isError } = useOwnerAnalytics();
  
  const analytics = data?.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Owner Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Welcome back, {user?.name}. Here's the performance of your properties.
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
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Buildings
              </CardTitle>
              <Building2 className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {analytics?.totalBuildings || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Rooms
              </CardTitle>
              <Home className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {analytics?.totalRooms || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Occupancy Rate
              </CardTitle>
              <Users className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {analytics?.occupancyRate || 0}%
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Total Revenue
              </CardTitle>
              <CreditCard className="h-4 w-4 text-zinc-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                ৳ {analytics?.totalRevenue?.toLocaleString() || "0"}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
