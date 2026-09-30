import apiClient from "@/lib/apiClient";
export const createPayment = async (payload: any) => apiClient("/bkash-payment/create-payment", { method: "POST", body: payload });
export const createMonthlyPayment = async (payload: any) => apiClient("/bkash-payment/create-monthly-payment", { method: "POST", body: payload });
