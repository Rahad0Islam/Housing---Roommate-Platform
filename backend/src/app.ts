import cookieParser from "cookie-parser";
import type { Application } from "express";
import express from "express";
import cors from "cors";
import config from "./config/config";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { AuthRoutes } from "./modules/auth/auth.route";
import { BuildingRoutes } from "./modules/building/building.route";
import { FlatRoutes } from "./modules/flat/flat.route";
import { RoomRoutes } from "./modules/room/room.route";
import { BookingRoutes } from "./modules/booking/booking.route";
import { bkashPaymentRoutes } from "./modules/bkashPayment/bkashPayment.route";
import { UtilityBillRoutes } from "./modules/utilitybill/utilitybill.route";
import { MonthlyPaymentRoutes } from "./modules/monthlypayment/monthlypayment.route";
import { AmenityRoutes } from "./modules/amenity/amenity.route";

const app: Application = express();
app.use(
	cors({
		origin: config.app_url,
		credentials: true,
	}),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
	res.send("house and roommate platform service is running");
});
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/buildings",BuildingRoutes);
app.use("/api/v1/flats",FlatRoutes);
app.use("/api/v1/rooms", RoomRoutes);
app.use("/api/v1/bookings", BookingRoutes);
app.use("/api/v1/bkash-payment", bkashPaymentRoutes);
app.use("/api/v1/utility-bills", UtilityBillRoutes);
app.use("/api/v1/monthly-payments", MonthlyPaymentRoutes);
app.use("/api/v1/amenities", AmenityRoutes);
	

app.use(notFound);
app.use(globalErrorHandler);

export default app;
