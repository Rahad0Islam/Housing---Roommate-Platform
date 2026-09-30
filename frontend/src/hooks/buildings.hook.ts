import { useQuery } from "@tanstack/react-query";
import { getAllBuildings, getBuildingById } from "@/api/buildings.api";

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
