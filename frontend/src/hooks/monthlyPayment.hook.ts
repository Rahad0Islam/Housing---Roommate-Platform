import { useQuery } from "@tanstack/react-query";
import { getAllMonthlyPayments } from "@/api/monthlyPayment.api";

export const useMonthlyPayments = () => {
  return useQuery({
    queryKey: ["monthlyPayments"],
    queryFn: () => getAllMonthlyPayments(),
  });
};
