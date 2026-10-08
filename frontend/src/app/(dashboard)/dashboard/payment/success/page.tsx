"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2Icon, ArrowRightIcon } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type"); // "booking" or "monthly"

  const backLink = type === "monthly" ? "/dashboard/monthly-bills" : "/dashboard/bookings";
  const backText = type === "monthly" ? "Go to Monthly Bills" : "Go to Bookings";

  return (
    <Card className="w-full max-w-md shadow-xl border-t-8 border-t-green-500">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle2Icon className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Payment Successful!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="text-muted-foreground">
          <p>Your bKash payment has been processed successfully.</p>
          {id && (
            <p className="mt-2 text-sm">
              Transaction Ref: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">{id}</span>
            </p>
          )}
        </div>
        <div className="pt-4">
          <Link href={backLink} passHref>
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              {backText} <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
