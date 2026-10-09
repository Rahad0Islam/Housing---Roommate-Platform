"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordZodSchema } from "@/app/validation/auth.validation";
import { z } from "zod";
import { useResetPassword } from "@/hooks/auth.hook";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
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

type ResetPasswordFormValues = z.infer<typeof resetPasswordZodSchema>;

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const { mutate: resetPassword, isPending } = useResetPassword();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordZodSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
      newPassword: "",
    },
  });

  useEffect(() => {
    if (emailParam && !form.getValues("email")) {
      form.setValue("email", emailParam);
    }
  }, [emailParam, form]);

  function onSubmit(data: ResetPasswordFormValues) {
    resetPassword(data, {
      onSuccess: () => {
        toast.success("Password reset successfully", {
          description: "You can now log in with your new password.",
        });
        router.push("/login");
      },
      onError: (error: any) => {
        toast.error("Password reset failed", {
          description: error.message || "Invalid or expired OTP code.",
        });
      },
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-muted/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Set New Password
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter the 6-digit code sent to your email and your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center justify-center space-y-4">
                  <FormLabel className="self-start">OTP Code</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} disabled={isPending} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        disabled={isPending}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground hover:text-foreground"
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

            <Button
              className="w-full"
              type="submit"
              disabled={isPending || form.watch("otp").length !== 6}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <Link
            href="/forgot-password"
            className="font-medium text-primary hover:underline"
          >
            Try again
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
