import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createFlat, updateFlat, deleteFlat, getFlatsByBuildingId, getFlatById } from "@/api/flat.api";
import { toast } from "sonner";

export const useFlatsByBuildingId = (buildingId: string) => {
  return useQuery({
    queryKey: ["flats", buildingId],
    queryFn: () => getFlatsByBuildingId(buildingId),
    enabled: !!buildingId,
  });
};

export const useFlatDetails = (flatId: string) => {
  return useQuery({
    queryKey: ["flat", flatId],
    queryFn: () => getFlatById(flatId),
    enabled: !!flatId,
  });
};

export const useCreateFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFlat,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["flats", variables.buildingId] });
      queryClient.invalidateQueries({ queryKey: ["building", variables.buildingId] });
      toast.success("Flat created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create flat");
    },
  });
};

export const useUpdateFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateFlat,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      queryClient.invalidateQueries({ queryKey: ["flat", data.data.id] });
      toast.success("Flat updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update flat");
    },
  });
};

export const useDeleteFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFlat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      toast.success("Flat deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete flat");
    },
  });
};
