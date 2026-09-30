import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAmenities, getAmenityById, createAmenity, updateAmenity, deleteAmenity } from "@/api/amenities.api";

export const useAmenities = () => {
  return useQuery({ queryKey: ["amenities"], queryFn: getAmenities });
};

export const useAmenity = (id: string) => {
  return useQuery({
    queryKey: ["amenities", id],
    queryFn: () => getAmenityById(id),
    enabled: !!id,
  });
};

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAmenity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["amenities"] }),
  });
};

export const useUpdateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => updateAmenity(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      queryClient.invalidateQueries({ queryKey: ["amenities", id] });
    },
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["amenities"] }),
  });
};
