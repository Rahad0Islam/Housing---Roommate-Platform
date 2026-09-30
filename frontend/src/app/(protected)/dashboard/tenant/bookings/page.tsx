"use client";

import React from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Loader2, Eye, Calendar, Building, Home, CheckCircle, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookings } from "@/hooks/booking.hook";

export default function TenantBookingsPage() {
  const { data: response, isLoading, isError } = useBookings();
  const bookings = response?.data?.data || response?.data || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      case 'CONFIRMED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1"/> Confirmed</Badge>;
      case 'ON_GOING':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200"><Home className="w-3 h-3 mr-1"/> On-going</Badge>;
      case 'COMPLETED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><CheckCircle className="w-3 h-3 mr-1"/> Completed</Badge>;
      case 'CANCELLED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1"/> Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (payments: any[]) => {
    if (!payments || payments.length === 0) {
      return <Badge variant="outline" className="text-zinc-500">Unpaid</Badge>;
    }
    const latestPayment = payments[payments.length - 1];
    if (latestPayment.status === 'SUCCESS') {
      return <Badge className="bg-emerald-500 hover:bg-emerald-600">Paid</Badge>;
    }
    return <Badge variant="outline" className="text-zinc-500">{latestPayment.status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Bookings
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your property reservations and view booking history.
          </p>
        </div>
        <Link href="/properties">
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900">
            Find New Property
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>A list of all your requested and confirmed room bookings.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="pl-6">Property</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Type & Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right pr-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
                    <p className="text-sm text-zinc-500 mt-2">Loading bookings...</p>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-red-500">
                    Failed to load bookings.
                  </TableCell>
                </TableRow>
              ) : bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <Building className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                    <p className="text-zinc-500">You haven't made any bookings yet.</p>
                    <Link href="/properties">
                      <Button variant="link" className="mt-2 text-indigo-600">Browse available properties</Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking: any) => (
                  <TableRow key={booking.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <TableCell className="pl-6 font-medium">
                      <div className="flex flex-col">
                        <span className="text-zinc-900 dark:text-zinc-100">{booking.room?.name || 'Unknown Room'}</span>
                        <span className="text-xs text-zinc-500 flex items-center mt-1">
                          <Building className="w-3 h-3 mr-1" />
                          {booking.room?.flat?.building?.name || 'Unknown Building'} - Flat {booking.room?.flat?.flatNo || '?'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-sm">
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1 text-zinc-400" /> 
                          {format(new Date(booking.startDate), 'MMM d, yyyy')}
                        </span>
                        <span className="text-zinc-500 text-xs ml-4">to {format(new Date(booking.endDate), 'MMM d, yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">৳{booking.amount}</span>
                        <span className="text-xs text-zinc-500">{booking.rentType.replace('_', ' ')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(booking.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(booking.payments)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Link href={`/dashboard/tenant/bookings/${booking.id}`}>
                        <Button variant="outline" size="sm" className="h-8 border-zinc-200 hover:bg-zinc-100">
                          <Eye className="h-4 w-4 mr-2" /> Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
