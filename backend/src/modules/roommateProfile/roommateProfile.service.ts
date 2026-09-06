import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import {
  ICreateRoommateProfile,
  IUpdateRoommateProfile,
} from "./roommateProfile.interface";

const timeStringToDate = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  const date = new Date(1970, 0, 1);
  date.setHours(hours as number, minutes, 0, 0);

  return date;
};

const createRoommateProfile = async (
  payload: ICreateRoommateProfile,
  userId: string
) => {
  const existingProfile =
    await prisma.roommateProfile.findUnique({
      where: {
        userId,
      },
    });

  if (existingProfile) {
    throw new AppError(
      httpStatus.CONFLICT,
      "Roommate profile already exists"
    );
  }

  const profile = await prisma.roommateProfile.create({
    data: {
      userId,

      bio: payload.bio,

      budgetMin: payload.budgetMin,

      budgetMax: payload.budgetMax,

      genderPreference: payload.genderPreference,

      smokingAllowed: payload.smokingAllowed,

      petsAllowed: payload.petsAllowed,

      cleanlinessLevel: payload.cleanlinessLevel,

      noiseTolerance: payload.noiseTolerance,

      sleepTime: timeStringToDate(payload.sleepTime),

      wakeTime: timeStringToDate(payload.wakeTime),
    },
  });

  return profile;
};


const getMyRoommateProfile = async (userId: string) => {
  const profile = await prisma.roommateProfile.findUnique({
    where: {
      userId,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Roommate profile not found"
    );
  }

  return profile;
};

const updateRoommateProfile = async (
  payload: IUpdateRoommateProfile,
  userId: string
) => {
  const existingProfile =
    await prisma.roommateProfile.findUnique({
      where: {
        userId,
      },
    });

  if (!existingProfile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Roommate profile not found"
    );
  }

  if (
    payload.budgetMin !== undefined &&
    payload.budgetMax !== undefined &&
    payload.budgetMax < payload.budgetMin
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "budgetMax must be greater than or equal to budgetMin"
    );
  }

  const updatedProfile =
    await prisma.roommateProfile.update({
      where: {
        userId,
      },
      data: {
        ...(payload.bio !== undefined && {
          bio: payload.bio,
        }),

        ...(payload.budgetMin !== undefined && {
          budgetMin: payload.budgetMin,
        }),

        ...(payload.budgetMax !== undefined && {
          budgetMax: payload.budgetMax,
        }),

        ...(payload.genderPreference !== undefined && {
          genderPreference: payload.genderPreference,
        }),

        ...(payload.smokingAllowed !== undefined && {
          smokingAllowed: payload.smokingAllowed,
        }),

        ...(payload.petsAllowed !== undefined && {
          petsAllowed: payload.petsAllowed,
        }),

        ...(payload.cleanlinessLevel !== undefined && {
          cleanlinessLevel: payload.cleanlinessLevel,
        }),

        ...(payload.noiseTolerance !== undefined && {
          noiseTolerance: payload.noiseTolerance,
        }),

        ...(payload.sleepTime !== undefined && {
          sleepTime: timeStringToDate(payload.sleepTime),
        }),

        ...(payload.wakeTime !== undefined && {
          wakeTime: timeStringToDate(payload.wakeTime),
        }),
      },
    });

  return updatedProfile;
};

const deleteRoommateProfile = async (userId: string) => {
  const profile = await prisma.roommateProfile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Roommate profile not found"
    );
  }

  await prisma.roommateProfile.delete({
    where: {
      userId,
    },
  });

  return null;
};

const findAllRoommateProfiles = async () => {
  return await prisma.roommateProfile.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const findRoommateProfileById = async (id: string) => {
  const profile = await prisma.roommateProfile.findUnique({
    where: {
      id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profileImage: true,
        },
      },
    },
  });

  if (!profile) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "Roommate profile not found"
    );
  }

  return profile;
};


export const RoommateProfileService = {
  createRoommateProfile,
  getMyRoommateProfile,
  updateRoommateProfile,
  deleteRoommateProfile,
  findAllRoommateProfiles,
  findRoommateProfileById,
};