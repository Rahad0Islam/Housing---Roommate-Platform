import apiClient from "@/lib/apiClient";
import { Amenity, ResponseEnvelope } from "@/types/models";

export const getAmenities = async () => apiClient<ResponseEnvelope<Amenity[]>>("/amenities", { method: "GET" });
export const getAmenityById = async (id: string) => apiClient<ResponseEnvelope<Amenity>>(`/amenities/${id}`, { method: "GET" });
export const createAmenity = async (payload: any) => apiClient<ResponseEnvelope<Amenity>>("/amenities", { method: "POST", body: payload });
export const updateAmenity = async (id: string, payload: any) => apiClient<ResponseEnvelope<Amenity>>(`/amenities/${id}`, { method: "PATCH", body: payload });
export const deleteAmenity = async (id: string) => apiClient<ResponseEnvelope<Amenity>>(`/amenities/${id}`, { method: "DELETE" });
