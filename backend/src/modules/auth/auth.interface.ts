import type { UserRole } from "../../../generated/prisma/browser";

export interface ILoginUserPayload {
	email: string;
	password: string;
}

export interface IRegisterUserPayload {
	name: string;
	email: string;
	password: string;
}

export interface IRequestUser {
	userId?: string;
	email: string;
	name: string;
	role: UserRole;
}

export interface googleLoginPayload {
	idToken: string;
}

export interface IforgotPasswordPayload {
	email: string;
}

export interface IResetPasswordPayload {
	email: string;
	newPassword: string;
	otp: string;
}

export interface IverifyEmailPayload {
	email: string;
	otp: string;
}
