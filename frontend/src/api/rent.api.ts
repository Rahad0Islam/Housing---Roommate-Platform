import apiClient from "@/lib/apiClient";
export const createMonthlyBill = async (payload: any) => apiClient("/monthly-payments/create-monthly-bill", { method: "POST", body: payload });
export const getAllMonthlyBills = async () => apiClient("/monthly-payments/get-all-monthly-bills", { method: "GET" });
export const getMonthlyBillById = async (id: string) => apiClient(`/monthly-payments/get-monthly-bill/${id}`, { method: "GET" });
