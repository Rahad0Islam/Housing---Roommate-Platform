import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, googleLogin, userLogin, userLogout, verifyAccount, userRegister, forgotPassword, resetPassword } from "@/api/auth.api";
import { ResponseEnvelope } from "@/types/api";
import { User } from "@/types/models";

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogin,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
    },
  })
}

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userLogout,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
    },
  })
}

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: googleLogin,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ["currentUser"] });
    },
  });
}

export const useRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  });
}

export const useUser = () => {
  return useQuery<ResponseEnvelope<User>>({
    queryKey: ["currentUser"],
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
}

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
}


