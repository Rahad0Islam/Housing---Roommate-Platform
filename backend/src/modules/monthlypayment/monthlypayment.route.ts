import {Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { monthlyPaymentController } from "./monthlypayment.controller";

const router = Router();

router.post("/create-monthly-bill",auth(UserRole.OWNER),
       
     monthlyPaymentController.createMonthlyPayments
    
     );

export const MonthlyPaymentRoutes = router;
