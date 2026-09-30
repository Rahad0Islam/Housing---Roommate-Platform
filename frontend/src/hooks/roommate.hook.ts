import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoommateProfile, getMyRoommateProfile, updateMyRoommateProfile, deleteMyRoommateProfile, getAllRoommateProfiles, getRoommateProfileById } from "@/api/roommate.api";

export const useRoommateProfiles = () => {
  return useQuery({
    queryKey: ["roommate-profiles"],
    queryFn: getAllRoommateProfiles,
  });
};

export const useRoommateProfile = (id: string) => {
  return useQuery({
    queryKey: ["roommate-profiles", id],
    queryFn: () => getRoommateProfileById(id),
    enabled: !!id,
  });
};

export const useMyRoommateProfile = () => {
  return useQuery({
    queryKey: ["roommate-profiles", "me"],
    queryFn: getMyRoommateProfile,
  });
};

export const useCreateRoommateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRoommateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roommate-profiles"] });
    },
  });
};

export const useUpdateMyRoommateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMyRoommateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roommate-profiles", "me"] });
    },
  });
};

export const useDeleteMyRoommateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMyRoommateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roommate-profiles"] });
    },
  });
};
