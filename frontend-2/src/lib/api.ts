const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
export type ApiResponse<T> = { success: boolean; message?: string; data: T };
export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
async function request<T>(
  path: string,
  init: RequestInit,
  canRefresh: boolean,
): Promise<T> {
  const form = init.body instanceof FormData;
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(form ? {} : { "Content-Type": "application/json" }),
      ...init.headers,
    },
  });
  if (
    response.status === 401 &&
    canRefresh &&
    !path.startsWith("/auth/refresh-token")
  ) {
    const refresh = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (refresh.ok) return request(path, init, false);
  }
  const payload = (await response.json().catch(() => ({}))) as ApiResponse<T>;
  if (!response.ok || payload.success === false)
    throw new ApiError(payload.message ?? "Request failed", response.status);
  return payload.data;
}
export function api<T>(path: string, init: RequestInit = {}) {
  return request<T>(path, init, true);
}
