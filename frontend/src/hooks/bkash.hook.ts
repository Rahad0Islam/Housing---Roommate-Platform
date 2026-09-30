import { useMutation } from "@tanstack/react-query";
import { createPayment, createMonthlyPayment } from "@/api/bkash.api";

export const useCreateBkashPayment = () => {
  return useMutation({
    mutationFn: createPayment,
  });
};

export const useCreateBkashMonthlyPayment = () => {
  return useMutation({
    mutationFn: createMonthlyPayment,
  });
};
