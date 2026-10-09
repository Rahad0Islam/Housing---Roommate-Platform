"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginUserZodSchema } from "@/app/validation/auth.validation";
import { z } from "zod";
import { useLogin } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
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

export function LoginForm({ redirectPath = "/dashboard" }: { redirectPath?: string }) {
  const [showPassword, setShowPassword] = useState(false);
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
    <Card className="w-full max-w-md mx-auto shadow-lg border-muted/50 bg-background/60 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Enter your credentials to sign in to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            <span className="bg-background/60 px-2 text-muted-foreground backdrop-blur-xl">
              Or continue with
            </span>
          </div>
        </div>

        <GoogleAuth redirectPath={redirectPath} />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-4">
        <div className="text-sm text-muted-foreground">
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
