import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { ImonthlyPayment } from "./monthlypayment.interface";
import { monthlyPaymentService } from "./monthlypayment.service";

const createMonthlyPayments = catchAsync(async (req: Request, res: Response) => {
  const monthlyPaymentData: ImonthlyPayment = req.body;
  const userId = req.user?.userId;

  const monthlyPayment = await monthlyPaymentService.createMonthlyPayment(monthlyPaymentData, userId as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Monthly payment created successfully",
    data: monthlyPayment,
  });
});

const getMonthlyPaymentById = catchAsync(async (req: Request, res: Response) => {
  const monthlyPaymentId = req.params.id;
  const role = req.user?.role;
  const userId = req.user?.userId;

  const monthlyPayment = await monthlyPaymentService.getMonthlyPaymentById(monthlyPaymentId as string, role as string, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Monthly payment retrieved successfully",
    data: monthlyPayment,
  });
});

const getAllMonthlyPayments = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  const monthlyPayments = await monthlyPaymentService.getAllMonthlyPayments(userId as string, role as string,req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Monthly payments retrieved successfully",
    data: monthlyPayments,
  });
}); 

export const monthlyPaymentController = {
  createMonthlyPayments,
    getMonthlyPaymentById,
    getAllMonthlyPayments,
};