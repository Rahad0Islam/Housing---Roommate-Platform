import { z } from "zod";

const RoomTypeEnum = z.enum(["SINGLE", "SHARED", "MASTER"]);

const RoomStatusEnum = z.enum([
  "AVAILABLE",
  "FULL",
  "INACTIVE",
  "MAINTENANCE",
]);

const createRoomZodSchema = z.object({
  name: z.string().min(1, "Room name is required"),

  roomType: RoomTypeEnum,

  monthlyRent: z.coerce
    .number()
    .positive("Monthly rent must be positive"),

  dailyRent: z.coerce
    .number()
    .positive("Daily rent must be positive"),

  maxOccupants: z.coerce
    .number()
    .int("Maximum occupants must be an integer")
    .positive("Maximum occupants must be positive"),

  furnished: z.preprocess(
    (value) => value === "true" || value === true,
    z.boolean()
  ),

  availableFrom: z.coerce.date(),

  status: RoomStatusEnum.default("AVAILABLE"),
});

const updateRoomZodSchema = z.object({
  name: z.string().min(1, "Room name cannot be empty").optional(),

  roomType: RoomTypeEnum.optional(),

  monthlyRent: z.coerce
    .number()
    .positive("Monthly rent must be positive")
    .optional(),

  dailyRent: z.coerce
    .number()
    .positive("Daily rent must be positive")
    .optional(),

  maxOccupants: z.coerce
    .number()
    .int("Maximum occupants must be an integer")
    .positive("Maximum occupants must be positive")
    .optional(),

  furnished: z.preprocess(
    (value) => {
      if (value === undefined || value === "") return undefined;
      return value === "true" || value === true;
    },
    z.boolean().optional()
  ),

  availableFrom: z.coerce.date().optional(),

  status: RoomStatusEnum.optional(),
});

export const roomValidation = {
  createRoomZodSchema,
  updateRoomZodSchema,
};