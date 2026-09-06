import {Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { utilityBillController } from "./utilitybill.controller";

const router = Router();

router.post("/create-utility-bill",auth(UserRole.OWNER),
    
        utilityBillController.createUtilityBill);



router.get("/get-all-utility-bills",auth(UserRole.OWNER,UserRole.TENANT,UserRole.ADMIN),
        utilityBillController.findAllUtilityBills);

router.get("/get-utility-bill/:id",auth(UserRole.OWNER,UserRole.TENANT,UserRole.ADMIN),
        utilityBillController.getUtilityBillById);

router.get("/get-utility-bill-by-flat/:flatId",auth(UserRole.OWNER,UserRole.TENANT,UserRole.ADMIN),
        utilityBillController.getUtilityBillbyFlatId);


export const UtilityBillRoutes = router;
