import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { bookingService } from "./booking.service";
import httpStatus from "http-status";

const createBooking = catchAsync(async(req:Request, res:Response) => {
  const payload  = req.body;
  const userId = req.user?.userId!;
  console.log("payload", payload, "userId", userId);
  const result = await bookingService.createBooking(payload, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Booking created successfully",
    data: result,
  });
});

const getBookingById = catchAsync(async (req:Request, res:Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.userId!;

  const result = await bookingService.getBookingById(bookingId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking retrieved successfully",
    data: result,
  });
});

const getAllbooking = catchAsync(async (req:Request, res:Response) => {
  const userId = req.user?.userId!;
  const query = req.query;

  const result = await bookingService.getAllbooking(userId, query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All bookings retrieved successfully",
    data: result,
  });
});

const cancelBooking = catchAsync(async (req:Request, res:Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.userId!;

  const result = await bookingService.cancelBooking(bookingId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking cancelled successfully",
    data: result,
  });
});


const onGoingBooking = catchAsync(async (req:Request, res:Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.userId!;

  const result = await bookingService.onGoingBooking(bookingId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking marked as ongoing successfully",
    data: result,
  });
});

const completeBooking = catchAsync(async (req:Request, res:Response) => {
  const { bookingId } = req.params;
  const userId = req.user?.userId!;

  const result = await bookingService.completeBooking(bookingId as string, userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Booking marked as completed successfully",
    data: result,
  });
});
export const bookingController = {
  createBooking,
  getBookingById,
  getAllbooking,
  cancelBooking,
  onGoingBooking,
  completeBooking,
};
