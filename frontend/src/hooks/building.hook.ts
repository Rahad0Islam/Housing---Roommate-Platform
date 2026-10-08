import { useQuery } from "@tanstack/react-query";
import { getBuildingById, getBuildings, getOwnerBuildings } from "../api/building.api";
import { IBuildingSearchQuery } from "../types/building.types";

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
