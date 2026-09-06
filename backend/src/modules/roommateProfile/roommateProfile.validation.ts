import { z } from "zod";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createRoommateProfileSchema = z
  .object({
    bio: z.string().max(1000).optional(),

    budgetMin: z.number().positive(),

    budgetMax: z.number().positive(),

    genderPreference: z
      .enum(["ANY", "MALE", "FEMALE"])
      .optional(),

    smokingAllowed: z.boolean().optional(),

    petsAllowed: z.boolean().optional(),

    cleanlinessLevel: z
      .enum(["LOW", "MEDIUM", "HIGH"])
      .optional(),

    noiseTolerance: z
      .enum(["LOW", "MEDIUM", "HIGH"])
      .optional(),

    sleepTime: z
      .string()
      .regex(timeRegex, "sleepTime must be in HH:mm format"),

    wakeTime: z
      .string()
      .regex(timeRegex, "wakeTime must be in HH:mm format"),
  })
  .refine(
    (data) => data.budgetMax >= data.budgetMin,
    {
      message:
        "budgetMax must be greater than or equal to budgetMin",
      path: ["budgetMax"],
    }
  );

export const updateRoommateProfileSchema = z.object({
  bio: z.string().max(1000).optional(),

  budgetMin: z.number().positive().optional(),

  budgetMax: z.number().positive().optional(),

  genderPreference: z
    .enum(["ANY", "MALE", "FEMALE"])
    .optional(),

  smokingAllowed: z.boolean().optional(),

  petsAllowed: z.boolean().optional(),

  cleanlinessLevel: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  noiseTolerance: z
    .enum(["LOW", "MEDIUM", "HIGH"])
    .optional(),

  sleepTime: z
    .string()
    .regex(timeRegex, "sleepTime must be in HH:mm format")
    .optional(),

  wakeTime: z
    .string()
    .regex(timeRegex, "wakeTime must be in HH:mm format")
    .optional(),
});