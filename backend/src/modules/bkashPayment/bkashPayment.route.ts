import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { bkashPaymentController } from "./bkashPayment.controller";



const router = Router();

router.post("/create-payment",
    auth(UserRole.TENANT),
    bkashPaymentController.createBkashPayment
);

router.get("/booking_payment/callback",
    bkashPaymentController.bkashCallback
);

router.post("/create-monthly-payment",
    auth(UserRole.TENANT),
    bkashPaymentController.monthlyBkashPayment
);

router.get("/monthly_payment/callback",
    bkashPaymentController.bkashMonthlyCallback
);
export const bkashPaymentRoutes = router;

