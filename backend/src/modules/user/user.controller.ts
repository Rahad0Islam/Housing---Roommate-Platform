import { Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";

const imageUpload = catchAsync(async (req: Request, res: Response) => {
	console.log("req.file", req.file);
	const userId = req.user?.userId;
	if (!req.file || !req.file.buffer) {
		throw new Error("No file uploaded");
	}
	const result = await UserService.uploadUserImage(
		req.file,
		userId as string,
	);
	sendResponse(res, {
		statusCode: httpStatus.OK,
		success: true,
		message: "Profile image uploaded successfully",
		data: result,
	});
});

const deleteUserImage = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    const result = await UserService.deleteUserImage(userId as string); 
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile image deleted successfully",
        data: result,
    });
});

export const UserController = {
	imageUpload,
	deleteUserImage,
};
