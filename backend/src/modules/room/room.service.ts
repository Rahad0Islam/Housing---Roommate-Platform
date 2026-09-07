import { BookingStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import { deleteImage, uploadImage } from "../../utils/cloudinary.utils";
import { IRoom } from "./room.interface";
import httpStatus from "http-status";


const createRoom = async (
  flatId: string,
  payload: IRoom,
  file?: Express.Multer.File
) => {
  const flat = await prisma.flat.findUnique({
    where: { id: flatId },
  });

  if (!flat) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Flat not found"
    );
  }

  let roomImage: string | undefined;
  let roomImagePublicId: string | undefined;

  // Upload image only if a file is provided
  if (file) {
    const uploadResult = await uploadImage(
      file.buffer,
    );

    roomImage = uploadResult.imageUrl;
    roomImagePublicId = uploadResult.publicId;
  }
  

  const { name, roomType, monthlyRent, dailyRent, maxOccupants, furnished, availableFrom, status } = payload;
  console.log({payload})
;  const availableBed = Number(maxOccupants); // Assuming availableBed is equal to maxOccupants when creating a room
  const room = await prisma.room.create({
    data: {
        name,
        roomType,
        monthlyRent,
        dailyRent,
        maxOccupants:Number(maxOccupants),
        availableBed,
        furnished,
        availableFrom,
        status,
      flatId: flat.id,
      roomImage,
      roomImagePublicId,
    },
  });

  return room;
};


const updateRoom = async (
  roomId: string,
  payload: Partial<IRoom>,
  file?: Express.Multer.File
) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Room not found"
    );
  }

  let roomImage: string | undefined;
  let roomImagePublicId: string | undefined;

  // Upload image only if a file is provided
  if (file) {
    const uploadResult = await uploadImage(
      file.buffer,
    );

    await deleteImage(roomImagePublicId!); // Delete the old image from Cloudinary

    roomImage = uploadResult.imageUrl;
    roomImagePublicId = uploadResult.publicId;
  }
  const { name, roomType, monthlyRent, dailyRent, furnished, availableFrom, status } = payload;
 let availableBed = room.availableBed; // Default to current availableBed
   if(payload.maxOccupants){
         const subtractOccupants = payload.maxOccupants - room.maxOccupants;
         availableBed = room.availableBed + subtractOccupants;
         if(availableBed < 0){
            throw new AppError(
              httpStatus.BAD_REQUEST,
              "Available bed cannot be less than 0"
            );
         }
   }

  const updatedRoom = await prisma.room.update({
    where: { id: roomId },
    data: {
      ...payload,
      ...(file && { roomImage, roomImagePublicId }),
      availableBed,
    },
  });

  return updatedRoom;
}

const getRoomById = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
       bookings:{
         where:{
            status: { in: [BookingStatus.ON_GOING , BookingStatus.CONFIRMED] }
         },
          include:{
              tenant:{
                select:{
                  id:true,
                  name:true,
                  email:true,
                  roommateProfile:true,
                }
              }
          }
       }
    },
  });

  if (!room) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Room not found"
    );
  }

  return room;
}

const getRoomsByFlatId = async (flatId: string) => {
  const rooms = await prisma.room.findMany({
    where: { flatId },
     include: {
       bookings:{
         where:{
            status: { in: [BookingStatus.ON_GOING , BookingStatus.CONFIRMED] }
         },
          include:{
              tenant:{
                select:{
                  id:true,
                  name:true,
                  email:true,
                  roommateProfile:true,
                }
              }
          }
       }
    },
  });

  if (!rooms || rooms.length === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No rooms found for this flat"
    );
  }

  return rooms;
}

const deleteRoom = async (roomId: string) => {
  const room = await prisma.room.findUnique({
    where: { id: roomId },
  });

  if (!room) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Room not found"
    );
  }

  await deleteImage(room.roomImagePublicId!); // Delete the image from Cloudinary

  await prisma.room.delete({
    where: { id: roomId },
  });
}   
export const roomService = {
  createRoom,
  updateRoom,
  getRoomById,
  getRoomsByFlatId,
  deleteRoom,
};