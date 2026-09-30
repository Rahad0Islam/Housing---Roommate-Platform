import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createUtilityBill, getAllUtilityBills, getUtilityBillById, getUtilityBillByFlat } from "@/api/utility.api";

export const useUtilityBills = () => {
  return useQuery({
    queryKey: ["utility-bills"],
    queryFn: getAllUtilityBills,
  });
};

export const useUtilityBill = (id: string) => {
  return useQuery({
    queryKey: ["utility-bills", id],
    queryFn: () => getUtilityBillById(id),
    enabled: !!id,
  });
};

export const useUtilityBillByFlat = (flatId: string) => {
  return useQuery({
    queryKey: ["utility-bills", "flat", flatId],
    queryFn: () => getUtilityBillByFlat(flatId),
    enabled: !!flatId,
  });
};

export const useCreateUtilityBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUtilityBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-bills"] });
    },
  });
};
