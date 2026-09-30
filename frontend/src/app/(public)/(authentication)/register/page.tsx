"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { useRegister } from "@/hooks/auth.hook";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleLogin from "@/components/modules/google-login/GoogleLogin";

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "TENANT",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    try {
      const response = await registerMutation.mutateAsync(data);
      if (response?.success) {
        // Redirect to a verification page or show a toast and go to login
        router.push("/verify-email");
      } else {
        setError(response?.message || "Failed to create account");
      }
    } catch (err: any) {
      setError(err?.response?._data?.message || "An error occurred during registration. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Join the platform to find a place or manage your space.
          </p>
        </div>

        <Card className="border-none shadow-xl shadow-zinc-200/50 dark:shadow-none">
          <CardHeader>
            <CardTitle>Sign up</CardTitle>
            <CardDescription>
              Fill in your details below to get started.
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
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setValue("role", "TENANT")}
                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                      selectedRole === "TENANT"
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    Tenant
                  </button>
                  <button
                    type="button"
                    onClick={() => setValue("role", "OWNER")}
                    className={`flex items-center justify-center rounded-lg border p-3 text-sm font-medium transition-colors ${
                      selectedRole === "OWNER"
                        ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-50 dark:bg-zinc-50 dark:text-zinc-900"
                        : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900"
                    }`}
                  >
                    Owner
                  </button>
                </div>
                {errors.role && (
                  <p className="text-xs text-red-500">{errors.role.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className={errors.password ? "border-red-500" : ""}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                disabled={isSubmitting || registerMutation.isPending}
              >
                {(isSubmitting || registerMutation.isPending) ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </form>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-zinc-500 dark:bg-zinc-950 dark:text-zinc-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <GoogleLogin />
            </div>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4 text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="ml-1 font-medium text-zinc-900 hover:underline dark:text-zinc-50"
            >
              Sign in
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}