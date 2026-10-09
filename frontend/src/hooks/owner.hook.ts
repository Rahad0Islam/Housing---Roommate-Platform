import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applyAsOwner, getAllOwnerApplications, approveOwnerApplication, rejectOwnerApplication } from "@/api/owner.api";
import { toast } from "sonner";

export const useApplyAsOwner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: applyAsOwner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["ownerApplications"] });
      toast.success("Application submitted successfully. Waiting for admin approval.");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to submit application");
    }
  });
};

export const useGetAllOwnerApplications = () => {
  return useQuery({
    queryKey: ["ownerApplications"],
    queryFn: getAllOwnerApplications,
  });
};

export const useApproveOwnerApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: approveOwnerApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownerApplications"] });
      toast.success("Owner application approved successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to approve application");
    }
  });
};

export const useRejectOwnerApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: rejectOwnerApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownerApplications"] });
      toast.success("Owner application rejected successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reject application");
    }
  });
};
