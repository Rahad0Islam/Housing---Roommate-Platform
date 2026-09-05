import { z } from "zod";

const RentTypeEnum = z.enum(["SHORT_TERM", "LONG_TERM"]);

const createBookingZodSchema = z
  .object({
    roomId: z
      .string()
      .uuid("Invalid room ID"),

    rentType: RentTypeEnum,

    startDate: z.coerce.date(),

    endDate: z.coerce.date(),
  })
  .superRefine((data, ctx) => {
    // Start date must be before end date
    if (data.startDate >= data.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "End date must be after start date",
      });
    }

    // Calculate booking duration
    const days = Math.ceil(
      (data.endDate.getTime() - data.startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Short-term maximum 30 days
    if (data.rentType === "SHORT_TERM" && days > 30) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Short term booking cannot exceed 30 days",
      });
    }

    // Long-term minimum 90 days
    if (data.rentType === "LONG_TERM" && days < 90) {
      ctx.addIssue({
        code: "custom",
        path: ["endDate"],
        message: "Long term booking must be at least 90 days",
      });
    }
  });

export const bookingValidation = {
  createBookingZodSchema,
};