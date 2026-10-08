import { useMutation, useQuery } from "@tanstack/react-query";
import { getMe, googleLogin, userLogin, userLogout, userRegister, verifyAccount } from "@/api/auth.api";

export const useLogin = () => {
  return useMutation({
    mutationFn: userLogin,
  })
}

export const useRegister = () => {
  return useMutation({
    mutationFn: userRegister,
  })
}

export const useVerifyAccount = () => {
  return useMutation({
    mutationFn: verifyAccount
  })
}


export const useLogout = () => {
  return useMutation({
    mutationFn: userLogout,
  })
}


export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: googleLogin,
  });
}
export const useGetMe = () => {
  return  useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    retry: false,
  })
}

