import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { upload } from "../../lib/multer";
import { UserController } from "./user.controller";

const router = Router();

router.post(
  "/",
  auth(UserRole.OWNER, UserRole.ADMIN,UserRole.TENANT),
  upload.single("profileImage"),
  UserController.imageUpload
   
);

router.delete(
  "/delete-image",
  auth(UserRole.OWNER, UserRole.ADMIN,UserRole.TENANT),
  UserController.deleteUserImage
);

export const UserProfileImageRoutes = router;
