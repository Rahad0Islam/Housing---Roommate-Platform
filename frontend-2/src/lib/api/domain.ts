import { api } from "@/lib/api";
import type {
  Amenity,
  Booking,
  Building,
  Flat,
  ListResult,
  MonthlyPayment,
  Room,
  RoommateProfile,
  User,
  UtilityBill,
} from "@/lib/contracts";

export const buildingApi = {
  list: (query = "") =>
    api<ListResult<Building>>(`/buildings${query ? `?${query}` : ""}`),
  get: (id: string) => api<Building>(`/buildings/${id}`),
  ownerList: () => api<ListResult<Building>>("/buildings/owner"),
  create: (body: FormData | Record<string, unknown>) =>
    api<Building>("/buildings", {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  update: (id: string, body: FormData | Record<string, unknown>) =>
    api<Building>(`/buildings/${id}`, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  remove: (id: string) => api<null>(`/buildings/${id}`, { method: "DELETE" }),
};
export const flatApi = {
  list: (buildingId: string) =>
    api<ListResult<Flat>>(`/flats/get-flats/${buildingId}`),
  get: (id: string) => api<Flat>(`/flats/get-flat/${id}`),
  create: (buildingId: string, body: Record<string, unknown>) =>
    api<Flat>(`/flats/create-flat/${buildingId}`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Record<string, unknown>) =>
    api<Flat>(`/flats/update-flat/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    api<null>(`/flats/delete-flat/${id}`, { method: "DELETE" }),
};
export const roomApi = {
  list: (flatId: string) => api<ListResult<Room>>(`/rooms/flat/${flatId}`),
  get: (id: string) => api<Room>(`/rooms/${id}`),
  create: (flatId: string, body: FormData | Record<string, unknown>) =>
    api<Room>(`/rooms/${flatId}`, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  update: (id: string, body: FormData | Record<string, unknown>) =>
    api<Room>(`/rooms/${id}`, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),
  remove: (id: string) => api<null>(`/rooms/${id}`, { method: "DELETE" }),
};
export const amenityApi = {
  list: (buildingId: string) =>
    api<ListResult<Amenity>>(`/amenities/get-all-amenities/${buildingId}`),
  create: (body: Record<string, unknown>) =>
    api<Amenity>("/amenities/create-amenity", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (id: string, body: Record<string, unknown>) =>
    api<Amenity>(`/amenities/update-amenity/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: (id: string) =>
    api<null>(`/amenities/delete-amenity/${id}`, { method: "DELETE" }),
};
export const bookingApi = {
  list: () => api<ListResult<Booking>>("/bookings"),
  get: (id: string) => api<Booking>(`/bookings/${id}`),
  create: (body: {
    roomId: string;
    rentType: string;
    startDate: string;
    endDate: string;
  }) =>
    api<Booking>("/bookings", { method: "POST", body: JSON.stringify(body) }),
  cancel: (id: string) =>
    api<Booking>(`/bookings/cancel/${id}`, { method: "PATCH" }),
  ongoing: (id: string) =>
    api<Booking>(`/bookings/ongoing/${id}`, { method: "PATCH" }),
  complete: (id: string) =>
    api<Booking>(`/bookings/complete/${id}`, { method: "PATCH" }),
};
export const paymentApi = {
  createBookingPayment: (body: Record<string, unknown>) =>
    api<{ paymentUrl?: string; bkashURL?: string; redirectURL?: string }>(
      "/bkash-payment/create-payment",
      { method: "POST", body: JSON.stringify(body) },
    ),
  createMonthlyPayment: (body: Record<string, unknown>) =>
    api<{ paymentUrl?: string; bkashURL?: string; redirectURL?: string }>(
      "/bkash-payment/create-monthly-payment",
      { method: "POST", body: JSON.stringify(body) },
    ),
};
export const monthlyPaymentApi = {
  list: () =>
    api<ListResult<MonthlyPayment>>("/monthly-payments/get-all-monthly-bills"),
  get: (id: string) =>
    api<MonthlyPayment>(`/monthly-payments/get-monthly-bill/${id}`),
  create: (body: Record<string, unknown>) =>
    api<MonthlyPayment>("/monthly-payments/create-monthly-bill", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
export const utilityApi = {
  list: () =>
    api<ListResult<UtilityBill>>("/utility-bills/get-all-utility-bills"),
  get: (id: string) =>
    api<UtilityBill>(`/utility-bills/get-utility-bill/${id}`),
  byFlat: (id: string) =>
    api<ListResult<UtilityBill>>(
      `/utility-bills/get-utility-bill-by-flat/${id}`,
    ),
  create: (body: Record<string, unknown>) =>
    api<UtilityBill>("/utility-bills/create-utility-bill", {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
export const roommateApi = {
  mine: () => api<RoommateProfile>("/roommate-profiles/me"),
  list: (query = "") =>
    api<ListResult<RoommateProfile>>(
      `/roommate-profiles${query ? `?${query}` : ""}`,
    ),
  get: (id: string) => api<RoommateProfile>(`/roommate-profiles/${id}`),
  create: (body: Record<string, unknown>) =>
    api<RoommateProfile>("/roommate-profiles", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  update: (body: Record<string, unknown>) =>
    api<RoommateProfile>("/roommate-profiles", {
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  remove: () => api<null>("/roommate-profiles", { method: "DELETE" }),
};
export const userApi = {
  me: () => api<User>("/auth/me"),
  updateImage: (body: FormData) =>
    api<User>("/userprofileimage", { method: "POST", body }),
};
export const analyticsApi = {
  get: (role: "tenant" | "owner" | "admin") =>
    api<Record<string, unknown>>(`/analytics/${role}`),
};
export const ownerApi = {
  listApplications: () =>
    api<ListResult<User>>("/owners/all-owner-applications"),
  approve: (id: string) =>
    api<User>(`/owners/approve-owner-application/${id}`, { method: "PATCH" }),
  reject: (id: string) =>
    api<User>(`/owners/reject-owner-application/${id}`, { method: "PATCH" }),
};
