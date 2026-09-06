import {Router } from "express";
import { amenityController } from "./amenity.controller";
import { UserRole } from "../../../generated/prisma/client";
import { auth } from "../../middleware/checkAuth";


const router = Router();

router.post("/create-amenity",auth(UserRole.OWNER),
        amenityController.createAminity);

router.get("/get-all-amenities/:buildingId",
        amenityController.getAllAmenities);

router.get("/get-amenity/:id",
        amenityController.getAmenityById);

router.patch("/update-amenity/:id",auth(UserRole.OWNER),
        amenityController.updateAmenity);

router.delete("/delete-amenity/:id",auth(UserRole.OWNER),
        amenityController.deleteAmenity);

export const AmenityRoutes = router;
