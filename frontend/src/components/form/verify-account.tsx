"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailZodSchema } from "@/app/validation/auth.validation";
import { z } from "zod";
import { useVerifyAccount } from "@/hooks/auth.hook";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type VerifyAccountFormValues = z.infer<typeof verifyEmailZodSchema>;

export function VerifyAccountForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "";

  const { mutate: verifyAccount, isPending } = useVerifyAccount();

  const form = useForm<VerifyAccountFormValues>({
    resolver: zodResolver(verifyEmailZodSchema),
    defaultValues: {
      email: emailParam,
      otp: "",
    },
  });

  // Automatically update form if email param is ready (though we set it in defaultValues above)
  useEffect(() => {
    if (emailParam && !form.getValues("email")) {
      form.setValue("email", emailParam);
    }
  }, [emailParam, form]);

  function onSubmit(data: VerifyAccountFormValues) {
    verifyAccount(data, {
      onSuccess: () => {
        toast.success("Email verified successfully", {
          description: "Your account is now active. Logging you in...",
        });
        // Backend verification actually returns tokens and sets cookies, so user is now logged in.
        // Redirect to dashboard/home
        router.push("/dashboard");
      },
      onError: (error: any) => {
        toast.error("Verification failed", {
          description: error.message || "Invalid or expired OTP code.",
        });
      },
    });
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-muted/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Verify your email
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          We've sent a 6-digit verification code to
          <br />
          <span className="font-medium text-foreground">
            {emailParam || "your email"}
          </span>
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
                  <FormLabel className="sr-only">One-Time Password</FormLabel>
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

            <Button
              className="w-full"
              type="submit"
              disabled={isPending || form.watch("otp").length !== 6}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify Account
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Register again
          </Link>
        </div>
        <div className="text-xs text-muted-foreground">
          Note: For security reasons, the code expires in 5 minutes.
        </div>
      </CardFooter>
    </Card>
  );
}
