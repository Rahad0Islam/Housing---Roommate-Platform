"use client";

import React, { useEffect } from "react";
import { format } from "date-fns";
import { Loader2, Receipt, Calendar, CreditCard, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { useMonthlyBills } from "@/hooks/rent.hook";
import { useCreateBkashMonthlyPayment } from "@/hooks/bkash.hook";

export default function TenantRentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: response, isLoading, isError, refetch } = useMonthlyBills();
  const paymentMutation = useCreateBkashMonthlyPayment();
  
  const bills = response?.data?.data || response?.data || [];

  useEffect(() => {
    const status = searchParams.get('status');
    if (status === 'success') {
      toast.success("Rent payment successful!");
      router.replace('/dashboard/tenant/rent');
      refetch();
    } else if (status === 'cancelled') {
      toast.error("Rent payment was cancelled or failed.");
      router.replace('/dashboard/tenant/rent');
      refetch();
    }
  }, [searchParams, router, refetch]);

  const handlePayment = async (billId: string) => {
    try {
      const res = await paymentMutation.mutateAsync({
        monthlyPayId: billId,
        paymentType: "MONTHLY_RENT"
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
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1"/> Pending</Badge>;
      case 'PAID':
        return <Badge className="bg-emerald-500"><CheckCircle className="w-3 h-3 mr-1"/> Paid</Badge>;
      case 'OVERDUE':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><AlertCircle className="w-3 h-3 mr-1"/> Overdue</Badge>;
      case 'WAIVED':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><XCircle className="w-3 h-3 mr-1"/> Waived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const currentMonthBill = bills.find((b: any) => b.status === 'PENDING' || b.status === 'OVERDUE');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Monthly Rent
        </h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          View and pay your monthly rent and utility bills.
        </p>
      </div>

      {currentMonthBill && (
        <Card className="border-red-100 bg-red-50/50 dark:border-red-900/30 dark:bg-red-950/10">
          <CardHeader>
            <CardTitle className="text-red-700 dark:text-red-400 flex items-center">
              <AlertCircle className="mr-2 h-5 w-5" /> Payment Required
            </CardTitle>
            <CardDescription className="text-red-600/80 dark:text-red-400/80">
              You have a pending bill for {format(new Date(currentMonthBill.billingMonth), 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600/80">Total Amount Due</p>
                <p className="text-3xl font-bold text-red-700 dark:text-red-400">৳{currentMonthBill.amount}</p>
              </div>
              <Button 
                className="bg-[#E2136E] hover:bg-[#b00f56] text-white" 
                onClick={() => handlePayment(currentMonthBill.id)}
                disabled={paymentMutation.isPending}
              >
                {paymentMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center">
            <Receipt className="mr-2 h-5 w-5 text-zinc-500" /> Billing History
          </CardTitle>
          <CardDescription>All your previous and current monthly bills.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-50 dark:bg-zinc-900/50">
              <TableRow>
                <TableHead className="pl-6">Billing Month</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-zinc-400" />
                    <p className="text-sm text-zinc-500 mt-2">Loading bills...</p>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-red-500">
                    Failed to load billing history.
                  </TableCell>
                </TableRow>
              ) : bills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <Receipt className="h-10 w-10 mx-auto text-zinc-300 mb-3" />
                    <p className="text-zinc-500">No billing history found.</p>
                  </TableCell>
                </TableRow>
              ) : (
                bills.map((bill: any) => (
                  <TableRow key={bill.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                    <TableCell className="pl-6 font-medium">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-zinc-400" />
                        {format(new Date(bill.billingMonth), 'MMMM yyyy')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {bill.room?.name || 'Unknown Room'}
                    </TableCell>
                    <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                      ৳{bill.amount}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(bill.status)}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      {(bill.status === 'PENDING' || bill.status === 'OVERDUE') ? (
                        <Button 
                          size="sm" 
                          className="bg-[#E2136E] hover:bg-[#b00f56] text-white"
                          onClick={() => handlePayment(bill.id)}
                          disabled={paymentMutation.isPending}
                        >
                          Pay
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          Receipt
                        </Button>
                      )}
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
