import { useQuery } from "@tanstack/react-query";
import {
  getAdminAnalytics,
  getOwnerAnalytics,
  getTenantAnalytics,
} from "@/api/analytics.api";

type AnalyticsQuery = Record<string, string | number | boolean>;

export const useAdminAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ["analytics", "admin", query],
    queryFn: () => getAdminAnalytics(query),
  });
};

export const useOwnerAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ["analytics", "owner", query],
    queryFn: () => getOwnerAnalytics(query),
  });
};

export const useTenantAnalytics = (query?: AnalyticsQuery) => {
  return useQuery({
    queryKey: ["analytics", "tenant", query],
    queryFn: () => getTenantAnalytics(query),
  });
};
