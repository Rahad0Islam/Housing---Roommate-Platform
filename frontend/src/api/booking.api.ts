import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const getBookings = async (query?: any): Promise<IApiResponse<any>> => {
  const queryParams = new URLSearchParams();
  if (query) {
    if (query.page) queryParams.append("page", query.page.toString());
    if (query.limit) queryParams.append("limit", query.limit.toString());
  }
  const queryString = queryParams.toString();
  const url = queryString ? `/bookings?${queryString}` : "/bookings";
  return await apiClient<IApiResponse<any>>(url, { method: "GET" });
};

export const cancelBooking = async (id: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/bookings/cancel/${id}`, { method: "PATCH" });
};

export const completeBooking = async (id: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/bookings/complete/${id}`, { method: "PATCH" });
};

export const onGoingBooking = async (id: string): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>(`/bookings/ongoing/${id}`, { method: "PATCH" });
};

export const createBooking = async (payload: { roomId: string; rentType: string; startDate: string; endDate: string }): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/bookings", {
    method: "POST",
    body: payload,
  });
};
