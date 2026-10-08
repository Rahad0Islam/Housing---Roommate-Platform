import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const createMonthlyBill = async (payload: { flatId: string; utilityId: string; billingMonth: string; }): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/monthly-payments/create-monthly-bill", {
    method: "POST",
    body: payload,
  });
};

export const getAllMonthlyPayments = async (): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/monthly-payments/get-all-monthly-bills", {
    method: "GET",
  });
};
