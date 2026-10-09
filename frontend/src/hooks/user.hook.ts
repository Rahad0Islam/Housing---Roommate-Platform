import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, blockUser, activateUser } from "@/api/user.api";
import { toast } from "sonner";

export const useUsers = (query?: any) => {
  return useQuery({
    queryKey: ["users", query],
    queryFn: () => getAllUsers(query),
  });
};

export const useBlockUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User blocked successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to block user");
    }
  });
};

export const useActivateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: activateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User activated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to activate user");
    }
  });
};
