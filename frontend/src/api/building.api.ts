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
