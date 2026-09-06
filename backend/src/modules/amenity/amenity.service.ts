import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { IAmenity } from "./amenity.interface";
import httpStatus from "http-status";

const createAmenity = async (payload: IAmenity,userId: string) => {

    const {name,description,buildingId} = payload;
    const building = await prisma.building.findUnique({
        where: { id: buildingId },
    });

    if (!building) {
        throw new AppError(httpStatus.NOT_FOUND, "Building not found");
    }
    if(building.ownerId !== userId){
        throw new AppError(httpStatus.FORBIDDEN, "You are not authorized to create an amenity for this building");
    }

  const newAmenity = await prisma.amenity.create({
    data: {
        name,
        description,
        buildingId: building.id,

    },
  });

  return newAmenity;
};

const getAllAmenities = async (buildingId: string) => {
  const amenities = await prisma.amenity.findMany({
    where: {
      buildingId,
    },
  });
  return amenities;
};

const getAmenityById = async (id: string) => {
  const amenity = await prisma.amenity.findUnique({
    where: { id },
  });

  if (!amenity) {
    throw new AppError(httpStatus.NOT_FOUND, "Amenity not found");
  }

  return amenity;
};

const updateAmenity = async (id: string, payload: Partial<IAmenity> , userId: string) => {
    console.log("updateAmenity",id,payload,userId);
    const {name,description} = payload;
  const amenity = await prisma.amenity.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });

  if (!amenity) {
    throw new AppError(httpStatus.NOT_FOUND, "Amenity not found");
  }

  if (amenity.building.ownerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this amenity"
    );
  }

  const updatedAmenity = await prisma.amenity.update({
    where: { id },
    data: {
        name: name ?? amenity.name,
        description: description ?? amenity.description,
    },
  });

  return updatedAmenity;
};

const deleteAmenity = async (id: string, userId: string) => {
  const amenity = await prisma.amenity.findUnique({
    where: { id },
    include: {
      building: true,
    },
  });

  if (!amenity) {
    throw new AppError(httpStatus.NOT_FOUND, "Amenity not found");
  }
  
  if (amenity.building.ownerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this amenity"
    );
  }
  await prisma.amenity.delete({
    where: { id },
  });
};

export const amenityService = {
  createAmenity,
  getAllAmenities,
  getAmenityById,
  updateAmenity,
  deleteAmenity,
};        