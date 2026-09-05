import {Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { roomController } from "./room.controller";
import { upload } from "../../lib/multer";
import { roomValidation } from "./room.validation";

const router = Router();





router.post(
  "/:flatId",
  auth(UserRole.ADMIN, UserRole.OWNER),
  upload.single("roomImage"),
  validateRequestBody(roomValidation.createRoomZodSchema),
  roomController.createRoom
);

router.patch(
  "/:roomId",
  auth(UserRole.ADMIN, UserRole.OWNER),
  upload.single("roomImage"),
  validateRequestBody(roomValidation.updateRoomZodSchema),
  roomController.updateRoom
);

router.delete(
  "/:roomId",
  auth(UserRole.ADMIN, UserRole.OWNER),
  roomController.deleteRoom
);

router.get(
  "/:roomId",
  auth(UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT),
  roomController.getRoomById
);

router.get(
  "/flat/:flatId",
  auth(UserRole.ADMIN, UserRole.OWNER, UserRole.TENANT),
  roomController.getRoomsByFlatId
);
export const RoomRoutes = router;