import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { upload } from "../../lib/multer";
import { buildingController } from "./building.controller";
import { buildingValidation } from "./building.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.OWNER, UserRole.ADMIN),
  upload.single("buildingImage"),
  validateRequestBody(buildingValidation.createBuildingZodSchema),  
  buildingController.createBuilding
);

router.get("/", buildingController.getAllBuildings);

router.patch(
  "/:id",
  auth(UserRole.OWNER, UserRole.ADMIN),
  upload.single("buildingImage"),
  validateRequestBody(buildingValidation.updateBuildingZodSchema),
  buildingController.updateBuilding
);

router.delete(
  "/:id",
  auth(UserRole.OWNER, UserRole.ADMIN),
  buildingController.deleteBuilding
);

router.get("/owner", buildingController.getBuildingsByOwnerId);

router.get("/:id", buildingController.getBuildingById);



export const BuildingRoutes = router;
