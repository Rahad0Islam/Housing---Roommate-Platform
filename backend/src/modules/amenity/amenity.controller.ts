import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { IAmenity } from "./amenity.interface";
import { amenityService } from "./amenity.service";

const createAminity = catchAsync(async (req: Request, res: Response) => {
  const amenityData: IAmenity = req.body;
  const userId = req.user?.userId;

  const amenity = await amenityService.createAmenity(amenityData, userId as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Amenity created successfully",
    data: amenity,
  });
});
const getAllAmenities = catchAsync(async (req: Request, res: Response) => {
  const amenities = await amenityService.getAllAmenities(req.params.buildingId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Amenities retrieved successfully",
    data: amenities,
  });
});
const getAmenityById = catchAsync(async (req: Request, res: Response) => {
  const amenityId = req.params.id;

  const amenity = await amenityService.getAmenityById(amenityId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Amenity retrieved successfully",
    data: amenity,
  });
});

const updateAmenity = catchAsync(async (req: Request, res: Response) => {
  const amenityId = req.params.id;
  const payload: Partial<IAmenity> = req.body;
  const userId = req.user?.userId;

  const updatedAmenity = await amenityService.updateAmenity(amenityId as string, payload, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Amenity updated successfully",
    data: updatedAmenity,
  });
});

const deleteAmenity = catchAsync(async (req: Request, res: Response) => {
  const amenityId = req.params.id;
  const userId = req.user?.userId;

  await amenityService.deleteAmenity(amenityId as string, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Amenity deleted successfully",
    data: null,
  });
});

export const amenityController = {
  createAminity,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
  getAllAmenities,
};  