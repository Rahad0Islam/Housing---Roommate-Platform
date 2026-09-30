"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useResetPassword } from "@/hooks/auth.hook";
import { resetPasswordSchema, ResetPasswordFormData } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetMutation = useResetPassword();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setValue("email", emailParam);
    }
  }, [searchParams, setValue]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await resetMutation.mutateAsync(data);
      if (response?.success) {
        setSuccess("Your password has been reset successfully.");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setError(response?.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err?.response?._data?.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Set new password
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Enter the OTP and your new password below.
          </p>
        </div>

        <Card className="border-none shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>
              Check your email for the 6-digit OTP.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 dark:bg-red-900/20">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-50 p-3 text-sm text-green-500 dark:bg-green-900/20">
                  {success}
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

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="••••••••"
                  {...register("newPassword")}
                  className={errors.newPassword ? "border-red-500" : ""}
                />
                {errors.newPassword && (
                  <p className="text-xs text-red-500">{errors.newPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                disabled={isSubmitting || resetMutation.isPending || !!success}
              >
                {(isSubmitting || resetMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 text-sm text-zinc-600 dark:text-zinc-400">
            <Link
              href="/login"
              className="font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Back to log in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
