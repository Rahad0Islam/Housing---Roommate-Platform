import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { deleteImage, uploadImage } from "../../utils/cloudinary.utils";
import { UserStatus } from "../../../generated/prisma/enums";

const uploadUserImage = async (file: Express.Multer.File, userId: string)=> {

     const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (!file) {
        throw new AppError(httpStatus.BAD_REQUEST, "No file provided");
    }

    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;
    const uploadResult = await uploadImage(file.buffer);
    if(user.profileImagePublicId){
        await deleteImage(user.profileImagePublicId);
    }
    
    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.publicId;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            profileImage: imageUrl,
            profileImagePublicId: imagePublicId,
        },
    });

    return updatedUser;
}

export const deleteUserImage = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (!user.profileImagePublicId) {
        throw new AppError(httpStatus.BAD_REQUEST, "No profile image to delete");
    }

    await deleteImage(user.profileImagePublicId);

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
            profileImage: null,
            profileImagePublicId: null,
        },
    });

    return updatedUser;
};

const blockUser = async (userId: string, adminId: string) => {
    if (userId === adminId) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot block your own account");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.userStatus === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is already blocked");
    }

    return prisma.user.update({
        where: { id: userId },
        data: { userStatus: UserStatus.BLOCKED },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            userStatus: true,
            updatedAt: true,
        },
    });
};

const activeUser = async (userId: string, adminId: string) => {
    if (userId === adminId) {
        throw new AppError(httpStatus.FORBIDDEN, "You cannot change your own account status");
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }

    if (user.userStatus !== UserStatus.BLOCKED) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not blocked");
    }

    return prisma.user.update({
        where: { id: userId },
        data: { userStatus: UserStatus.ACTIVE },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            userStatus: true,
            updatedAt: true,
        },
    });
};




export const UserService = {
    uploadUserImage,
    deleteUserImage,
    blockUser,
    activeUser,
};