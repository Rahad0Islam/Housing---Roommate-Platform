import { Router } from "express";

import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";

import { UserRole } from "../../../generated/prisma/client";

import { RoommateProfileController } from "./roommateProfile.controller";

import {
  createRoommateProfileSchema,
  updateRoommateProfileSchema,
} from "./roommateProfile.validation";


const router = Router();

router.post(
  "/",
  auth(UserRole.TENANT),
  validateRequestBody(createRoommateProfileSchema),
  RoommateProfileController.createRoommateProfile
);
router.get(
  "/me",
  auth(UserRole.TENANT),
  RoommateProfileController.getMyRoommateProfile
);

router.patch(
  "/me",
  auth(UserRole.TENANT),
  validateRequestBody(updateRoommateProfileSchema),
  RoommateProfileController.updateRoommateProfile
);

router.delete(
  "/me",
  auth(UserRole.TENANT),
  RoommateProfileController.deleteRoommateProfile
);

router.get(
  "/",
  auth(UserRole.TENANT, UserRole.ADMIN,UserRole.OWNER),
  RoommateProfileController.findAllRoommateProfiles
);

router.get(
  "/:id",
  auth(UserRole.TENANT),
  RoommateProfileController.findRoommateProfileById
);

export const RoommateProfileRoutes = router;