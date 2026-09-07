import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { analyticsQuerySchema } from "./analytics.validation";
import { analyticsService } from "./analytics.service";

const getQuery = (req: Request) => analyticsQuerySchema.parse(req.query);

const getAdminAnalytics = catchAsync(async (req: Request, res: Response) => {
	const result = await analyticsService.getAdminAnalytics(getQuery(req));
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Admin analytics retrieved successfully", data: result });
});

const getOwnerAnalytics = catchAsync(async (req: Request, res: Response) => {
	const result = await analyticsService.getOwnerAnalytics(req.user!.userId, getQuery(req));
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Owner analytics retrieved successfully", data: result });
});

const getTenantAnalytics = catchAsync(async (req: Request, res: Response) => {
	const result = await analyticsService.getTenantAnalytics(req.user!.userId, getQuery(req));
	sendResponse(res, { statusCode: httpStatus.OK, success: true, message: "Tenant analytics retrieved successfully", data: result });
});

export const analyticsController = { getAdminAnalytics, getOwnerAnalytics, getTenantAnalytics };
