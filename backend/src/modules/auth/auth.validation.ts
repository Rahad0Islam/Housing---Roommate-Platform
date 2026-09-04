import z from "zod";

const userRegisterationZodSchema = z.object({
	name: z.string("string is required"),
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		),
	patient: z
		.object({
			contactNumber: z.string().optional(),
		})
		.optional(),
});

const loginUserZodSchema = z.object({
	email: z.string().email("Invalid email format"),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
			"Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
		),
});

const resetPasswordZodSchema = z.object({
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

const verifyEmailZodSchema = z.object({
	email: z.string().email("Invalid email format"),
	otp: z.string().length(6, "OTP must be 6 characters long"),
});
export const authValidation = {
	userRegisterationZodSchema,
	loginUserZodSchema,
	resetPasswordZodSchema,
	verifyEmailZodSchema,
};
