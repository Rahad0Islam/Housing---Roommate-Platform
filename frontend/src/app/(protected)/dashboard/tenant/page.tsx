"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Home, CreditCard, Droplets, Receipt, Calendar, ArrowRight, Building, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/auth.hook";
import { useBookings } from "@/hooks/booking.hook";
import { useMonthlyBills } from "@/hooks/rent.hook";
import { useUtilityBills } from "@/hooks/utility.hook";

export default function TenantDashboardOverview() {
  const { data: userResponse } = useUser();
  const { data: bookingsResponse, isLoading: isLoadingBookings } = useBookings();
  const { data: rentResponse, isLoading: isLoadingRent } = useMonthlyBills();
  const { data: utilsResponse, isLoading: isLoadingUtils } = useUtilityBills();

  const user = userResponse?.data;
  const bookings = bookingsResponse?.data?.data || bookingsResponse?.data || [];
  const monthlyBills = rentResponse?.data?.data || rentResponse?.data || [];
  const utilityBills = utilsResponse?.data?.data || utilsResponse?.data || [];

  const activeBooking = bookings.find((b: any) => b.status === 'ON_GOING' || b.status === 'CONFIRMED');
  const pendingRent = monthlyBills.filter((b: any) => b.status === 'PENDING' || b.status === 'OVERDUE');
  const pendingUtils = utilityBills.filter((b: any) => b.status === 'UNPAID');

  const totalPendingAmount = pendingRent.reduce((sum: number, bill: any) => sum + Number(bill.amount), 0) +
                             pendingUtils.reduce((sum: number, bill: any) => sum + Number(bill.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Welcome back, {user?.name?.split(' ')[0] || 'Tenant'}! 👋
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Here is an overview of your current living arrangements and pending tasks.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRent || isLoadingUtils ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold text-red-600">৳{totalPendingAmount}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Rent & utilities combined</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Home className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{activeBooking ? 1 : 0}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Currently assigned rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rent Bills</CardTitle>
            <Receipt className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingRent ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{pendingRent.length}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Requires your attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Utilities</CardTitle>
            <Droplets className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            {isLoadingUtils ? (
              <Loader2 className="h-4 w-4 animate-spin text-zinc-400" />
            ) : (
              <div className="text-2xl font-bold">{pendingUtils.length}</div>
            )}
            <p className="text-xs text-zinc-500 mt-1">Requires your attention</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Current Residency</CardTitle>
            <CardDescription>Your active booking and room details.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingBookings ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
              </div>
            ) : activeBooking ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                      <Home className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{activeBooking.room?.name || "Room"}</p>
                      <p className="text-sm text-zinc-500 flex items-center">
                        <Building className="w-3 h-3 mr-1" />
                        {activeBooking.room?.flat?.building?.name || "Building"} - Flat {activeBooking.room?.flat?.flatNo || ""}
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500">Active</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 mb-1">Move-in Date</p>
                    <p className="font-medium flex items-center"><Calendar className="w-3 h-3 mr-1 text-zinc-400" /> {format(new Date(activeBooking.startDate), 'MMM do, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Contract End Date</p>
                    <p className="font-medium flex items-center"><Calendar className="w-3 h-3 mr-1 text-zinc-400" /> {format(new Date(activeBooking.endDate), 'MMM do, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Monthly Rent</p>
                    <p className="font-medium">৳{activeBooking.room?.monthlyRent}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 mb-1">Contract Type</p>
                    <p className="font-medium">{activeBooking.rentType.replace('_', ' ')}</p>
                  </div>
                </div>
                
                <div className="pt-4 flex gap-3">
                  <Link href={`/dashboard/tenant/bookings/${activeBooking.id}`} className="w-full">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Home className="h-12 w-12 mx-auto text-zinc-300 mb-4" />
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-50">No Active Booking</h3>
                <p className="text-sm text-zinc-500 mt-2 mb-6 max-w-sm mx-auto">
                  You are not currently staying in any property. Browse available properties to make a booking.
                </p>
                <Link href="/properties">
                  <Button>Find a Property</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Action Center</CardTitle>
            <CardDescription>Items needing your immediate attention.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRent.map((bill: any) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border border-red-200 bg-red-50 dark:border-red-900/30 dark:bg-red-950/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Receipt className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="font-medium text-red-700 dark:text-red-400 text-sm">Rent due for {format(new Date(bill.billingMonth), 'MMMM')}</p>
                      <p className="text-xs text-red-600/80 font-semibold">৳{bill.amount}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/tenant/rent">
                    <Button size="sm" className="bg-[#E2136E] hover:bg-[#b00f56] text-white">Pay Now</Button>
                  </Link>
                </div>
              ))}
              
              {pendingUtils.map((bill: any) => (
                <div key={bill.id} className="flex items-center justify-between p-3 border border-yellow-200 bg-yellow-50 dark:border-yellow-900/30 dark:bg-yellow-950/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplets className="h-8 w-8 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-800 dark:text-yellow-500 text-sm">{bill.utilityType} Bill</p>
                      <p className="text-xs text-yellow-700/80 font-semibold">৳{bill.amount}</p>
                    </div>
                  </div>
                  <Link href="/dashboard/tenant/utilities">
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white">Pay Now</Button>
                  </Link>
                </div>
              ))}

              {pendingRent.length === 0 && pendingUtils.length === 0 && (
                <div className="text-center py-8 text-zinc-500">
                  <CheckCircle2 className="h-10 w-10 mx-auto text-green-500 mb-2 opacity-50" />
                  <p className="text-sm">You're all caught up!</p>
                  <p className="text-xs mt-1">No pending payments.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
