"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Users, Building, FileText, CreditCard, Activity, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/auth.hook";
import { useAdminAnalytics } from "@/hooks/analytics.hook";

export default function AdminDashboardOverview() {
  const { data: userResponse } = useUser();
  const { data: analyticsResponse, isLoading } = useAdminAnalytics();

  const user = userResponse?.data;
  const analytics = analyticsResponse?.data as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          System overview and platform management. Welcome back, {user?.name?.split(' ')[0] || 'Admin'}!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold text-indigo-600">৳{analytics?.totalRevenue || 0}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Total volume processed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Registered accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Properties</CardTitle>
            <Building className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.totalBuildings || 0}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Buildings on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <FileText className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Platform wide reservations</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Management</CardTitle>
            <CardDescription>Quick access to administrative panels.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/admin/users">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                Manage Users
              </Button>
            </Link>
            <Link href="/dashboard/admin/owners">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <CheckCircle className="h-6 w-6" />
                Verify Owners
              </Button>
            </Link>
            <Link href="/dashboard/admin/buildings">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Building className="h-6 w-6" />
                All Properties
              </Button>
            </Link>
            <Link href="/dashboard/admin/payments">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <CreditCard className="h-6 w-6" />
                Payment Logs
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform operational status.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">API Server</span>
                </div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600">Operational</Badge>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">Database</span>
                </div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600">Operational</Badge>
              </div>
              <div className="flex justify-between items-center p-4 border rounded-lg bg-emerald-50/50 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-medium">bKash Gateway</span>
                </div>
                <Badge className="bg-emerald-500 hover:bg-emerald-600">Operational</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
