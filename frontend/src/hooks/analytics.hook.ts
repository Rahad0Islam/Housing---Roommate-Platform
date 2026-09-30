import { useQuery } from "@tanstack/react-query";
import { getTenantAnalytics, getOwnerAnalytics, getAdminAnalytics } from "@/api/analytics.api";

export const useTenantAnalytics = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ["analytics", "tenant", params],
    queryFn: () => getTenantAnalytics(params),
  });
};

export const useOwnerAnalytics = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ["analytics", "owner", params],
    queryFn: () => getOwnerAnalytics(params),
  });
};

export const useAdminAnalytics = (params?: Record<string, string>) => {
  return useQuery({
    queryKey: ["analytics", "admin", params],
    queryFn: () => getAdminAnalytics(params),
  });
};
