import { UserRole } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { IBuilding } from "./building.interface";
import { deleteImage, uploadImage } from "../../utils/cloudinary.utils";

const createBuilding = async (
  payload: IBuilding,
  userId: string,
  file?: Express.Multer.File
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if (
    user.role !== UserRole.OWNER &&
    user.role !== UserRole.ADMIN
  ) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to create a building"
    );
  }

  const {
    name,
    address,
    description,
    numberOfFloors,
    city,
  } = payload;

  let imageUrl: string | undefined;
  let imagePublicId: string | undefined;

  // Upload only if an image was provided
  if (file) {
    const uploadResult = await uploadImage(
      file.buffer,
    );

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.publicId;
  }

  const newBuilding = await prisma.building.create({
    data: {
      ownerId: userId,
      name,
      address,
      description,
      numberOfFloors,
      city,

      // Optional image fields
      buildingImage: imageUrl,
      buildingImagePublicId: imagePublicId,
    },
  });

  return newBuilding;
};


const getAllBuildings = async () => {

    //future add query params for filtering and pagination
  const buildings = await prisma.building.findMany();
  return buildings;
};

const getBuildingByOwnerId = async (ownerId: string) => {
  const buildings = await prisma.building.findMany({
    where: { ownerId },
    include: {
      owner: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!buildings || buildings.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "No buildings found for this owner");
  }

  return buildings;
};

const getBuildingById = async (buildingId: string) => {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
  });

  if (!building) {
    throw new AppError(httpStatus.NOT_FOUND, "Building not found");
  }

  return building;
}

const updateBuilding = async (
  buildingId: string,
  payload: Partial<IBuilding>,
  userId: string,
  file?: Express.Multer.File
) => {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
  });

  if (!building) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Building not found"
    );
  }

  if (building.ownerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this building"
    );
  }

  let imageUrl = building.buildingImage;
  let imagePublicId = building.buildingImagePublicId;

  if (file) {
    const uploadResult = await uploadImage(
      file.buffer,
    );

     if(imagePublicId) 
     await deleteImage(imagePublicId); // Delete the old image from Cloudinary

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.publicId;
  }

  const updatedBuilding = await prisma.building.update({
    where: { id: buildingId },
    data: {
      ...payload,
      buildingImage: imageUrl,
      buildingImagePublicId: imagePublicId,
    },
  });

  return updatedBuilding;
};

const deleteBuilding = async (buildingId: string, userId: string) => {
  const building = await prisma.building.findUnique({
    where: { id: buildingId },
  });

  if (!building) {
    throw new AppError(httpStatus.NOT_FOUND, "Building not found");
  }

  if (building.ownerId !== userId) {
    throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to delete this building");
  }

  await prisma.building.delete({
    where: { id: buildingId },
  });

  await deleteImage(building.buildingImagePublicId!); // Delete the image from Cloudinary

  return { message: "Building deleted successfully" };
}


export const buildingService = {
    createBuilding,
    getAllBuildings,
    getBuildingById,
    updateBuilding,
    deleteBuilding,
    getBuildingByOwnerId
}