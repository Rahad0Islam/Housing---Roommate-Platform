import { z } from "zod";
import { FlatStatus } from "../../../generated/prisma/enums";

 const createFlatZodSchema = z.object({
  flatNumber: z
    .string()
    .trim()
    .min(1, "Flat number is required")
    .max(50, "Flat number must be less than 50 characters"),

  floorNumber: z.coerce
    .number()
    .int("Floor number must be an integer")
    .min(0, "Floor number cannot be negative"),

  bedrooms: z.coerce
    .number()
    .int("Bedrooms must be an integer")
    .min(0, "Bedrooms cannot be negative"),

  bathrooms: z.coerce
    .number()
    .int("Bathrooms must be an integer")
    .min(0, "Bathrooms cannot be negative"),

  balcony: z.coerce
    .number()
    .int("Balcony must be an integer")
    .min(0, "Balcony cannot be negative")
    .optional()
    .default(0),

  totalArea: z.coerce
    .number()
    .positive("Total area must be greater than 0"),

  status: z
    .enum([
      FlatStatus.AVAILABLE,
      FlatStatus.FULL,
      FlatStatus.MAINTENANCE,
      FlatStatus.INACTIVE
    ])
    .optional()
    .default(FlatStatus.AVAILABLE),
});

const updateFlatZodSchema = z.object({
  flatNumber: z
    .string()
    .trim()
    .min(1, "Flat number cannot be empty")
    .max(50, "Flat number must be less than 50 characters")
    .optional(),

  floorNumber: z.coerce
    .number()
    .int("Floor number must be an integer")
    .min(0, "Floor number cannot be negative")
    .optional(),

  bedrooms: z.coerce
    .number()
    .int("Bedrooms must be an integer")
    .min(0, "Bedrooms cannot be negative")
    .optional(),

  bathrooms: z.coerce
    .number()
    .int("Bathrooms must be an integer")
    .min(0, "Bathrooms cannot be negative")
    .optional(),

  balcony: z.coerce
    .number()
    .int("Balcony must be an integer")
    .min(0, "Balcony cannot be negative")
    .optional(),

  totalArea: z.coerce
    .number()
    .positive("Total area must be greater than 0")
    .optional(),

  status: z
    .enum([
      FlatStatus.AVAILABLE,
        FlatStatus.FULL,
      FlatStatus.MAINTENANCE,
        FlatStatus.INACTIVE
    ])
    .optional(),
});


export const flatValidation = {
  createFlatZodSchema,
  updateFlatZodSchema,
};