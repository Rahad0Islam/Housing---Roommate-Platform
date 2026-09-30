"use client";

import React from "react";
import Link from "next/link";
import { Loader2, Building, Home, Users, CreditCard, Receipt, BarChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/auth.hook";
import { useOwnerAnalytics } from "@/hooks/analytics.hook";
import { useOwnerBuildings } from "@/hooks/buildings.hook";
import { useBookings } from "@/hooks/booking.hook";

export default function OwnerDashboardOverview() {
  const { data: userResponse } = useUser();
  const { data: analyticsResponse, isLoading: isLoadingAnalytics } = useOwnerAnalytics();
  const { data: buildingsResponse, isLoading: isLoadingBuildings } = useOwnerBuildings();
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useBookings();

  const user = userResponse?.data;
  const analytics = analyticsResponse?.data;
  const buildings = buildingsResponse?.data || [];
  const bookings = bookingsResponse?.data?.data || bookingsResponse?.data || [];

  const pendingBookings = bookings.filter((b: any) => b.status === 'PENDING');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Owner Dashboard
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Welcome back, {user?.name?.split(' ')[0] || 'Owner'}! Overview of your properties and business.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold text-emerald-600">৳{analytics?.totalRevenue || 0}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">All time earnings</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingBuildings ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{buildings.length}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Active buildings managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Home className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingAnalytics ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{analytics?.occupancyRate || '0'}%</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Total occupied rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold text-amber-600">{pendingBookings.length}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Requires approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your daily operations efficiently.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/owner/buildings">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Building className="h-6 w-6" />
                Add Building
              </Button>
            </Link>
            <Link href="/dashboard/owner/rent">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Receipt className="h-6 w-6" />
                Generate Rent Bill
              </Button>
            </Link>
            <Link href="/dashboard/owner/bookings">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <Users className="h-6 w-6" />
                View Bookings
              </Button>
            </Link>
            <Link href="/dashboard/owner/analytics">
              <Button variant="outline" className="w-full h-24 flex flex-col items-center justify-center gap-2">
                <BarChart className="h-6 w-6" />
                View Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Booking Requests</CardTitle>
            <CardDescription>Tenants waiting for confirmation.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
              </div>
            ) : pendingBookings.length === 0 ? (
              <div className="text-center py-8 text-zinc-500">
                <p>No pending booking requests.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingBookings.slice(0, 4).map((booking: any) => (
                  <div key={booking.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <div>
                      <p className="font-medium text-sm">{booking.room?.name || 'Unknown Room'}</p>
                      <p className="text-xs text-zinc-500">
                        {booking.tenant?.name || 'Tenant'} • ৳{booking.amount}
                      </p>
                    </div>
                    <Link href="/dashboard/owner/bookings">
                      <Button size="sm" variant="secondary">Review</Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
