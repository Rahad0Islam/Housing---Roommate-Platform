import {
  GenderPreference,
  PreferenceLevel,
} from "../../../generated/prisma/client";

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