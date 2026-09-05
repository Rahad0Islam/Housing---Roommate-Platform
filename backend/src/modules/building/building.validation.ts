import { z } from "zod";

 const createBuildingZodSchema = z.object({
  name: z.string().min(1, "Building name is required"),

  address: z.string().min(1, "Address is required"),

  description: z.string().optional(),

  numberOfFloors: z.coerce
    .number()
    .int("Number of floors must be an integer")
    .positive("Number of floors must be positive"),

  city: z.string().min(1, "City is required"),
});




const updateBuildingZodSchema = z.object({
  name: z
    .string()
    .min(1, "Building name cannot be empty")
    .optional(),

  address: z
    .string()
    .min(1, "Address cannot be empty")
    .optional(),

  description: z
    .string()
    .optional(),

  numberOfFloors: z.coerce
    .number()
    .int("Number of floors must be an integer")
    .positive("Number of floors must be greater than 0")
    .optional(),

  city: z
    .string()
    .min(1, "City cannot be empty")
    .optional(),
});

export const buildingValidation = {
  createBuildingZodSchema,
  updateBuildingZodSchema,
};