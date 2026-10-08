"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api";
import {
  amenityApi,
  analyticsApi,
  bookingApi,
  buildingApi,
  flatApi,
  monthlyPaymentApi,
  ownerApi,
  paymentApi,
  roomApi,
  roommateApi,
  userApi,
  utilityApi,
} from "@/lib/api/domain";
import type { RentType } from "@/lib/contracts";
export const keys = {
  buildings: ["buildings"],
  flats: ["flats"],
  rooms: ["rooms"],
  amenities: ["amenities"],
  bookings: ["bookings"],
  payments: ["payments"],
  monthly: ["monthly-payments"],
  utilities: ["utilities"],
  roommates: ["roommates"],
  users: ["users"],
  analytics: ["analytics"],
} as const;
export function useBuildings(owner = false) {
  return useQuery({
    queryKey: [...keys.buildings, owner],
    queryFn: () => (owner ? buildingApi.ownerList() : buildingApi.list()),
  });
}
export function useBuilding(id?: string) {
  return useQuery({
    queryKey: [...keys.buildings, id],
    queryFn: () => buildingApi.get(id!),
    enabled: Boolean(id),
  });
}
export function useFlats(buildingId?: string) {
  return useQuery({
    queryKey: [...keys.flats, buildingId],
    queryFn: () => flatApi.list(buildingId!),
    enabled: Boolean(buildingId),
  });
}
export function useRooms(flatId?: string) {
  return useQuery({
    queryKey: [...keys.rooms, flatId],
    queryFn: () => roomApi.list(flatId!),
    enabled: Boolean(flatId),
  });
}
export function useBookings() {
  return useQuery({ queryKey: keys.bookings, queryFn: bookingApi.list });
}
export function useBooking(id?: string) {
  return useQuery({
    queryKey: [...keys.bookings, id],
    queryFn: () => bookingApi.get(id!),
    enabled: Boolean(id),
  });
}
export function useAnalytics(role: "tenant" | "owner" | "admin") {
  return useQuery({
    queryKey: [...keys.analytics, role],
    queryFn: () => analyticsApi.get(role),
  });
}
export function useUtilities() {
  return useQuery({ queryKey: keys.utilities, queryFn: utilityApi.list });
}
export function useMonthlyPayments() {
  return useQuery({
    queryKey: keys.monthly,
    queryFn: async () => {
      try {
        return await monthlyPaymentApi.list();
      } catch (error) {
        if (error instanceof ApiError && error.status === 404) return [];
        throw error;
      }
    },
  });
}
export function useRoommateProfile() {
  return useQuery({ queryKey: keys.roommates, queryFn: roommateApi.mine });
}
function useMutationAction<T>(
  fn: (value: T) => Promise<unknown>,
  invalidate: readonly unknown[],
) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => client.invalidateQueries({ queryKey: invalidate }),
  });
}
export const useCreateBuilding = () =>
  useMutationAction(
    (body: Record<string, unknown>) => buildingApi.create(body),
    keys.buildings,
  );
export const useDeleteBuilding = () =>
  useMutationAction((id: string) => buildingApi.remove(id), keys.buildings);
export const useCreateFlat = () =>
  useMutationAction(
    ({
      buildingId,
      body,
    }: {
      buildingId: string;
      body: Record<string, unknown>;
    }) => flatApi.create(buildingId, body),
    keys.flats,
  );
export const useDeleteFlat = () =>
  useMutationAction((id: string) => flatApi.remove(id), keys.flats);
export const useCreateRoom = () =>
  useMutationAction(
    ({ flatId, body }: { flatId: string; body: Record<string, unknown> }) =>
      roomApi.create(flatId, body),
    keys.rooms,
  );
export const useDeleteRoom = () =>
  useMutationAction((id: string) => roomApi.remove(id), keys.rooms);
export const useCreateAmenity = () =>
  useMutationAction(
    (body: Record<string, unknown>) => amenityApi.create(body),
    keys.amenities,
  );
export const useDeleteAmenity = () =>
  useMutationAction((id: string) => amenityApi.remove(id), keys.amenities);
export const useCreateBooking = () =>
  useMutationAction(
    (body: {
      roomId: string;
      rentType: RentType;
      startDate: string;
      endDate: string;
    }) => bookingApi.create(body),
    keys.bookings,
  );
export const useBookingAction = (action: "cancel" | "ongoing" | "complete") =>
  useMutationAction((id: string) => bookingApi[action](id), keys.bookings);
export const useCreateUtility = () =>
  useMutationAction(
    (body: Record<string, unknown>) => utilityApi.create(body),
    keys.utilities,
  );
export const useCreateMonthly = () =>
  useMutationAction(
    (body: Record<string, unknown>) => monthlyPaymentApi.create(body),
    keys.monthly,
  );
export const useCreatePayment = (monthly = false) =>
  useMutationAction(
    (body: Record<string, unknown>) =>
      monthly
        ? paymentApi.createMonthlyPayment(body)
        : paymentApi.createBookingPayment(body),
    keys.payments,
  );
export const useSaveRoommate = (update = false) =>
  useMutationAction(
    (body: Record<string, unknown>) =>
      update ? roommateApi.update(body) : roommateApi.create(body),
    keys.roommates,
  );
export const useDeleteRoommate = () =>
  useMutationAction(() => roommateApi.remove(), keys.roommates);
export function useMe() {
  return useQuery({ queryKey: ["me"], queryFn: userApi.me });
}
export const useUpdateBuilding = () =>
  useMutationAction(
    ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      buildingApi.update(id, body),
    keys.buildings,
  );
export const useUpdateFlat = () =>
  useMutationAction(
    ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      flatApi.update(id, body),
    keys.flats,
  );
export const useUpdateRoom = () =>
  useMutationAction(
    ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      roomApi.update(id, body),
    keys.rooms,
  );
export const useUpdateAmenity = () =>
  useMutationAction(
    ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      amenityApi.update(id, body),
    keys.amenities,
  );
export function useOwnerApplications() {
  return useQuery({
    queryKey: ["owner-applications"],
    queryFn: ownerApi.listApplications,
  });
}
export const useOwnerApplicationAction = (action: "approve" | "reject") =>
  useMutationAction(
    (id: string) => ownerApi[action](id),
    ["owner-applications"],
  );
