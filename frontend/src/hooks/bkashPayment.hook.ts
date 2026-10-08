import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBkashPayment, createBkashMonthlyPayment } from "@/api/bkashPayment.api";
import { toast } from "sonner";

export const useCreateBkashPayment = () => {
  return useMutation({
    mutationFn: createBkashPayment,
    onError: (error: any) => {
      toast.error(error.message || "Failed to initialize payment");
    }
  });
};

export const useCreateBkashMonthlyPayment = () => {
  return useMutation({
    mutationFn: createBkashMonthlyPayment,
    onError: (error: any) => {
      toast.error(error.message || "Failed to initialize monthly payment");
    }
  });
};
