import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBuildingById, getBuildings, getOwnerBuildings, createBuilding, updateBuilding, deleteBuilding } from "../api/building.api";
import { IBuildingSearchQuery } from "../types/building.types";
import { toast } from "sonner";

export const useBuildings = (query?: IBuildingSearchQuery) => {
  return useQuery({
    queryKey: ["buildings", query],
    queryFn: () => getBuildings(query),
  });
};

export const useBuildingDetails = (id: string) => {
  return useQuery({
    queryKey: ["building", id],
    queryFn: () => getBuildingById(id),
    enabled: !!id,
  });
};

export const useOwnerBuildings = (query?: IBuildingSearchQuery) => {
  return useQuery({
    queryKey: ["ownerBuildings", query],
    queryFn: () => getOwnerBuildings(query),
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["ownerBuildings"] });
      toast.success("Building created successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create building");
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBuilding,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["ownerBuildings"] });
      queryClient.invalidateQueries({ queryKey: ["building", data.data.id] });
      toast.success("Building updated successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update building");
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["ownerBuildings"] });
      toast.success("Building deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to delete building");
    },
  });
};
