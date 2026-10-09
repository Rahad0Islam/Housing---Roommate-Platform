"use client";

import React, { useState } from "react";
import { useMonthlyPayments } from "@/hooks/monthlyPayment.hook";
import { useCreateBkashMonthlyPayment } from "@/hooks/bkashPayment.hook";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReceiptIcon, CreditCardIcon } from "lucide-react";

export default function TenantMonthlyBillsPage() {
  const { data: paymentsRes, isLoading } = useMonthlyPayments();
  const payments = paymentsRes?.data || [];

  const { mutateAsync: createBkashPayment, isPending: isPaying } =
    useCreateBkashMonthlyPayment();
  const [payingId, setPayingId] = useState<string | null>(null);

  const handlePayment = async (monthlyPayId: string) => {
    setPayingId(monthlyPayId);
    try {
      const res = await createBkashPayment({
        monthlyPayId,
        paymentType: "MONTHLY_RENT",
      });

      if (res?.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl;
      }
    } catch (error) {
      console.error("Payment initialization failed", error);
    } finally {
      setPayingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case "UNPAID":
      case "PENDING":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">Pending</Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="gradient-mesh motion-rise space-y-8">
      <div className="rounded-3xl border border-primary/15 bg-primary/[0.06] p-6">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Stay on top of payments
          </p>
          <h2 className="font-heading text-3xl font-bold tracking-tight">
            My Monthly Bills
          </h2>
          <p className="mt-2 text-muted-foreground">
            View and pay your monthly rent and utility bills.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center">
              <ReceiptIcon className="w-12 h-12 text-muted-foreground opacity-30 mb-4" />
              <h3 className="text-lg font-semibold">No bills found</h3>
              <p className="text-muted-foreground">
                You do not have any monthly bills yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Room</TableHead>
                    <TableHead>Billing Month</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payments.map((payment: any) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="font-medium">
                          Room {payment.room?.roomNumber || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {payment.billingMonth
                            ? format(
                                new Date(payment.billingMonth),
                                "MMMM yyyy",
                              )
                            : "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-primary">
                        ৳{payment.amount}
                      </TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell className="text-right">
                        {payment.status === "UNPAID" ||
                        payment.status === "PENDING" ? (
                          <Button
                            onClick={() => handlePayment(payment.id)}
                            disabled={isPaying && payingId === payment.id}
                            size="sm"
                            className="bg-[#e2136e] hover:bg-[#b50f58] text-white"
                          >
                            <CreditCardIcon className="w-4 h-4 mr-2" />
                            {isPaying && payingId === payment.id
                              ? "Redirecting..."
                              : "Pay with bKash"}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Paid
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
