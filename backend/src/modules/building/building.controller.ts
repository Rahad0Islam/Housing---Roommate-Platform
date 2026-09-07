import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { buildingService } from "./building.service";
import httpStatus from "http-status";
import { AppError } from "../../utils/appError";

const createBuilding = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId!;



  const result = await buildingService.createBuilding(
    req.body,
    userId,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Building created successfully",
    data: result,
  });
});


const getAllBuildings = catchAsync(async (req: Request, res: Response) => {

  const query = req.query ;
  const result = await buildingService.getAllBuildings(query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buildings retrieved successfully",
    data: result.data,
    meta: result.meta,
  });
});

const updateBuilding = catchAsync(async (req: Request, res: Response) => {
  const buildingId = req.params?.id as string;
  const userId = req.user?.userId!;

  if(!buildingId) {
    throw new AppError(httpStatus.BAD_REQUEST, "Building ID is required");
  }

  const payload = req.body;

  if (!payload) {
    throw new AppError(httpStatus.BAD_REQUEST, "Request body is required");
  }
  const result = await buildingService.updateBuilding(
    buildingId,
    req.body,
    userId,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building updated successfully",
    data: result,
  });
});

const deleteBuilding = catchAsync(async (req: Request, res: Response) => {
  const buildingId = req.params?.id as string;
  const userId = req.user?.userId!;
  const result = await buildingService.deleteBuilding(buildingId, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building deleted successfully",
    data: result,
  });
});

const getBuildingById = catchAsync(async (req: Request, res: Response) => {
  const buildingId = req.params?.id as string;
  const result = await buildingService.getBuildingById(buildingId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Building retrieved successfully",
    data: result,
  });
});


const getBuildingsByOwnerId = catchAsync(async (req: Request, res: Response) => {
  const ownerId = req.user?.userId!;
  const result = await buildingService.getBuildingByOwnerId(ownerId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Buildings retrieved successfully",
    data: result,
  });
});

export const buildingController = {
  createBuilding,
  getAllBuildings,
  updateBuilding,
  deleteBuilding,
  getBuildingById,
  getBuildingsByOwnerId
};