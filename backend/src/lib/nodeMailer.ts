import nodeMailer from "nodemailer";
import config from "../config/config";

export const transporter = nodeMailer.createTransport({
	service: "gmail",
	auth: {
		user: config.smtp_user,
		pass: config.smtp_password,
	},
});
