import {Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { utilityBillController } from "./utilitybill.controller";

const router = Router();

router.post("/create-utility-bill",auth(UserRole.OWNER),
    
        utilityBillController.createUtilityBill);

export const UtilityBillRoutes = router;
