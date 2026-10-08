import apiClient from "@/lib/apiClient";
import {
  IApiResponse,
  IBuilding,
  IBuildingSearchQuery,
} from "../types/building.types";

export const getBuildings = async (
  query?: IBuildingSearchQuery
): Promise<IApiResponse<IBuilding[]>> => {
  const queryParams = new URLSearchParams();

  if (query) {
    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
    if (query.sortBy) queryParams.append("sortBy", query.sortBy);
    if (query.sortOrder) queryParams.append("sortOrder", query.sortOrder);
    if (query.searchTerm) queryParams.append("searchTerm", query.searchTerm);
    if (query.name) queryParams.append("name", query.name);
    if (query.description) queryParams.append("description", query.description);
    if (query.id) queryParams.append("id", query.id);
    if (query.city) queryParams.append("city", query.city);
    if (query.numberOfFloors)
      queryParams.append("numberOfFloors", query.numberOfFloors.toString());
  }

  const queryString = queryParams.toString();
  const url = queryString ? `/buildings?${queryString}` : "/buildings";

  return await apiClient<IApiResponse<IBuilding[]>>(url, {
    method: "GET",
  });
};

export const getBuildingById = async (
  id: string
): Promise<IApiResponse<IBuilding>> => {
  return await apiClient<IApiResponse<IBuilding>>(`/buildings/${id}`, {
    method: "GET",
  });
};

export const getOwnerBuildings = async (
  query?: IBuildingSearchQuery
): Promise<IApiResponse<IBuilding[]>> => {
  const queryParams = new URLSearchParams();
  if (query) {
    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
    if (query.searchTerm) queryParams.append("searchTerm", query.searchTerm);
  }
  const queryString = queryParams.toString();
  const url = queryString ? `/buildings/owner?${queryString}` : "/buildings/owner";
  return await apiClient<IApiResponse<IBuilding[]>>(url, { method: "GET" });
};

export const createBuilding = async (data: FormData): Promise<IApiResponse<IBuilding>> => {
  return await apiClient<IApiResponse<IBuilding>>("/buildings", {
    method: "POST",
    body: data,
  });
};

export const updateBuilding = async (payload: { id: string; data: FormData }): Promise<IApiResponse<IBuilding>> => {
  return await apiClient<IApiResponse<IBuilding>>(`/buildings/${payload.id}`, {
    method: "PATCH",
    body: payload.data,
  });
};

export const deleteBuilding = async (id: string): Promise<IApiResponse<null>> => {
  return await apiClient<IApiResponse<null>>(`/buildings/${id}`, {
    method: "DELETE",
  });
};
