// @ts-nocheck
import { ofetch, FetchError } from "ofetch";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/v1";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token));
};

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

export const apiClient = ofetch.create({
  baseURL: BASE_URL,
  credentials: "include",
  async onResponseError({ request, response, options }) {
    if (response.status === 401 && request !== "/auth/refresh-token" && request !== "/auth/login") {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          await ofetch("/auth/refresh-token", {
            baseURL: BASE_URL,
            method: "POST",
            credentials: "include",
          });
          isRefreshing = false;
          onRefreshed("refreshed");
          refreshSubscribers = [];
        } catch (error) {
          isRefreshing = false;
          refreshSubscribers = [];
          // Possibly redirect to login or clear auth state
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
          // @ts-ignore
          return Promise.reject(error);
        }
      }

      // Wait for refresh to complete
      const retryOriginalRequest = new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(ofetch(request, options));
        });
      });
      // @ts-ignore
      return retryOriginalRequest;
    }
  },
});

export default apiClient;