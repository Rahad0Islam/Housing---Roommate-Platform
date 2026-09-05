import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import { IFlat } from "./flat.interface";
import httpStatus from "http-status";

const createFlat = async (payload: IFlat, buildingId: string ,userId:string) => {

    console.log("userId",userId, "buildingId",buildingId, "payload",payload);
  const building = await prisma.building.findUnique({
    where: { id: buildingId, ownerId: userId },
  });

  if (!building) {
    throw new AppError(httpStatus.NOT_FOUND, "Building not found");
  }

  const { flatNumber, floorNumber, bedrooms, bathrooms, balcony, totalArea, status } = payload;

  const flat = await prisma.flat.create({
    data: {
        flatNumber,
        floorNumber,
        bedrooms,
        bathrooms,
        balcony,
        totalArea,
        status,
        buildingId: building.id,
    },
  });

  await prisma.building.update({
    where: { id: buildingId },
    data: {
         numberOfFlats : {
          increment: 1,
       },
    },
  });

  return flat;
};


const updateFlat = async (flatId: string, payload: Partial<IFlat>, userId: string) => {
  const flat = await prisma.flat.findUnique({
    where: { id: flatId },
    include: {
      building: true,
    },
  });

  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  if (flat.building.ownerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to update this flat"
    );
  }

  const updatedFlat = await prisma.flat.update({
    where: { id: flatId },
    data: payload,
  });

  return updatedFlat;
};

const getFlatByBuildingId = async (buildingId: string) => {
  const flat = await prisma.building.findUnique({
    where: { id:buildingId },
    include: {
      flats: true,
     },
  });

  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  return flat;
};

const deleteFlat = async (flatId: string, userId: string) => {
  const flat = await prisma.flat.findUnique({
    where: { id: flatId },
    include: {
      building: true,
    },
  });

  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  if (flat.building.ownerId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not authorized to delete this flat"
    );
  }

  await prisma.flat.delete({
    where: { id: flatId },
  });

  await prisma.building.update({
    where: { id: flat.buildingId },
    data: {
         numberOfFlats : {
          decrement: 1,
       },
    },
  });

  return { message: "Flat deleted successfully" };
};

const getFlatById = async (flatId: string) => {
  const flat = await prisma.flat.findUnique({
    where: { id: flatId },
  });

  if (!flat) {
    throw new AppError(httpStatus.NOT_FOUND, "Flat not found");
  }

  return flat;
};


export const flatService = {
  createFlat,
  updateFlat,
  getFlatByBuildingId,
  deleteFlat,
  getFlatById,

};  
   