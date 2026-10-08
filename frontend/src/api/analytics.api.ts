import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types"; // we can reuse or create a global type, wait let me define types.

export const getAdminAnalytics = (query?: any) => {
  return apiClient("/analytics/admin", { method: "GET", query });
};

export const getOwnerAnalytics = (query?: any) => {
  return apiClient("/analytics/owner", { method: "GET", query });
};

export const getTenantAnalytics = (query?: any) => {
  return apiClient("/analytics/tenant", { method: "GET", query });
};
