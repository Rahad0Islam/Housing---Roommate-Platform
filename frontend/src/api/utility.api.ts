import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types";

export const getUtilityBills = async (): Promise<IApiResponse<any[]>> => {
  return await apiClient<IApiResponse<any[]>>("/utility-bills/get-all-utility-bills", { method: "GET" });
};

export const createUtilityBill = async (payload: { flatId: string; billingMonth: string; currentBill: number; gasBill: number; othersBill: number; }): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/utility-bills/create-utility-bill", {
    method: "POST",
    body: payload,
  });
};
