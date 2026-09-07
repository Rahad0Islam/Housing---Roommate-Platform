import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { upload } from "../../lib/multer";
import { bookingController } from "./booking.controller";
import { bookingValidation } from "./booking.validation";


const router = Router();

router.post("/",
     auth(UserRole.ADMIN, UserRole.TENANT),
     validateRequestBody(bookingValidation.createBookingZodSchema),
     bookingController.createBooking
    
    );

router.get("/:bookingId",
    auth(UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT),
    bookingController.getBookingById
);

router.get("/",
    auth(UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT),
    bookingController.getAllbooking
);

router.patch("/cancel/:bookingId",
    auth(UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT),
    bookingController.cancelBooking
);

router.patch("/ongoing/:bookingId",
    auth(UserRole.ADMIN, UserRole.OWNER),
    bookingController.onGoingBooking
);

router.patch("/complete/:bookingId",
    auth(UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT),
    bookingController.completeBooking
);
export const BookingRoutes = router;
