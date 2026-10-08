import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const getAllUsers = async (query?: any): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/users", {
    method: "GET",
    query,
  });
};

export const blockUser = async (userId: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/users/block-user/${userId}`, {
    method: "PATCH",
  });
};

export const activateUser = async (userId: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/users/active-user/${userId}`, {
    method: "PATCH",
  });
};
