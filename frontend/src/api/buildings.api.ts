import apiClient from "@/lib/apiClient";
import { ResponseEnvelope } from "@/types/api";
import { Building, Flat, Room, Amenity } from "@/types/models";

// Assuming backend building contains flats, rooms, amenities when requested
export interface BuildingWithDetails extends Building {
  flats: Flat[];
  amenities: Amenity[];
}

export const getAllBuildings = async (params?: Record<string, string | number>) => {
  return apiClient<ResponseEnvelope<BuildingWithDetails[]>>("/buildings", {
    method: "GET",
    query: params,
  });
};

export const getBuildingById = async (id: string) => {
  return apiClient<ResponseEnvelope<BuildingWithDetails>>(`/buildings/${id}`, {
    method: "GET",
  });
};

export const createBuilding = async (payload: any) => {
  return apiClient<ResponseEnvelope<Building>>("/buildings", {
    method: "POST",
    body: payload,
  });
};

export const updateBuilding = async (id: string, payload: any) => {
  return apiClient<ResponseEnvelope<Building>>(`/buildings/${id}`, {
    method: "PATCH",
    body: payload,
  });
};

export const deleteBuilding = async (id: string) => {
  return apiClient<ResponseEnvelope<Building>>(`/buildings/${id}`, {
    method: "DELETE",
  });
};

export const getOwnerBuildings = async () => {
  return apiClient<ResponseEnvelope<BuildingWithDetails[]>>("/buildings/owner", {
    method: "GET",
  });
};
