import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllBuildings, getBuildingById, getOwnerBuildings, createBuilding, updateBuilding, deleteBuilding } from "@/api/buildings.api";

export const useBuildings = (params?: Record<string, string | number>) => {
  return useQuery({
    queryKey: ["buildings", params],
    queryFn: () => getAllBuildings(params),
  });
};

export const useBuilding = (id: string) => {
  return useQuery({
    queryKey: ["buildings", id],
    queryFn: () => getBuildingById(id),
    enabled: !!id,
  });
};

export const useOwnerBuildings = () => {
  return useQuery({
    queryKey: ["buildings", "owner"],
    queryFn: getOwnerBuildings,
  });
};

export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateBuilding(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["buildings", id] });
    },
  });
};

export const useDeleteBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBuilding,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};
