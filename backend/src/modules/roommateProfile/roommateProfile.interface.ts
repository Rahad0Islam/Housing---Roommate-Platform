import {
  GenderPreference,
  PreferenceLevel,
} from "../../../generated/prisma/client";
import { RoommateProfileWhereInput } from "../../../generated/prisma/models";

export interface ICreateRoommateProfile {
  bio?: string;
  budgetMin: number;
  budgetMax: number;
  genderPreference?: GenderPreference;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  cleanlinessLevel?: PreferenceLevel;
  noiseTolerance?: PreferenceLevel;
  sleepTime: string;
  wakeTime: string;
}

export interface IUpdateRoommateProfile {
  bio?: string;
  budgetMin?: number;
  budgetMax?: number;
  genderPreference?: GenderPreference;
  smokingAllowed?: boolean;
  petsAllowed?: boolean;
  cleanlinessLevel?: PreferenceLevel;
  noiseTolerance?: PreferenceLevel;
  sleepTime?: string;
  wakeTime?: string;
}

export interface IRoommateSearchQuery extends RoommateProfileWhereInput {
page?: string;
  limit?: string;
  sortBy?: string;
  searchTerm?: string;
  sortOrder?: 'asc' | 'desc';
  
}