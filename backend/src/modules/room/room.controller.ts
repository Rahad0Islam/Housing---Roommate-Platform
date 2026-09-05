import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { roomService } from "./room.service";
import httpStatus from "http-status";

const createRoom = catchAsync(async (req:Request, res:Response) => {
  const flatId = req.params.flatId as string;

  const result = await roomService.createRoom(
    flatId,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Room created successfully",
    data: result,
  });
});


const updateRoom = catchAsync(async (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;

  const result = await roomService.updateRoom(
    roomId,
    req.body,
    req.file
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room updated successfully",
    data: result,
  });
});

const getRoomById = catchAsync(async (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;

  const result = await roomService.getRoomById(roomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room retrieved successfully",
    data: result,
  });
});

const getRoomsByFlatId = catchAsync(async (req: Request, res: Response) => {
  const flatId = req.params.flatId as string;

  const result = await roomService.getRoomsByFlatId(flatId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Rooms retrieved successfully",
    data: result,
  });
});

const deleteRoom = catchAsync(async (req: Request, res: Response) => {
  const roomId = req.params.roomId as string;

  await roomService.deleteRoom(roomId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Room deleted successfully",
    data: null,
  });
});


export const roomController = {
  createRoom,
  updateRoom,
  getRoomById,
  getRoomsByFlatId,
  deleteRoom,
};