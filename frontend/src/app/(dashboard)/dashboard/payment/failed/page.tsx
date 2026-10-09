"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircleIcon, ArrowLeftIcon } from "lucide-react";

function FailedContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type"); // "booking" or "monthly"

  const backLink =
    type === "monthly" ? "/dashboard/monthly-bills" : "/dashboard/bookings";
  const backText =
    type === "monthly" ? "Back to Monthly Bills" : "Back to Bookings";

  return (
    <Card className="w-full max-w-md border-t-4 border-t-red-500 shadow-2xl shadow-red-500/10">
      <CardHeader className="text-center pb-2">
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-red-500/10 p-3">
            <XCircleIcon className="h-12 w-12 text-red-600" />
          </div>
        </div>
        <CardTitle className="font-heading text-2xl font-bold">
          Payment Failed
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="text-muted-foreground">
          <p>
            Unfortunately, your bKash payment could not be processed or was
            cancelled.
          </p>
          {id && (
            <p className="mt-2 text-sm">
              Transaction Ref:{" "}
              <span className="font-mono bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                {id}
              </span>
            </p>
          )}
        </div>
        <div className="pt-4">
          <Link href={backLink} passHref>
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <ArrowLeftIcon className="mr-2 h-4 w-4" /> {backText}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="gradient-mesh flex min-h-[70vh] items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <FailedContent />
      </Suspense>
    </div>
  );
}
