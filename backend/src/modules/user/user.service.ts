import { prisma } from "../../lib/prisma";
import { AppError } from "../../utils/appError";
import httpStatus from "http-status";
import { deleteImage, uploadImage } from "../../utils/cloudinary.utils";

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


export const UserService = {
    uploadUserImage,
    deleteUserImage,
};