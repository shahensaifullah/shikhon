import { create } from "zustand";

export type AuthUser = {
  id: string;
  phone_number: string;
  full_name: string;
  address: string;
  role: "student" | "parent" | "teacher" | "admin";
  subscription_tier: string;
};

type AuthStatus = "idle" | "loading" | "authenticated" | "anonymous";

type AuthState = {
  accessToken: string | null;
  accessTokenExpiresAt: number | null;
  user: AuthUser | null;
  status: AuthStatus;
  setAccessToken: (accessToken: string, expiresInSeconds?: number) => void;
  setSession: (session: { access: string; access_expires_in?: number; user: AuthUser }) => void;
  setUser: (user: AuthUser) => void;
  setStatus: (status: AuthStatus) => void;
  clearSession: () => void;
};

const fallbackLifetime = Number(process.env.NEXT_PUBLIC_ACCESS_TOKEN_FALLBACK_SECONDS ?? 300);

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  accessTokenExpiresAt: null,
  user: null,
  status: "idle",
  setAccessToken: (accessToken, expiresInSeconds = fallbackLifetime) => set({
    accessToken,
    accessTokenExpiresAt: Date.now() + expiresInSeconds * 1000,
  }),
  setSession: ({ access, access_expires_in = fallbackLifetime, user }) => set({
    accessToken: access,
    accessTokenExpiresAt: Date.now() + access_expires_in * 1000,
    user,
    status: "authenticated",
  }),
  setUser: (user) => set({ user, status: "authenticated" }),
  setStatus: (status) => set({ status }),
  clearSession: () => set({ accessToken: null, accessTokenExpiresAt: null, user: null, status: "anonymous" }),
}));
