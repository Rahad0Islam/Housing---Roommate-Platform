"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useVerifyAccount } from "@/hooks/auth.hook";
import { verifyEmailSchema, VerifyEmailFormData } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  const router = useRouter();
  const verifyMutation = useVerifyAccount();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyEmailFormData>({
    resolver: zodResolver(verifyEmailSchema),
  });

  const onSubmit = async (data: VerifyEmailFormData) => {
    setError(null);
    try {
      const response = await verifyMutation.mutateAsync(data);
      if (response?.success) {
        router.push("/dashboard"); 
      } else {
        setError(response?.message || "Invalid verification code");
      }
    } catch (err: any) {
      setError(err?.response?._data?.message || "An error occurred during verification. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Verify your email
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter the OTP sent to your email to verify your account.
          </p>
        </div>

        <Card className="border-none shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <CardHeader>
            <CardTitle>Verification</CardTitle>
            <CardDescription>
              Check your inbox for a 6-digit code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password (OTP)</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  {...register("otp")}
                  className={errors.otp ? "border-red-500 tracking-widest text-center text-lg" : "tracking-widest text-center text-lg"}
                  maxLength={6}
                />
                {errors.otp && (
                  <p className="text-xs text-red-500 text-center">{errors.otp.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                disabled={isSubmitting || verifyMutation.isPending}
              >
                {(isSubmitting || verifyMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
