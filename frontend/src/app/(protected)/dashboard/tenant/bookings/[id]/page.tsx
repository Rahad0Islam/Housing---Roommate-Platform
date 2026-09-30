"use client";

import React, { useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { Loader2, ArrowLeft, Building, Home, CheckCircle, XCircle, Clock, CreditCard, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useBooking, useCancelBooking } from "@/hooks/booking.hook";
import { useCreateBkashPayment } from "@/hooks/bkash.hook";
import { toast } from "sonner";

export default function TenantBookingDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  
  const { data: response, isLoading, isError, refetch } = useBooking(id);
  const cancelMutation = useCancelBooking();
  const paymentMutation = useCreateBkashPayment();
  
  const booking = response?.data;

  // Handle bkash callback redirect params
  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success("Payment successful! Your booking is now confirmed.");
      router.replace(`/dashboard/tenant/bookings/${id}`);
      refetch();
    } else if (status === 'cancelled') {
      toast.error("Payment was cancelled or failed.");
      router.replace(`/dashboard/tenant/bookings/${id}`);
      refetch();
    }
  }, [searchParams, id, router, refetch]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
        <p className="mt-4 text-zinc-500">Loading booking details...</p>
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <XCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold">Booking Not Found</h2>
        <p className="text-zinc-500 mt-2">This booking may have been deleted or you don't have access.</p>
        <Button variant="outline" className="mt-6" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    );
  }

  const handleCancel = async () => {
    if (confirm("Are you sure you want to cancel this booking request?")) {
      try {
        await cancelMutation.mutateAsync(id);
        toast.success("Booking cancelled successfully.");
        refetch();
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Failed to cancel booking.");
      }
    }
  };

  const handlePayment = async () => {
    try {
      const res = await paymentMutation.mutateAsync({
        bookingId: id,
        paymentType: "BOOKING"
      });
      if (res?.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to initiate payment.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pending Payment</Badge>;
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

  const latestPayment = booking.payments && booking.payments.length > 0 
    ? booking.payments[booking.payments.length - 1] 
    : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/tenant/bookings')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Booking Details
          </h1>
          <p className="mt-1 text-zinc-600 dark:text-zinc-400">
            #{booking.id.split('-')[0].toUpperCase()}
          </p>
        </div>
        <div className="ml-auto">
          {getStatusBadge(booking.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <Home className="mr-2 h-5 w-5 text-zinc-500" /> Property Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Building</p>
                  <p className="font-medium text-lg">{booking.room?.flat?.building?.name}</p>
                  <p className="text-sm text-zinc-600">{booking.room?.flat?.building?.address}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Room Details</p>
                  <p className="font-medium text-lg">{booking.room?.name}</p>
                  <p className="text-sm text-zinc-600">Flat {booking.room?.flat?.flatNo}</p>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Check-in Date</p>
                  <p className="font-medium">{format(new Date(booking.startDate), 'MMMM do, yyyy')}</p>
                </div>
                <div>
                  <p className="text-sm text-zinc-500">Check-out Date</p>
                  <p className="font-medium">{format(new Date(booking.endDate), 'MMMM do, yyyy')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {latestPayment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center">
                  <Receipt className="mr-2 h-5 w-5 text-zinc-500" /> Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                  <div>
                    <p className="font-medium">bKash Transaction</p>
                    <p className="text-sm text-zinc-500">{format(new Date(latestPayment.createdAt), 'MMM d, yyyy h:mm a')}</p>
                    {latestPayment.bkashTrxId && (
                      <p className="text-xs font-mono mt-1 text-zinc-400">TrxID: {latestPayment.bkashTrxId}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">৳{latestPayment.amount}</p>
                    {latestPayment.status === 'SUCCESS' ? (
                      <Badge className="bg-emerald-500">Paid</Badge>
                    ) : (
                      <Badge variant="outline">{latestPayment.status}</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center">
                <CreditCard className="mr-2 h-5 w-5 text-zinc-500" /> Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Rent Type</span>
                <span className="font-medium">{booking.rentType.replace('_', ' ')}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-zinc-900 font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">৳{booking.amount}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-3">
              {booking.status === 'PENDING' && (
                <>
                  <Button 
                    className="w-full bg-[#E2136E] hover:bg-[#b00f56] text-white" 
                    onClick={handlePayment}
                    disabled={paymentMutation.isPending}
                  >
                    {paymentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Pay with bKash
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    onClick={handleCancel}
                    disabled={cancelMutation.isPending}
                  >
                    {cancelMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Cancel Request
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
