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
    return {
      meta: {
        page,
        limit,
        total,
      },
      data: [],
    };
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
          bookings: {
            where: { status: { in: ["CONFIRMED", "ON_GOING"] } },
            orderBy: { startDate: "desc" },
            take: 1,
            select: {
              room: {
                select: {
                  id: true,
                  name: true,
                  flat: {
                    select: {
                      id: true,
                      flatNumber: true,
                      building: {
                        select: {
                          id: true,
                          name: true,
                          city: true,
                          address: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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


const getBestMatches = async (
  userId: string,
  query: { city?: string; building?: string } = {},
) => {
  // 1. Get the current user's profile
  const currentUserProfile = await prisma.roommateProfile.findUnique({
    where: { userId },
  });

  if (!currentUserProfile) {
    throw new AppError(httpStatus.BAD_REQUEST, "You need to create a roommate profile first to find matches.");
  }

  // 2. Get all other profiles
  const otherProfiles = await prisma.roommateProfile.findMany({
    where: {
      userId: {
        not: userId, // exclude current user
      },
      ...(query.city || query.building
        ? {
            user: {
              bookings: {
                some: {
                  status: { in: ["CONFIRMED", "ON_GOING"] },
                  room: {
                    flat: {
                      building: {
                        ...(query.city
                          ? { city: { contains: query.city, mode: "insensitive" } }
                          : {}),
                        ...(query.building
                          ? { name: { contains: query.building, mode: "insensitive" } }
                          : {}),
                      },
                    },
                  },
                },
              },
            },
          }
        : {}),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profileImage: true,
          bookings: {
            where: { status: { in: ["CONFIRMED", "ON_GOING"] } },
            orderBy: { startDate: "desc" },
            take: 1,
            select: {
              room: {
                select: {
                  id: true,
                  name: true,
                  flat: {
                    select: {
                      id: true,
                      flatNumber: true,
                      building: {
                        select: {
                          id: true,
                          name: true,
                          city: true,
                          address: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  // 3. Score each profile
  const scoredMatches = otherProfiles.map((profile) => {
    let score = 100; // Base score

    // Gender Preference Match
    if (currentUserProfile.genderPreference !== profile.genderPreference) {
      if (currentUserProfile.genderPreference !== 'ANY' && profile.genderPreference !== 'ANY') {
        score -= 20;
      } else {
        score -= 5;
      }
    }

    // Budget match
    const maxMinBudget = Math.max(Number(currentUserProfile.budgetMin), Number(profile.budgetMin));
    const minMaxBudget = Math.min(Number(currentUserProfile.budgetMax), Number(profile.budgetMax));
    
    if (maxMinBudget > minMaxBudget) {
      const diff = maxMinBudget - minMaxBudget;
      const largerBudget = Math.max(
        Number(currentUserProfile.budgetMax),
        Number(profile.budgetMax),
        1,
      );
      score -= Math.min(30, (diff / largerBudget) * 30);
    }

    // Lifestyle matching
    const levelToNumber = (level: string) => {
      if (level === 'LOW') return 1;
      if (level === 'MEDIUM') return 2;
      return 3;
    };

    // Cleanliness
    const cleanDiff = Math.abs(levelToNumber(currentUserProfile.cleanlinessLevel) - levelToNumber(profile.cleanlinessLevel));
    score -= cleanDiff * 10;

    // Noise Tolerance
    const noiseDiff = Math.abs(levelToNumber(currentUserProfile.noiseTolerance) - levelToNumber(profile.noiseTolerance));
    score -= noiseDiff * 10;

    // Smoking
    if (currentUserProfile.smokingAllowed !== profile.smokingAllowed) {
      score -= 15;
    }

    // Pets
    if (currentUserProfile.petsAllowed !== profile.petsAllowed) {
      score -= 10;
    }

    // Sleep/Wake times
    const diffHours = (date1: Date, date2: Date) => {
      let diffTime = Math.abs(date2.getTime() - date1.getTime());
      let hours = diffTime / (1000 * 60 * 60);
      return Math.min(hours, 24 - hours);
    };

    const sleepDiff = diffHours(currentUserProfile.sleepTime, profile.sleepTime);
    const wakeDiff = diffHours(currentUserProfile.wakeTime, profile.wakeTime);

    score -= (sleepDiff * 3);
    score -= (wakeDiff * 3);

    const finalScore = Math.max(0, Math.min(100, Math.round(score)));

    return {
      ...profile,
      matchScore: finalScore,
    };
  });

  // Sort by highest score
  scoredMatches.sort((a, b) => b.matchScore - a.matchScore);

  return scoredMatches;
};


export const RoommateProfileService = {
  createRoommateProfile,
  getMyRoommateProfile,
  updateRoommateProfile,
  deleteRoommateProfile,
  findAllRoommateProfiles,
  findRoommateProfileById,
  getBestMatches,
};