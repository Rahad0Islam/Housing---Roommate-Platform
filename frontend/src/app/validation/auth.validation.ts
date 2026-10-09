import z from "zod";

export const userRegistrationZodSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
});

export const loginUserZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const resetPasswordZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const verifyEmailZodSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 characters long"),
});

export const forgotPasswordZodSchema = z.object({
  email: z.string().email("Invalid email format"),
});
