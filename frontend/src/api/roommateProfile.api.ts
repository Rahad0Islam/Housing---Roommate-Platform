import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const getBestRoommateMatches = async (): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/roommate-profiles/best-matches", {
    method: "GET",
  });
};

export const createRoommateProfile = async (payload: any): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/roommate-profiles", {
    method: "POST",
    body: payload,
  });
};

export const getMyRoommateProfile = async (): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/roommate-profiles/me", {
    method: "GET",
  });
};

export const updateRoommateProfile = async (payload: any): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/roommate-profiles/me", {
    method: "PATCH",
    body: payload,
  });
};
