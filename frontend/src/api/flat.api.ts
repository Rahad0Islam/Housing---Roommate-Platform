import apiClient from "@/lib/apiClient";
import { IApiResponse, IFlat } from "@/types/building.types";

export const createFlat = async (payload: { buildingId: string; flatNumber: string; floorNumber: number; bedrooms: number; bathrooms: number; balcony: number; totalArea: number; status: string; }) => {
  return await apiClient<IApiResponse<IFlat>>(`/flats/create-flat/${payload.buildingId}`, {
    method: "POST",
    body: {
      flatNumber: payload.flatNumber,
      floorNumber: payload.floorNumber,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      balcony: payload.balcony,
      totalArea: payload.totalArea,
      status: payload.status,
    },
  });
};

export const updateFlat = async (payload: { flatId: string; flatNumber?: string; floorNumber?: number; bedrooms?: number; bathrooms?: number; balcony?: number; totalArea?: number; status?: string; }) => {
  return await apiClient<IApiResponse<IFlat>>(`/flats/update-flat/${payload.flatId}`, {
    method: "PATCH",
    body: {
      flatNumber: payload.flatNumber,
      floorNumber: payload.floorNumber,
      bedrooms: payload.bedrooms,
      bathrooms: payload.bathrooms,
      balcony: payload.balcony,
      totalArea: payload.totalArea,
      status: payload.status,
    },
  });
};

export const deleteFlat = async (flatId: string) => {
  return await apiClient<IApiResponse<null>>(`/flats/delete-flat/${flatId}`, {
    method: "DELETE",
  });
};

export const getFlatsByBuildingId = async (buildingId: string) => {
  return await apiClient<IApiResponse<IFlat[]>>(`/flats/get-flats/${buildingId}`, {
    method: "GET",
  });
};

export const getFlatById = async (flatId: string) => {
  return await apiClient<IApiResponse<IFlat>>(`/flats/get-flat/${flatId}`, {
    method: "GET",
  });
};
