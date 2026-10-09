import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getMe,
  googleLogin,
  userLogin,
  userLogout,
  userRegister,
  verifyAccount,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  uploadProfileImage,
} from "@/api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  });
};

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount,
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
  });
};

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
};
export const useGetMe = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: updateProfile,
  });
};

export const useUploadProfileImage = () => {
  return useMutation({
    mutationFn: uploadProfileImage,
  });
};
