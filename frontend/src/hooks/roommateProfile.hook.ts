import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBestRoommateMatches, createRoommateProfile, getMyRoommateProfile, updateRoommateProfile } from "@/api/roommateProfile.api";
import { toast } from "sonner";

export const useBestRoommateMatches = () => {
  return useQuery({
    queryKey: ["roommateMatches"],
    queryFn: getBestRoommateMatches,
    retry: false, // Don't retry if it throws a 400 (e.g. they don't have a profile)
  });
};

export const useMyRoommateProfile = () => {
  return useQuery({
    queryKey: ["myRoommateProfile"],
    queryFn: getMyRoommateProfile,
    retry: false,
  });
};

export const useCreateRoommateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createRoommateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRoommateProfile"] });
      queryClient.invalidateQueries({ queryKey: ["roommateMatches"] });
      toast.success("Roommate profile created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create profile");
    }
  });
};

export const useUpdateRoommateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateRoommateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myRoommateProfile"] });
      queryClient.invalidateQueries({ queryKey: ["roommateMatches"] });
      toast.success("Roommate profile updated successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  });
};
