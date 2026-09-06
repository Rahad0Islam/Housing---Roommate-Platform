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

export const monthlyPaymentController = {
  createMonthlyPayments,
};