import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const applyAsOwner = async (formData: FormData): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/owners/apply-as-owner", {
    method: "POST",
    body: formData,
  });
};

export const getAllOwnerApplications = async (): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/owners/all-owner-applications", {
    method: "GET",
  });
};

export const approveOwnerApplication = async (id: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/owners/approve-owner-application/${id}`, {
    method: "PATCH",
  });
};

export const rejectOwnerApplication = async (id: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/owners/reject-owner-application/${id}`, {
    method: "PATCH",
  });
};
