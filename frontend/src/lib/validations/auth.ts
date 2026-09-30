import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["TENANT", "OWNER"], { message: "Please select a role" }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  otp: z.string().min(6, { message: "OTP must be at least 6 characters" }),
});

export type VerifyEmailFormData = z.infer<typeof verifyEmailSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  otp: z.string().min(6, { message: "OTP must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

