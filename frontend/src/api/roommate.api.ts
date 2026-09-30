import apiClient from "@/lib/apiClient";
export const createRoommateProfile = async (payload: any) => apiClient("/roommate-profiles", { method: "POST", body: payload });
export const getMyRoommateProfile = async () => apiClient("/roommate-profiles/me", { method: "GET" });
export const updateMyRoommateProfile = async (payload: any) => apiClient("/roommate-profiles/me", { method: "PATCH", body: payload });
export const deleteMyRoommateProfile = async () => apiClient("/roommate-profiles/me", { method: "DELETE" });
export const getAllRoommateProfiles = async () => apiClient("/roommate-profiles", { method: "GET" });
export const getRoommateProfileById = async (id: string) => apiClient(`/roommate-profiles/${id}`, { method: "GET" });
