import apiClient from "@/lib/apiClient";
import { Room, ResponseEnvelope } from "@/types/models";

export const getRooms = async () => apiClient<ResponseEnvelope<Room[]>>("/rooms", { method: "GET" });
export const getRoomById = async (id: string) => apiClient<ResponseEnvelope<Room>>(`/rooms/${id}`, { method: "GET" });
export const createRoom = async (payload: any) => apiClient<ResponseEnvelope<Room>>("/rooms", { method: "POST", body: payload });
export const updateRoom = async (id: string, payload: any) => apiClient<ResponseEnvelope<Room>>(`/rooms/${id}`, { method: "PATCH", body: payload });
export const deleteRoom = async (id: string) => apiClient<ResponseEnvelope<Room>>(`/rooms/${id}`, { method: "DELETE" });
export const getRoomsByFlatId = async (flatId: string) => apiClient<ResponseEnvelope<Room[]>>(`/rooms/flat/${flatId}`, { method: "GET" });
