import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AppError } from "../../utils/appError";
import { flatService } from "./flat.service";

const createFlat= catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;
  const payload = req.body;
  const buildingId = req.params.buildingId as string;

  if (!buildingId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Building ID is required");
  }

  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request body is required");
  }
  const result = await flatService.createFlat(
    payload,
    buildingId,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Flat created successfully",
    data: result,
  });
});


const updateFlat = catchAsync(async (req: Request, res: Response) => {
  const flatId = req.params.flatId as string;
  const userId = req.user?.userId!;
  const payload = req.body;

  if (!flatId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Flat ID is required");
  }

  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request body is required");
  }

  const result = await flatService.updateFlat(
    flatId,
    payload,
    userId
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat updated successfully",
    data: result,
  });
});


const getFlatByBuildingId = catchAsync(async (req: Request, res: Response) => {
  const buildingId = req.params.buildingId as string;

  if (!buildingId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Building ID is required");
  }

  const result = await flatService.getFlatByBuildingId(buildingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flats retrieved successfully",
    data: result,
  });
});

const getFlatById = catchAsync(async (req: Request, res: Response) => {
  const flatId = req.params.flatId as string;

  if (!flatId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Flat ID is required");
  }

  const result = await flatService.getFlatById(flatId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat retrieved successfully",
    data: result,
  });
});

const deleteFlat = catchAsync(async (req: Request, res: Response) => {
  const flatId = req.params.flatId as string;
  const userId = req.user?.userId!;
  const result = await flatService.deleteFlat(flatId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Flat deleted successfully",
    data: result,
  });
});


export const flatController = {
  createFlat,
  updateFlat,
  getFlatByBuildingId,
  getFlatById,
  deleteFlat,
};
