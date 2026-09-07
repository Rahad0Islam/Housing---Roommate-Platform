import { prisma } from "../../lib/prisma";
import AppError from "../../utils/appError";
import httpStatus from "http-status";
import {
  ICreateRoommateProfile,
  IRoommateSearchQuery,
  IUpdateRoommateProfile,
} from "./roommateProfile.interface";
import { RoommateProfileWhereInput } from "../../../generated/prisma/models";

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

const findAllRoommateProfiles = async (
  query: IRoommateSearchQuery,
) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andCondition: RoommateProfileWhereInput[] = [];

  // Search by bio
  if (query.searchTerm) {
    andCondition.push({
      OR: [
        {
          bio: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  // Minimum budget
  if (query.budgetMin !== undefined) {
    andCondition.push({
      budgetMin: {
        gte: Number(query.budgetMin),
      },
    });
  }

  // Maximum budget
  if (query.budgetMax !== undefined) {
    andCondition.push({
      budgetMax: {
        lte: Number(query.budgetMax),
      },
    });
  }

  // Gender preference
  if (query.genderPreference) {
    andCondition.push({
      genderPreference: query.genderPreference,
    });
  }

  // Smoking
  // Smoking
//  if (query.smokingAllowed !== undefined) {
//   andCondition.push({
//     smokingAllowed: query.smokingAllowed === "true" 
//   });
// }

// if (query.petsAllowed !== undefined) {
//   andCondition.push({
//     petsAllowed: query.petsAllowed,
//   });
// }
  // Cleanliness
  if (query.cleanlinessLevel) {
    andCondition.push({
      cleanlinessLevel: query.cleanlinessLevel,
    });
  }

  // Noise tolerance
  if (query.noiseTolerance) {
    andCondition.push({
      noiseTolerance: query.noiseTolerance,
    });
  }

  const whereCondition: RoommateProfileWhereInput = {
    AND: andCondition,
  };

  // Total matching profiles
  const total = await prisma.roommateProfile.count({
    where: whereCondition,
  });

  if (total === 0) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      "No roommate profiles found",
    );
  }

  const profiles = await prisma.roommateProfile.findMany({
    where: whereCondition,
    skip,
    take: limit,

    orderBy: {
      [sortBy]: sortOrder,
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

  return {
    data: profiles,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
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