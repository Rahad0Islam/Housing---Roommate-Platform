import apiClient from "@/lib/apiClient";
export const createBooking = async (payload: any) => apiClient("/bookings", { method: "POST", body: payload });
export const getAllBookings = async () => apiClient("/bookings", { method: "GET" });
export const getBookingById = async (id: string) => apiClient(`/bookings/${id}`, { method: "GET" });
export const cancelBooking = async (id: string) => apiClient(`/bookings/cancel/${id}`, { method: "PATCH" });
export const completeBooking = async (id: string) => apiClient(`/bookings/complete/${id}`, { method: "PATCH" });
