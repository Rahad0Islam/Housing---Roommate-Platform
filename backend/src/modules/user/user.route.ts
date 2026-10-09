import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { upload } from "../../lib/multer";
import { UserController } from "./user.controller";

const router = Router();

router.get(
  "/",
  auth(UserRole.ADMIN),
  UserController.getAllUsers
);

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

router.patch(
  "/block-user/:userId",
  auth(UserRole.ADMIN),
  UserController.blockUser
);

router.patch(
  "/active-user/:userId",
  auth(UserRole.ADMIN),
  UserController.activeUser
);

router.patch(
  "/me",
  auth(UserRole.OWNER, UserRole.ADMIN, UserRole.TENANT),
  UserController.updateProfile
);

export const UserRoutes = router;
