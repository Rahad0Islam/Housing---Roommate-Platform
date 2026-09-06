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


const findAllUtilityBills = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.userId;
  const role = req.user?.role;

  const utilityBills = await utilityBillService.findAllUtilityBills(userId as string, role as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Utility bills retrieved successfully",
    data: utilityBills,
  });
});

const getUtilityBillById = catchAsync(async (req: Request, res: Response) => {
  const utilityBillId = req.params.id;
  const role = req.user?.role;
  const userId = req.user?.userId;
  const utilityBill = await utilityBillService.getUtilityBillById(utilityBillId as string, role as string, userId as string); ;

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Utility bill retrieved successfully",
    data: utilityBill,
  });
});

const getUtilityBillbyFlatId = catchAsync(async (req: Request, res: Response) => {
  const flatId = req.params.flatId;
  const userId = req.user?.userId;
  const utilityBills = await utilityBillService.getUtilityBillbyFlatId(flatId as string, userId as string);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Utility bills retrieved successfully",
    data: utilityBills,
  });
});


export const utilityBillController = {
  createUtilityBill,
  findAllUtilityBills,
  getUtilityBillById,
    getUtilityBillbyFlatId,
};