import { Router } from "express";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";
import { upload } from "../../lib/multer";
import { ownerController } from "./owner.controller";

const router = Router();

router.post("/apply-as-owner", auth(UserRole.TENANT), upload.single("verrificationDocument"), ownerController.applyAsOwner);
router.patch("/approve-owner-application/:id", auth(UserRole.ADMIN), ownerController.approveOwnerApplication);
router.patch("/reject-owner-application/:id", auth(UserRole.ADMIN), ownerController.rejectOwnerApplication);
router.get("/all-owner-applications", auth(UserRole.ADMIN), ownerController.getAllOwnerApplications);

export const OwnerRoutes = router;
