import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { utilityBillService } from "./utilitybill.service";
import { IutilityBill } from "./utilitybill.interface";
import { sendResponse } from "../../utils/sendResponse";

const createUtilityBill = catchAsync(async (req:Request, res:Response) => {
  const utilityBillData: IutilityBill = req.body;
  const userId = req.user?.userId ; 

  const utilityBill = await utilityBillService.createUtilityBill(utilityBillData, userId as string);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Utility bill created successfully",
    data: utilityBill,
  });
});

export const utilityBillController = {
  createUtilityBill,
};