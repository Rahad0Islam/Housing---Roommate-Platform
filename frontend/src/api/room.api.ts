import apiClient from "@/lib/apiClient";
import { IApiResponse, IRoom } from "@/types/building.types";

export const createRoom = async (payload: { flatId: string; data: FormData }) => {
  return await apiClient<IApiResponse<IRoom>>(`/rooms/${payload.flatId}`, {
    method: "POST",
    body: payload.data, // FormData for file upload
  });
};

export const updateRoom = async (payload: { roomId: string; data: FormData }) => {
  return await apiClient<IApiResponse<IRoom>>(`/rooms/${payload.roomId}`, {
    method: "PATCH",
    body: payload.data,
  });
};

export const deleteRoom = async (roomId: string) => {
  return await apiClient<IApiResponse<null>>(`/rooms/${roomId}`, {
    method: "DELETE",
  });
};

export const getRoomById = async (roomId: string) => {
  return await apiClient<IApiResponse<IRoom>>(`/rooms/${roomId}`, {
    method: "GET",
  });
};

export const getRoomsByFlatId = async (flatId: string) => {
  return await apiClient<IApiResponse<IRoom[]>>(`/rooms/flat/${flatId}`, {
    method: "GET",
  });
};
