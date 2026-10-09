import apiClient from "@/lib/apiClient";

export const getAdminAnalytics = (
  query?: Record<string, string | number | boolean>,
) => {
  return apiClient("/analytics/admin", { method: "GET", query });
};

export const getOwnerAnalytics = (
  query?: Record<string, string | number | boolean>,
) => {
  return apiClient("/analytics/owner", { method: "GET", query });
};

export const getTenantAnalytics = (
  query?: Record<string, string | number | boolean>,
) => {
  return apiClient("/analytics/tenant", { method: "GET", query });
};
