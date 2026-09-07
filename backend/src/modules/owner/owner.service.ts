import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import { OwnerStatus, UserRole } from "../../../generated/prisma/client";
import { deleteFile, uploadPdf } from "../../utils/cloudinary.utils";

const applyAsOwner = async (userId: string, file?: Express.Multer.File) => {
  const existingOwner = await prisma.owner.findUnique({

    where: { userId },
  });

  if (existingOwner?.status === OwnerStatus.PENDING || existingOwner?.status === OwnerStatus.VERIFIED) {
    throw new AppError(httpStatus.BAD_REQUEST, "You have already applied as an owner");
  }

  if(existingOwner?.status === OwnerStatus.REJECTED){
    await prisma.owner.delete({
      where: { userId },
    });
    if(existingOwner.verificationDocumentPublicId){
      await deleteFile(existingOwner.verificationDocumentPublicId);
    }
  }

   

  if(!file){
    throw new AppError(httpStatus.BAD_REQUEST, "Verification document is required");
  }

  const result = await uploadPdf(file.buffer);
  const newOwner = await prisma.owner.create({
    data: {
      userId,
      verificationDocumentUrl: result.fileUrl,
      verificationDocumentPublicId: result.publicId,
      status: OwnerStatus.PENDING,
    },
  });

  return newOwner;
};



const approveOwnerApplication = async (ownerId: string, userId: string) => {
  console.log({ ownerId, userId });
  const owner = await prisma.owner.findUnique({
    where: { id: ownerId },
  });

  if (!owner) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner application not found");
  }

  if (owner.status !== OwnerStatus.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Owner application is not pending");
  }
   
  const user = await prisma.user.findUnique({
    where: { id:userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if(user.role !== UserRole.ADMIN){
    throw new AppError(httpStatus.FORBIDDEN, "Only admin can approve owner applications");
  }
  const updatedOwner = await prisma.owner.update({
    where: { id: ownerId },
    data: { status: OwnerStatus.VERIFIED },
  });

    return updatedOwner;
    };



const rejectOwnerApplication = async (ownerId: string , userId: string) => {
  const owner = await prisma.owner.findUnique({
    where: { id: ownerId },
  });

  if (!owner) {
    throw new AppError(httpStatus.NOT_FOUND, "Owner application not found");
  }

  if (owner.status !== OwnerStatus.PENDING) {
    throw new AppError(httpStatus.BAD_REQUEST, "Owner application is not pending");
  }
   
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  if(user.role !== UserRole.ADMIN){
    throw new AppError(httpStatus.FORBIDDEN, "Only admin can reject owner applications");
  }
  const updatedOwner = await prisma.owner.update({
    where: { id: ownerId },
    data: { status: OwnerStatus.REJECTED },
  });

    return updatedOwner;
    };



const getAllOwnerApplications = async (userId:string) => {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
  
    if(user.role !== UserRole.ADMIN){
      throw new AppError(httpStatus.FORBIDDEN, "Only admin can view owner applications");
    }
  const ownerApplications = await prisma.owner.findMany({
    include: {
      user: true,
    },
  });

  return ownerApplications;
};

export const ownerService = {
  applyAsOwner,
  approveOwnerApplication,
  rejectOwnerApplication,
  getAllOwnerApplications,
};