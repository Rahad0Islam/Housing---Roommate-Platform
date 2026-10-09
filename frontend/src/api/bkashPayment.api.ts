import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/building.types"; // assuming generic response type is here

export const createBkashPayment = async (payload: { bookingId: string; paymentType: string }): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/bkash-payment/create-payment", {
    method: "POST",
    body: payload,
  });
};

export const createBkashMonthlyPayment = async (payload: { monthlyPayId: string; paymentType: string }): Promise<IApiResponse<any>> => {
  return await apiClient<IApiResponse<any>>("/bkash-payment/create-monthly-payment", {
    method: "POST",
    body: payload,
  });
};
