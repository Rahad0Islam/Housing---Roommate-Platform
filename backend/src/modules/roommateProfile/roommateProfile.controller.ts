import { Request, Response } from "express";
import httpStatus from "http-status";

import { RoommateProfileService } from "./roommateProfile.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result =
      await RoommateProfileService.createRoommateProfile(
        req.body,
        userId as string
      );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Roommate profile created successfully",
      data: result,
    });
  }
);

const getMyRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result =
      await RoommateProfileService.getMyRoommateProfile(
        userId as string
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Roommate profile retrieved successfully",
      data: result,
    });
  }
);

const updateRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    const result =
      await RoommateProfileService.updateRoommateProfile(
        req.body,
        userId as string
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Roommate profile updated successfully",
      data: result,
    });
  }
);

const deleteRoommateProfile = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    await RoommateProfileService.deleteRoommateProfile(
      userId as string
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Roommate profile deleted successfully",
      data: null,
    });
  }
);


const findAllRoommateProfiles = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await RoommateProfileService.findAllRoommateProfiles();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Roommate profiles retrieved successfully",
      data: result,
    });
  }
);

const findRoommateProfileById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await RoommateProfileService.findRoommateProfileById(
        req.params.id as string
       );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Roommate profile retrieved successfully",
      data: result,
    });
  }
);

export const RoommateProfileController = {
  createRoommateProfile,
  getMyRoommateProfile,
  updateRoommateProfile,
  deleteRoommateProfile,
  findAllRoommateProfiles,
  findRoommateProfileById,
};