import {Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { validateRequestBody } from "../../middleware/validateRequest";
import { UserRole } from "../../../generated/prisma/client";
import { flatController } from "./flat.controller";
import { flatValidation } from "./flat.validation";

const router = Router();

router.post("/create-flat/:buildingId",auth(UserRole.ADMIN,UserRole.OWNER),
        validateRequestBody(flatValidation.createFlatZodSchema),
        flatController.createFlat);
router.patch("/update-flat/:flatId",auth(UserRole.ADMIN,UserRole.OWNER),
        validateRequestBody(flatValidation.updateFlatZodSchema),
        flatController.updateFlat);
router.delete("/delete-flat/:flatId",auth(UserRole.ADMIN,UserRole.OWNER),flatController.deleteFlat);
router.get("/get-flats/:buildingId",auth(UserRole.ADMIN,UserRole.OWNER,UserRole.TENANT),flatController.getFlatByBuildingId);
router.get("/get-flat/:flatId",auth(UserRole.ADMIN,UserRole.OWNER,UserRole.TENANT),flatController.getFlatById); 


export const FlatRoutes = router;
