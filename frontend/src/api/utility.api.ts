import apiClient from "@/lib/apiClient";
export const createUtilityBill = async (payload: any) => apiClient("/utility-bills/create-utility-bill", { method: "POST", body: payload });
export const getAllUtilityBills = async () => apiClient("/utility-bills/get-all-utility-bills", { method: "GET" });
export const getUtilityBillById = async (id: string) => apiClient(`/utility-bills/get-utility-bill/${id}`, { method: "GET" });
export const getUtilityBillByFlat = async (flatId: string) => apiClient(`/utility-bills/get-utility-bill-by-flat/${flatId}`, { method: "GET" });
