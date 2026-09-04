// import bcrypt from "bcryptjs";
// import type { JwtPayload, SignOptions } from "jsonwebtoken";
// import {
// 	AuthProvider,
// 	UserRole,
// 	UserStatus,
// } from "../../../generated/prisma/enums";
// import { prisma } from "../../lib/prisma";
// import { jwtUtils } from "../../utils/jwt";
// import type {
// 	googleLoginPayload,
// 	IforgotPasswordPayload,
// 	ILoginUserPayload,
// 	IRegisterPatientPayload,
// 	IRequestUser,
// 	IResetPasswordPayload,
// 	IverifyEmailPayload,
// } from "./auth.interface";
// import { OAuth2Client, TokenPayload } from "google-auth-library";
// import { googleClient } from "../../lib/googleAuth";
// import crypto from "crypto";
// import { redisClient } from "../../lib/redis";
// import { transporter } from "../../lib/nodeMailer";
// import path from "path";
// import ejs from "ejs";
// import AppError from "../../utils/appError";
// import httpStatus from "http-status";
// import config from "../../config/config";

// const registerPatient = async (payload: IRegisterPatientPayload) => {
// 	const { name, password, patient: patientData } = payload;
// 	const email = payload.email.trim().toLowerCase();

// 	const isUserExists = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (isUserExists) {
// 		throw new Error("User with this email already exists");
// 	}

// 	const hashedPassword = await bcrypt.hash(password, 8);

// 	const expirationTimeInSeconds = 5 * 60; // 5 minutes

// 	const redisKey = `register-patient-otp:${email}`;
// 	const otp = crypto.randomInt(100000, 1000000).toString();

// 	await redisClient.set(redisKey, otp, {
// 		expiration: {
// 			type: "EX",
// 			value: expirationTimeInSeconds,
// 		},
// 	});

// 	const patientRegistrationKey = `register-patient-data:${email}`;

// 	const redisUserDataPayload = {
// 		name,
// 		email,
// 		password: hashedPassword,
// 		patient: patientData,
// 	};

// 	console.log({ redisUserDataPayload });

// 	await redisClient.set(
// 		patientRegistrationKey,
// 		JSON.stringify(redisUserDataPayload),
// 		{
// 			expiration: {
// 				type: "EX",
// 				value: expirationTimeInSeconds,
// 			},
// 		},
// 	);

// 	const templatePath = path.join(
// 		process.cwd(),
// 		"/src/app/templates/regestrationOtp.ejs",
// 	);

// 	const html = await ejs.renderFile(templatePath, {
// 		name,
// 		email,
// 		otp,
// 		expireIn: expirationTimeInSeconds / 60, // Convert seconds to minutes
// 	});
// 	await transporter.sendMail({
// 		from: config.email_sender,
// 		to: email,
// 		subject: "Email Verification OTP for Patient Registration",
// 		html: html,
// 		// text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
// 	});
// 	// const createdUser = await prisma.user.create({
// 	// 	data: {
// 	// 		name,
// 	// 		email,
// 	// 		password: hashedPassword,
// 	// 		role: Role.PATIENT,
// 	// 		status: UserStatus.ACTIVE,
// 	// 		emailVerified: false,
// 	// 		patient: {
// 	// 			create: { name, email,contactNumber: patientData?.contactNumber },
// 	// 		},
// 	// 	},
// 	// 	omit: { password: true },
// 	// 	include: { patient: true },
// 	// });

// 	// const { patient, ...user } = createdUser;
// 	// const jwtPayload = {
// 	// 	userId: user.id,
// 	// 	name: user.name,
// 	// 	email: user.email,
// 	// 	role: user.role,
// 	// };

// 	// const accessToken = jwtUtils.createToken(
// 	// 	jwtPayload,
// 	// 	config.jwt_access_secret,
// 	// 	config.jwt_access_expires_in as SignOptions,
// 	// );

// 	// const refreshToken = jwtUtils.createToken(
// 	// 	jwtPayload,
// 	// 	config.jwt_refresh_secret,
// 	// 	config.jwt_refresh_expires_in as SignOptions,
// 	// );

// 	// return {
// 	// 	user,
// 	// 	patient,
// 	// 	accessToken,
// 	// 	refreshToken,
// 	// };
// };

// const verifyPatientEmail = async (payload: IverifyEmailPayload) => {
// 	const { otp } = payload;
// 	const email = payload.email.trim().toLowerCase();

// 	const isUserExists = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (isUserExists?.emailVerified) {
// 		throw new Error("User email is already verified");
// 	}

// 	if (isUserExists?.isDeleted || isUserExists?.status === UserStatus.DELETED) {
// 		throw new Error("User is deleted");
// 	}

// 	const redisKey = `register-patient-otp:${email}`;
// 	const redisOtp = await redisClient.get(redisKey);

// 	if (redisOtp !== otp) {
// 		throw new Error("Invalid or expired OTP");
// 	}

// 	await redisClient.del(redisKey);
// 	const patientRegistrationKey = `register-patient-data:${email}`;
// 	const redisUserData = await redisClient.get(patientRegistrationKey);

// 	if (!redisUserData) {
// 		throw new Error("User registration data not found or expired");
// 	}

// 	console.log(`User registration data for ${email}: ${redisUserData}`); // Log the retrieved data for debugging
// 	await redisClient.del(patientRegistrationKey);
// 	const userData: IRegisterPatientPayload = JSON.parse(redisUserData);

// 	const createdUser = await prisma.user.create({
// 		data: {
// 			name: userData.name,
// 			email: userData.email,
// 			password: userData.password,
// 			role: Role.PATIENT,
// 			status: UserStatus.ACTIVE,
// 			emailVerified: true,
// 			patient: {
// 				create: {
// 					name: userData.name,
// 					email: userData.email,
// 					contactNumber: userData?.patient?.contactNumber,
// 				},
// 			},
// 		},
// 		omit: { password: true },
// 		include: { patient: true },
// 	});

// 	const { patient, ...user } = createdUser;
// 	const jwtPayload = {
// 		userId: user.id,
// 		name: user.name,
// 		email: user.email,
// 		role: user.role,
// 	};

// 	const accessToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_access_secret,
// 		config.jwt_access_expires_in as SignOptions,
// 	);

// 	const refreshToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_refresh_secret,
// 		config.jwt_refresh_expires_in as SignOptions,
// 	);

// 	const templatePath = path.join(
// 		process.cwd(),
// 		"/src/app/templates/patient-welcome.ejs",
// 	);

// 	const html = await ejs.renderFile(templatePath, {
// 		name: user.name,
// 	});
// 	await transporter.sendMail({
// 		from: config.email_sender,
// 		to: user.email,
// 		subject: "Welcome to Our Healthcare Platform",
// 		html: html,
// 	});
// 	return {
// 		user,
// 		patient,
// 		accessToken,
// 		refreshToken,
// 	};
// };
// const loginUser = async (payload: ILoginUserPayload) => {
// 	const { password } = payload;
// 	const email = payload.email.trim().toLowerCase();

// 	const user = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (!user) {
// 		throw new AppError(httpStatus.NOT_FOUND, "User not found");
// 	}

// 	if (user.status === UserStatus.BLOCKED) {
// 		throw new AppError(400, "User is blocked");
// 	}

// 	if (user.isDeleted || user.status === UserStatus.DELETED) {
// 		throw new AppError(400, "User is deleted");
// 	}

// 	const isPasswordMatched = await bcrypt.compare(
// 		password,
// 		user.password as string,
// 	);

// 	if (!isPasswordMatched) {
// 		throw new Error("Invalid credentials");
// 	}

// 	if (password === null && user.googleId !== null) {
// 		throw new Error(
// 			"user already has a google account, please login with google",
// 		);
// 	}

// 	const jwtPayload = {
// 		userId: user.id,
// 		name: user.name,
// 		email: user.email,
// 		role: user.role,
// 	};

// 	const accessToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_access_secret,
// 		config.jwt_access_expires_in as SignOptions,
// 	);

// 	const refreshToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_refresh_secret,
// 		config.jwt_refresh_expires_in as SignOptions,
// 	);

// 	return {
// 		accessToken,
// 		refreshToken,
// 	};
// };

// const getMe = async (user: IRequestUser) => {
// 	const isUserExists = await prisma.user.findUnique({
// 		where: {
// 			id: user.userId,
// 		},
// 		include: {
// 			patient: true,
// 		},
// 		omit: {
// 			password: true,
// 		},
// 	});

// 	if (!isUserExists) {
// 		throw new Error("User not found");
// 	}

// 	return isUserExists;
// };

// const refreshToken = async (token: string) => {
// 	const verifiedRefreshToken = jwtUtils.verifyToken(
// 		token,
// 		config.jwt_refresh_secret,
// 	);

// 	if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
// 		throw new Error(
// 			config.node_env === "development"
// 				? verifiedRefreshToken.error
// 				: "Invalid refresh token",
// 		);
// 	}

// 	const data = verifiedRefreshToken.data as JwtPayload;

// 	const user = await prisma.user.findUnique({
// 		where: { id: data.userId },
// 	});

// 	if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
// 		throw new Error("User is inactive or not found");
// 	}

// 	const jwtPayload = {
// 		userId: user.id,
// 		name: user.name,
// 		email: user.email,
// 		role: user.role,
// 	};

// 	const accessToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_access_secret,
// 		config.jwt_access_expires_in as SignOptions,
// 	);

// 	const refreshToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_refresh_secret,
// 		config.jwt_refresh_expires_in as SignOptions,
// 	);

// 	return {
// 		accessToken,
// 		refreshToken,
// 	};
// };

// const googleLogin = async (payload: googleLoginPayload) => {
// 	let googleIdTokenPayload: TokenPayload | undefined;
// 	try {
// 		const ticket = await googleClient.verifyIdToken({
// 			idToken: payload.idToken,
// 			audience: config.google_client_id,
// 		});

// 		googleIdTokenPayload = ticket.getPayload();
// 	} catch (error) {
// 		console.log("google id error ", error);

// 		throw new Error("invalid or expired google id token");
// 	}
// 	if (!googleIdTokenPayload) {
// 		throw new Error("invalid or expired google id token");
// 	}

// 	if (!googleIdTokenPayload.email) {
// 		throw new Error("Google account email is not verified");
// 	}

// 	if (!googleIdTokenPayload.name) {
// 		throw new Error("Google account name is not available");
// 	}

// 	const ifPatientExistWithGoogleAuth = await prisma.user.findUnique({
// 		where: {
// 			email: googleIdTokenPayload.email,
// 			role: Role.PATIENT,
// 			googleId: googleIdTokenPayload.sub,
// 		},
// 	});

// 	let user = ifPatientExistWithGoogleAuth;

// 	if (!ifPatientExistWithGoogleAuth) {
// 		const isUserExistsWithCredentials = await prisma.user.findUnique({
// 			where: {
// 				email: googleIdTokenPayload.email,
// 				role: Role.PATIENT,
// 				authProvider: AuthProvider.CREDENTIALS,
// 			},
// 		});

// 		if (isUserExistsWithCredentials) {
// 			if (isUserExistsWithCredentials.status === UserStatus.BLOCKED) {
// 				throw new Error("User is blocked");
// 			}
// 			if (
// 				isUserExistsWithCredentials.isDeleted ||
// 				isUserExistsWithCredentials.status === UserStatus.DELETED
// 			) {
// 				throw new Error("User is deleted");
// 			}

// 			if (!isUserExistsWithCredentials.emailVerified) {
// 				throw new Error("User email is not verified");
// 			}

// 			await prisma.user.update({
// 				where: {
// 					id: isUserExistsWithCredentials.id,
// 				},
// 				data: {
// 					googleId: googleIdTokenPayload.sub,
// 				},
// 			});
// 		} else {
// 			user = await prisma.user.create({
// 				data: {
// 					name: googleIdTokenPayload.name,
// 					email: googleIdTokenPayload.email,
// 					role: Role.PATIENT,
// 					googleId: googleIdTokenPayload.sub,
// 					authProvider: AuthProvider.GOOGLE,
// 					emailVerified: true,

// 					patient: {
// 						create: {
// 							name: googleIdTokenPayload.name,
// 							email: googleIdTokenPayload.email,
// 						},
// 					},
// 				},
// 			});

// 			const templatePath = path.join(
// 				process.cwd(),
// 				"/src/app/templates/patient-welcome.ejs",
// 			);

// 			const html = await ejs.renderFile(templatePath, {
// 				name: user.name,
// 			});
// 			await transporter.sendMail({
// 				from: config.email_sender,
// 				to: user.email,
// 				subject: "Welcome to Our Healthcare Platform",
// 				html: html,
// 			});
// 		}
// 	}

// 	if (!user) {
// 		throw new Error("User not found or created");
// 	}
// 	if (user?.status === UserStatus.BLOCKED) {
// 		throw new Error("User is blocked");
// 	}
// 	if (user.isDeleted || user.status === UserStatus.DELETED) {
// 		throw new Error("User is deleted");
// 	}

// 	const jwtPayload = {
// 		userId: user?.id,
// 		name: user?.name,
// 		email: user?.email,
// 		role: user?.role,
// 	};

// 	const accessToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_access_secret,
// 		config.jwt_access_expires_in as SignOptions,
// 	);

// 	const refreshToken = jwtUtils.createToken(
// 		jwtPayload,
// 		config.jwt_refresh_secret,
// 		config.jwt_refresh_expires_in as SignOptions,
// 	);

// 	return {
// 		accessToken,
// 		refreshToken,
// 	};
// };

// const forgotPassword = async (payload: IforgotPasswordPayload) => {
// 	const { email } = payload;

// 	const user = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (!user) {
// 		throw new Error("User not found");
// 	}
// 	if (!user.emailVerified) {
// 		throw new Error("User email is not verified");
// 	}
// 	if (user.status === UserStatus.BLOCKED) {
// 		throw new Error("User is blocked");
// 	}
// 	if (user.isDeleted || user.status === UserStatus.DELETED) {
// 		throw new Error("User is deleted");
// 	}

// 	if (user.googleId && user.authProvider !== AuthProvider.GOOGLE) {
// 		throw new Error("User is registered with Google, please login with Google");
// 	}

// 	const otp = crypto.randomInt(100000, 1000000).toString();
// 	console.log(`OTP for ${email}: ${otp}`); // Log the OTP to the console for testing purposes
// 	const redisKey = `forgot-password-otp:${email}`;

// 	await redisClient.set(redisKey, otp, {
// 		expiration: {
// 			type: "EX",
// 			value: 5 * 60, // 5 minutes
// 		},
// 	});

// 	const templatePath = path.join(
// 		process.cwd(),
// 		"/src/app/templates/forgot-password.ejs",
// 	);

// 	const html = await ejs.renderFile(templatePath, {
// 		otp,
// 		name: user.name,
// 		expireIn: "5",
// 	});
// 	await transporter.sendMail({
// 		from: config.email_sender,
// 		to: user.email,
// 		subject: "Password Reset OTP",
// 		html: html,
// 		// text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
// 	});
// };

// const resetPassword = async (payload: IResetPasswordPayload) => {
// 	const { email, newPassword, otp } = payload;

// 	const user = await prisma.user.findUnique({
// 		where: { email },
// 	});

// 	if (!user) {
// 		throw new Error("User not found");
// 	}
// 	if (!user.emailVerified) {
// 		throw new Error("User email is not verified");
// 	}
// 	if (user.status === UserStatus.BLOCKED) {
// 		throw new Error("User is blocked");
// 	}
// 	if (user.isDeleted || user.status === UserStatus.DELETED) {
// 		throw new Error("User is deleted");
// 	}

// 	if (user.googleId && user.authProvider !== AuthProvider.GOOGLE) {
// 		throw new Error("User is registered with Google, please login with Google");
// 	}

// 	const redisKey = `forgot-password-otp:${email}`;

// 	const redisOtp = await redisClient.get(redisKey);

// 	if (redisOtp !== otp) {
// 		throw new Error("Invalid or expired OTP");
// 	}

// 	const hashedPassword = await bcrypt.hash(
// 		newPassword,
// 		Number(config.bcrypt_salt_rounds),
// 	);

// 	await prisma.user.update({
// 		where: { email },
// 		data: { password: hashedPassword },
// 	});

// 	await redisClient.del(redisKey);

// 	const templatePath = path.join(
// 		process.cwd(),
// 		"/src/app/templates/reset-password.ejs",
// 	);

// 	const html = await ejs.renderFile(templatePath, {
// 		name: user.name,
// 	});
// 	await transporter.sendMail({
// 		from: config.email_sender,
// 		to: user.email,
// 		subject: "Password Reset Successfully",
// 		html: html,
// 		// text: `Your OTP for password reset is: ${otp}. It will expire in 5 minutes.`,
// 	});
// };
// export const AuthService = {
// 	registerPatient,
// 	loginUser,
// 	getMe,
// 	refreshToken,
// 	googleLogin,
// 	forgotPassword,
// 	resetPassword,
// 	verifyPatientEmail,
// };
