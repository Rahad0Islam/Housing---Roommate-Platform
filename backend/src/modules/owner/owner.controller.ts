import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { ownerService } from "./owner.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";


const applyAsOwner = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const file = req.file;

  const result = await ownerService.applyAsOwner(userId as string, file);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Owner application submitted successfully and waiting for admin approval",
    data: result,
  });
});

const rejectOwnerApplication = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  const userId = req.user?.userId;

  const result = await ownerService.rejectOwnerApplication(ownerId as string, userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Owner application rejected successfully",
    data: result,
  });
});


const getAllOwnerApplications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const result = await ownerService.getAllOwnerApplications(userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Owner applications retrieved successfully",
    data: result,
  });
});

const approveOwnerApplication = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.params.id;
  const userId = req.user?.userId;
  console.log("Owner ID:", ownerId);
  const result = await ownerService.approveOwnerApplication(ownerId as string, userId as string);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Owner application approved successfully",
    data: result,
  });
});

export const ownerController = {
  applyAsOwner,
  rejectOwnerApplication,
  getAllOwnerApplications,
  approveOwnerApplication,
};