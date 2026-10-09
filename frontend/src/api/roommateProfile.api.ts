import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const getBestRoommateMatches = async (params?: {
  city?: string;
  building?: string;
}): Promise<IApiResponse<any>> => {
  const query = new URLSearchParams();
  if (params?.city) query.set("city", params.city);
  if (params?.building) query.set("building", params.building);
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return await apiClient<IApiResponse<any>>(`/roommate-profiles/best-matches${suffix}`, {
    method: "GET",
  });
};

export const getRoommateProfileById = async (
  id: string,
): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/roommate-profiles/${id}`, {
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
