import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAmenity,
  deleteAmenity,
  getBuildingAmenities,
  AmenityPayload,
} from "@/api/amenity.api";

export const useBuildingAmenities = (buildingId?: string) =>
  useQuery({
    queryKey: ["amenities", buildingId],
    queryFn: () => getBuildingAmenities(buildingId as string),
    enabled: !!buildingId,
  });

export const useCreateAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AmenityPayload) => createAmenity(payload),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["amenities", response.data.buildingId],
      });
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["ownerBuildings"] });
      toast.success("Amenity added");
    },
    onError: () => toast.error("Failed to add amenity"),
  });
};

export const useDeleteAmenity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAmenity,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["amenities"] });
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["ownerBuildings"] });
      toast.success("Amenity removed");
    },
    onError: () => toast.error("Failed to remove amenity"),
  });
};
