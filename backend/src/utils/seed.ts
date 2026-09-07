import bcrypt from "bcryptjs";
import {
	AuthProvider,
	UserRole,
	UserStatus,
} from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

const seedUsers = async () => {
	const password = await bcrypt.hash("Rahad@999", 10);

	const users = [
		{
			name: "Admin",
			email: "admin@gmail.com",
			role: UserRole.ADMIN,
		},
		{
			name: "Owner",
			email: "owner@gmail.com",
			role: UserRole.OWNER,
		},
		{
			name: "Tenant",
			email: "tenant@gmail.com",
			role: UserRole.TENANT,
		},
	];

	for (const user of users) {
		await prisma.user.upsert({
			where: { email: user.email },
			update: {
				name: user.name,
				password,
				role: user.role,
				authProvider: AuthProvider.CREDENTIAL,
				emailVerified: true,
				userStatus: UserStatus.ACTIVE,
			},
			create: {
				name: user.name,
				email: user.email,
				password,
				role: user.role,
				authProvider: AuthProvider.CREDENTIAL,
				emailVerified: true,
				userStatus: UserStatus.ACTIVE,
			},
		});
	}

	console.log("Seed users created successfully.");
};

export default seedUsers;
