import apiClient from "@/lib/apiClient";
import { IApiResponse, IAmenity } from "@/types/building.types";

export interface AmenityPayload {
  buildingId: string;
  name: string;
  description?: string;
}

export const getBuildingAmenities = async (
  buildingId: string,
): Promise<IApiResponse<IAmenity[]>> =>
  apiClient<IApiResponse<IAmenity[]>>(
    `/amenities/get-all-amenities/${buildingId}`,
    { method: "GET" },
  );

export const createAmenity = async (
  payload: AmenityPayload,
): Promise<IApiResponse<IAmenity>> =>
  apiClient<IApiResponse<IAmenity>>("/amenities/create-amenity", {
    method: "POST",
    body: payload,
  });

export const deleteAmenity = async (id: string): Promise<IApiResponse<null>> =>
  apiClient<IApiResponse<null>>(`/amenities/delete-amenity/${id}`, {
    method: "DELETE",
  });
