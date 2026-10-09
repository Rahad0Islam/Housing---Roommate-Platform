import apiClient from "@/lib/apiClient";
import { RegistrationPayload } from "@/types/auth.types";

export const userLogin = (payload: { email: string; password: string }) => {
  return apiClient("/auth/login", { method: "POST", body: payload });
};

export const userRegister = (payload: RegistrationPayload) => {
  return apiClient("/auth/register", { method: "POST", body: payload });
};

export const verifyAccount = (payload: { email: string; otp: string }) => {
  return apiClient("/auth/verify-email", { method: "POST", body: payload });
};

export const userLogout = () => {
  return apiClient("/auth/logout", { method: "POST" });
};

export const getMe = () => {
  return apiClient("/auth/me", { method: "GET" });
};

export const googleLogin = (payload: { idToken: string }) => {
  return apiClient("/auth/google", { method: "POST", body: payload });
};

export const forgotPassword = (payload: { email: string }) => {
  return apiClient("/auth/forgot-password", { method: "POST", body: payload });
};

export const resetPassword = (payload: {
  email: string;
  newPassword: string;
  otp: string;
}) => {
  return apiClient("/auth/reset-password", { method: "POST", body: payload });
};

export const changePassword = (payload: { oldPassword: string; newPassword: string }) => {
  return apiClient("/auth/change-password", { method: "POST", body: payload });
};

export const updateProfile = (payload: { name: string }) => {
  return apiClient("/users/me", { method: "PATCH", body: payload });
};

export const uploadProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("profileImage", file);

  // apiClient uses JSON by default, for FormData we might need to bypass it or configure it.
  // Assuming apiClient handles FormData if passed as body and headers aren't explicitly forced to application/json
  return apiClient("/users", { method: "POST", body: formData });
};
