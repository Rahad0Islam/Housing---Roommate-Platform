import { useQuery } from "@tanstack/react-query";
import { getAdminAnalytics, getOwnerAnalytics, getTenantAnalytics } from "@/api/analytics.api";

export const useAdminAnalytics = (query?: any) => {
  return useQuery({
    queryKey: ["analytics", "admin", query],
    queryFn: () => getAdminAnalytics(query),
  });
};

export const useOwnerAnalytics = (query?: any) => {
  return useQuery({
    queryKey: ["analytics", "owner", query],
    queryFn: () => getOwnerAnalytics(query),
  });
};

export const useTenantAnalytics = (query?: any) => {
  return useQuery({
    queryKey: ["analytics", "tenant", query],
    queryFn: () => getTenantAnalytics(query),
  });
};
