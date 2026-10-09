import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createUtilityBill, getUtilityBills } from "@/api/utility.api";
import { createMonthlyBill } from "@/api/monthlyPayment.api";
import { toast } from "sonner";

export const useUtilityBills = () => {
  return useQuery({
    queryKey: ["utility-bills"],
    queryFn: () => getUtilityBills(),
  });
};

export const useCreateUtilityBill = () => {
  return useMutation({
    mutationFn: createUtilityBill,
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create utility bill");
    },
  });
};

export const useCreateMonthlyBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMonthlyBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["utility-bills"] });
      toast.success("Utility & Monthly Bill created successfully!");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create monthly bill");
    },
  });
};
