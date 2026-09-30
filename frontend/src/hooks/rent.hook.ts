import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createMonthlyBill, getAllMonthlyBills, getMonthlyBillById } from "@/api/rent.api";

export const useMonthlyBills = () => {
  return useQuery({
    queryKey: ["monthly-bills"],
    queryFn: getAllMonthlyBills,
  });
};

export const useMonthlyBill = (id: string) => {
  return useQuery({
    queryKey: ["monthly-bills", id],
    queryFn: () => getMonthlyBillById(id),
    enabled: !!id,
  });
};

export const useCreateMonthlyBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMonthlyBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monthly-bills"] });
    },
  });
};
