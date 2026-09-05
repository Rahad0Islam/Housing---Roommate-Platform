import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import bkashPaymentService from "./bkashPayment.service";
import httpStatus from "http-status";

const createBkashPayment = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;
  const userId = req.user?.userId!;
  const result = await bkashPaymentService.createBkashPayment(payload, userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Bkash payment created successfully",
    data: result,
  });
});

const bkashCallback = catchAsync(
	async (req: Request, res: Response) => {
	const bkashPaymentCallbackResponse = req.query;

    const callbackResult = await bkashPaymentService.bkashCallback(
      bkashPaymentCallbackResponse,
    );

    if (!callbackResult) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success: false,
            message: "Invalid callback response",
        });
    }

    if (!callbackResult.redirectUrl) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Redirect URL not found in the callback response", 
        })
    }

    const { redirectUrl } = callbackResult;
        
        
		res.redirect(redirectUrl);
		
	},
);


export const bkashPaymentController = {
  createBkashPayment,
  bkashCallback,
};