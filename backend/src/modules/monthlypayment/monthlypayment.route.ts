import {Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { monthlyPaymentController } from "./monthlypayment.controller";

const router = Router();

router.post("/create-monthly-bill",auth(UserRole.OWNER),
       
     monthlyPaymentController.createMonthlyPayments
    
     );

router.get("/get-all-monthly-bills",auth(UserRole.OWNER,UserRole.TENANT,UserRole.ADMIN),
        monthlyPaymentController.getAllMonthlyPayments);

router.get("/get-monthly-bill/:id",auth(UserRole.OWNER,UserRole.TENANT,UserRole.ADMIN),
        monthlyPaymentController.getMonthlyPaymentById);
export const MonthlyPaymentRoutes = router;
