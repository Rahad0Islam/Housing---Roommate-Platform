"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userRegistrationZodSchema } from "@/app/validation/auth.validation";
import { z } from "zod";
import { useRegister } from "@/hooks/auth.hook";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

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
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { GoogleAuth } from "../google-auth";

type RegisterFormValues = z.infer<typeof userRegistrationZodSchema>;

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { mutate: registerUser, isPending } = useRegister();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(userRegistrationZodSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  function onSubmit(data: RegisterFormValues) {
    registerUser(data, {
      onSuccess: () => {
        toast.success("Registration successful", {
          description: "Please check your email for the verification code.",
        });
        // Pass email to verify-account page via query params
        router.push(`/verify-account?email=${encodeURIComponent(data.email)}`);
      },
      onError: (error: any) => {
        let errMessage = "Something went wrong. Please try again.";
        if (typeof error?.data?.message === 'string') errMessage = error.data.message;
        else if (typeof error?.response?.data?.message === 'string') errMessage = error.response.data.message;
        else if (typeof error?.response?._data?.message === 'string') errMessage = error.response._data.message;
        else if (typeof error?.message === 'string') errMessage = error.message;

        // Map backend errors directly to the form fields
        if (errMessage.toLowerCase().includes("email") || errMessage.toLowerCase().includes("already exist")) {
          form.setError("email", {
            type: "manual",
            message: errMessage,
          });
        }

        toast.error("Registration failed", {
          description: errMessage,
        });
      },
    });
  }

  return (
    <Card className="w-full border-white/20 bg-slate-950/55 text-white shadow-2xl shadow-black/30 backdrop-blur-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-3xl font-bold tracking-tight">
          Create an account
        </CardTitle>
        <CardDescription className="text-white/70">
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      className="border-white/20 bg-white/[0.08] text-white placeholder:text-white/50 shadow-inner shadow-black/10"
                      placeholder="John Doe"
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
                  <FormLabel>Password</FormLabel>
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
              Create Account
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

        <GoogleAuth />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center space-y-4">
        <div className="text-sm text-white/70">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
