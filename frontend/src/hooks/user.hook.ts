import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, blockUser, activateUser } from "@/api/user.api";
import { toast } from "sonner";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error && typeof error === "object" && "data" in error) {
    const data = (error as { data?: { message?: string } }).data;
    if (data?.message) return data.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to block user"));
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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to activate user"));
    }
  });
};
