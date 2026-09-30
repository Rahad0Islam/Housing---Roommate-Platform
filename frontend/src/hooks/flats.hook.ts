import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFlats, getFlatById, getFlatsByBuildingId, createFlat, updateFlat, deleteFlat } from "@/api/flats.api";

export const useFlats = () => {
  return useQuery({ queryKey: ["flats"], queryFn: getFlats });
};

export const useFlat = (id: string) => {
  return useQuery({
    queryKey: ["flats", id],
    queryFn: () => getFlatById(id),
    enabled: !!id,
  });
};

export const useFlatsByBuilding = (buildingId: string) => {
  return useQuery({
    queryKey: ["flats", "building", buildingId],
    queryFn: () => getFlatsByBuildingId(buildingId),
    enabled: !!buildingId,
  });
};

export const useCreateFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFlat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flats"] }),
  });
};

export const useUpdateFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateFlat(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["flats"] });
      queryClient.invalidateQueries({ queryKey: ["flats", id] });
    },
  });
};

export const useDeleteFlat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFlat,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flats"] }),
  });
};
