import cookieParser from "cookie-parser";
import type { Application } from "express";
import express from "express";
import cors from "cors";
import config from "./config/config";
import { notFound } from "./middleware/notFound";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { AuthRoutes } from "./modules/auth/auth.route";

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

app.use(notFound);
app.use(globalErrorHandler);

export default app;
