import { prisma } from "../../lib/prisma";
import { IAnalyticsQuery } from "./analytics.interface";

const dateFilter = (query: IAnalyticsQuery) => {
	if (!query.from && !query.to) return {};

	return {
		createdAt: {
			...(query.from && { gte: query.from }),
			...(query.to && { lte: query.to }),
		},
	};
};

const amount = (value: unknown) => Number(value ?? 0);

const getAdminAnalytics = async (query: IAnalyticsQuery) => {
	const filter = dateFilter(query);
	const [
		users,
		owners,
		buildings,
		flats,
		rooms,
		bookings,
		bookingStatuses,
		payments,
		paymentTypes,
		monthlyPayments,
		utilityBills,
	] = await Promise.all([
		prisma.user.count({ where: filter }),
		prisma.owner.count({ where: filter }),
		prisma.building.count({ where: filter }),
		prisma.flat.count({ where: filter }),
		prisma.room.count({ where: filter }),
		prisma.booking.count({ where: filter }),
		prisma.booking.groupBy({ by: ["status"], _count: { _all: true }, where: filter }),
		prisma.payment.aggregate({ where: { ...filter, status: "SUCCESS" }, _sum: { amount: true }, _count: { _all: true } }),
		prisma.payment.groupBy({ by: ["paymentType"], _sum: { amount: true }, where: { ...filter, status: "SUCCESS" } }),
		prisma.monthlyPay.count({ where: filter }),
		prisma.utilityBill.count({ where: filter }),
	]);

	return {
		users,
		owners,
		buildings,
		flats,
		rooms,
		bookings,
		bookingStatuses,
		payments: { successfulCount: payments._count._all, successfulAmount: amount(payments._sum.amount) },
		paymentTypes: paymentTypes.map((item) => ({ paymentType: item.paymentType, amount: amount(item._sum.amount) })),
		monthlyPayments,
		utilityBills,
	};
};

const getOwnerAnalytics = async (ownerId: string, query: IAnalyticsQuery) => {
	const filter = dateFilter(query);
	const property = { building: { ownerId } };
	const roomProperty = { flat: property };
	const bookingProperty = { room: roomProperty };
	const monthlyPaymentProperty = { room: roomProperty };
	const paymentProperty = { OR: [{ booking: bookingProperty }, { monthlyPay: monthlyPaymentProperty }] };

	const [buildings, flats, rooms, availableRooms, bookings, bookingStatuses, payments, monthlyPayments, utilityBills] =
		await Promise.all([
			prisma.building.count({ where: { ownerId, ...filter } }),
			prisma.flat.count({ where: { ...property, ...filter } }),
			prisma.room.count({ where: { ...roomProperty, ...filter } }),
			prisma.room.count({ where: { ...roomProperty, status: "AVAILABLE", ...filter } }),
			prisma.booking.count({ where: { ...bookingProperty, ...filter } }),
			prisma.booking.groupBy({ by: ["status"], _count: { _all: true }, where: { ...bookingProperty, ...filter } }),
			prisma.payment.aggregate({ where: { ...paymentProperty, status: "SUCCESS", ...filter }, _sum: { amount: true }, _count: { _all: true } }),
			prisma.monthlyPay.count({ where: { ...monthlyPaymentProperty, ...filter } }),
			prisma.utilityBill.aggregate({ where: { ownerId, ...filter }, _sum: { totalBill: true }, _count: { _all: true } }),
		]);

	return {
		buildings,
		flats,
		rooms,
		availableRooms,
		occupiedRooms: rooms - availableRooms,
		bookings,
		bookingStatuses,
		payments: { successfulCount: payments._count._all, successfulAmount: amount(payments._sum.amount) },
		monthlyPayments,
		utilityBills: { count: utilityBills._count._all, totalAmount: amount(utilityBills._sum.totalBill) },
	};
};

const getTenantAnalytics = async (tenantId: string, query: IAnalyticsQuery) => {
	const filter = dateFilter(query);
	const [bookings, bookingStatuses, payments, monthlyPayments, monthlyPaymentStatuses, roommateProfile] =
		await Promise.all([
			prisma.booking.count({ where: { tenantId, ...filter } }),
			prisma.booking.groupBy({ by: ["status"], _count: { _all: true }, where: { tenantId, ...filter } }),
			prisma.payment.aggregate({ where: { tenantId, status: "SUCCESS", ...filter }, _sum: { amount: true }, _count: { _all: true } }),
			prisma.monthlyPay.count({ where: { tenantId, ...filter } }),
			prisma.monthlyPay.groupBy({ by: ["status"], _count: { _all: true }, where: { tenantId, ...filter } }),
			prisma.roommateProfile.count({ where: { userId: tenantId } }),
		]);

	return {
		bookings,
		bookingStatuses,
		payments: { successfulCount: payments._count._all, successfulAmount: amount(payments._sum.amount) },
		monthlyPayments,
		monthlyPaymentStatuses,
		hasRoommateProfile: roommateProfile > 0,
	};
};

export const analyticsService = {
	getAdminAnalytics,
	getOwnerAnalytics,
	getTenantAnalytics,
};
