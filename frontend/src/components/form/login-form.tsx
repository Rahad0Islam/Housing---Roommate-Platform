"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserZodSchema } from "@/app/validation/auth.validation";
import { z } from "zod";
import { useLogin } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ShieldCheck, UserRound } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GoogleAuth } from "../google-auth";

type LoginFormValues = z.infer<typeof loginUserZodSchema>;

const demoAccounts = [
  { role: "Admin", email: "admin@gmail.com" },
  { role: "Owner", email: "owner@gmail.com" },
  { role: "Tenant", email: "tenant@gmail.com" },
] as const;

export function LoginForm({ redirectPath = "/dashboard" }: { redirectPath?: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [demoRole, setDemoRole] = useState<string | null>(null);
  const router = useRouter();
  const { mutate: loginUser, isPending } = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginUserZodSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: LoginFormValues) {
    setDemoRole(null);
    loginUser(data, {
      onSuccess: () => {
        toast.success("Login successful");
        router.push(redirectPath);
      },
      onError: (error: any) => {
        const errMessage = error?.data?.message || error?.response?.data?.message || error?.response?._data?.message || error?.message || "";
        if (errMessage.toLowerCase().includes("verified")) {
          toast.error("Email not verified", {
            description: "Please verify your email before logging in.",
          });
          router.push(
            `/verify-account?email=${encodeURIComponent(data.email)}`,
          );
        } else {
          toast.error("Login failed", {
            description: errMessage || "Invalid email or password.",
          });
        }
      },
    });
  }

  return (
    <Card className="w-full border-white/20 bg-slate-950/55 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-white/70">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 rounded-2xl border border-white/15 bg-white/[0.06] p-3">
          <div className="mb-3 flex items-center gap-2 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/65">
            <ShieldCheck className="h-4 w-4 text-emerald-300" />
            Demo access
          </div>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((account) => (
              <Button
                key={account.role}
                type="button"
                variant="ghost"
                className="h-auto flex-col gap-1 rounded-xl border border-white/10 bg-white/[0.05] px-2 py-2.5 text-white/80 hover:bg-white/15 hover:text-white"
                onClick={() => {
                  setDemoRole(account.role);
                  onSubmit({ email: account.email, password: "Rahad@999" });
                }}
                disabled={isPending}
              >
                {isPending && demoRole === account.role ? (
                  <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                ) : (
                  <UserRound className="h-4 w-4 text-emerald-300" />
                )}
                <span className="text-xs">
                  {isPending && demoRole === account.role
                    ? "Signing in..."
                    : account.role}
                </span>
              </Button>
            ))}
          </div>
          <p className="mt-2 text-center text-[11px] text-white/45">
            Select a role to sign in with demo credentials
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      className="border-white/20 bg-white/[0.08] text-white placeholder:text-white/50 shadow-inner shadow-black/10"
                      type="email"
                      placeholder="john@example.com"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-xs font-medium text-primary hover:underline"
                      tabIndex={-1}
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="border-white/20 bg-white/[0.08] text-white placeholder:text-white/50 shadow-inner shadow-black/10"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-white/70 hover:bg-white/10 hover:text-white"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full mt-6" type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-950/55 px-2 text-white/65 backdrop-blur-md">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleAuth redirectPath={redirectPath} />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-4">
        <div className="text-sm text-white/70">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
