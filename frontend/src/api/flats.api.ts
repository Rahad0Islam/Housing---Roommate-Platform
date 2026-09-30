import apiClient from "@/lib/apiClient";
import { Flat, ResponseEnvelope } from "@/types/models";

export const getFlats = async () => apiClient<ResponseEnvelope<Flat[]>>("/flats", { method: "GET" });
export const getFlatById = async (id: string) => apiClient<ResponseEnvelope<Flat>>(`/flats/${id}`, { method: "GET" });
export const createFlat = async (payload: any) => apiClient<ResponseEnvelope<Flat>>("/flats", { method: "POST", body: payload });
export const updateFlat = async (id: string, payload: any) => apiClient<ResponseEnvelope<Flat>>(`/flats/${id}`, { method: "PATCH", body: payload });
export const deleteFlat = async (id: string) => apiClient<ResponseEnvelope<Flat>>(`/flats/${id}`, { method: "DELETE" });
export const getFlatsByBuildingId = async (buildingId: string) => apiClient<ResponseEnvelope<Flat[]>>(`/flats/building/${buildingId}`, { method: "GET" });
