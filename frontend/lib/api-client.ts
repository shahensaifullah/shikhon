import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useAuthStore, type AuthUser } from "@/src/stores/auth.store";
import { addLanguageQuery, currentLocale } from "@/lib/axios-language";
import { localizeHref } from "@/i18n/config";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const refreshClient = axios.create({ baseURL: apiBaseUrl, withCredentials: true });
refreshClient.interceptors.request.use(addLanguageQuery);

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };
type RefreshResponse = { access: string; access_expires_in?: number };

let refreshRequest: Promise<RefreshResponse> | null = null;

apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return addLanguageQuery(config);
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryableRequest | undefined;
    if (error.response?.status !== 401 || !request || request._retry || request.url?.includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    request._retry = true;
    try {
      const session = await refreshAccessToken();
      request.headers.Authorization = `Bearer ${session.access}`;
      return apiClient(request);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      redirectToLogin();
      return Promise.reject(refreshError);
    }
  },
);

export async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = refreshClient
      .post<RefreshResponse>("/api/accounts/auth/refresh")
      .then(({ data }) => {
        useAuthStore.getState().setAccessToken(data.access, data.access_expires_in);
        return data;
      })
      .finally(() => { refreshRequest = null; });
  }
  return refreshRequest;
}

export async function restoreAuthSession() {
  const store = useAuthStore.getState();
  if (store.status === "loading" || store.status === "authenticated") return;
  store.setStatus("loading");
  try {
    await refreshAccessToken();
    const { data } = await apiClient.get<AuthUser>("/api/accounts/me");
    useAuthStore.getState().setUser(data);
  } catch {
    useAuthStore.getState().clearSession();
    redirectToLogin();
  }
}

function redirectToLogin() {
  if (typeof window === "undefined" || /\/(bn|en)\/login\/?$/.test(window.location.pathname)) return;
  const next = `${window.location.pathname}${window.location.search}`;
  window.location.replace(`${localizeHref(currentLocale(), "/login")}?session=expired&next=${encodeURIComponent(next)}`);
}
