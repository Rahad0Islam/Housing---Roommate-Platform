import apiClient from "@/lib/apiClient";
import { ResponseEnvelope } from "@/types/api";

export interface TenantAnalytics {
  activeBookings: number;
  totalPaidRent: number;
  pendingBills: number;
  // Based on typical response
}

export interface OwnerAnalytics {
  totalBuildings: number;
  totalFlats: number;
  totalRooms: number;
  occupancyRate: number;
  totalRevenue: number;
  pendingPayments: number;
}

export interface AdminAnalytics {
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  totalProperties: number;
  totalRooms: number;
  totalBookings: number;
  totalRevenue: number;
}

export const getTenantAnalytics = async (params?: Record<string, string>) => {
  return apiClient<ResponseEnvelope<TenantAnalytics>>("/analytics/tenant", {
    method: "GET",
    query: params,
  });
};

export const getOwnerAnalytics = async (params?: Record<string, string>) => {
  return apiClient<ResponseEnvelope<OwnerAnalytics>>("/analytics/owner", {
    method: "GET",
    query: params,
  });
};

export const getAdminAnalytics = async (params?: Record<string, string>) => {
  return apiClient<ResponseEnvelope<AdminAnalytics>>("/analytics/admin", {
    method: "GET",
    query: params,
  });
};
