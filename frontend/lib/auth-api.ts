import axios from "axios";
import type {AuthUser} from "@/src/stores/auth.store";
import {addLanguageQuery, currentLocale} from "@/lib/axios-language";

const authClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
    headers: {"Content-Type": "application/json"},
    withCredentials: true,
});
authClient.interceptors.request.use(addLanguageQuery);

export type OtpPurpose = "login" | "register";
export type AuthSession = {
    access: string;
    access_expires_in?: number;
    user: AuthUser;
};

export async function requestLoginOtp(phone: string) {
    const {data} = await authClient.post<{ detail: string; expires_in: number; development_code?: string }>(
        "/api/accounts/auth/otp/request",
        {phone_number: phone},
    );
    return data;
}

export async function registerAndSendOtp(input: { phone: string; fullName: string; address?: string }) {
  const { data } = await authClient.post<{ detail: string; expires_in: number; development_code?: string }>(
    "/api/accounts/auth/register",
    {
      phone_number: input.phone,
      full_name: input.fullName,
      address: input.address,
    },
  );
  return data;
}

export async function verifyOtp(input: { phone: string; code: string; purpose: OtpPurpose }) {
    const {data} = await authClient.post<AuthSession>("/api/accounts/auth/otp/verify", {
        phone_number: input.phone,
        code: input.code,
        purpose: input.purpose,
    });
    return data;
}

export async function logout() {
    await authClient.post("/api/accounts/auth/logout");
}

export type AuthApiError = {
    message: string;
    fields: Record<string, string>;
};

export function getAuthApiError(error: unknown): AuthApiError {
    const english = currentLocale() === "en";
    const fallback = {message: english ? "Something went wrong. Please try again." : "কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।", fields: {}};
    if (!axios.isAxiosError(error)) return fallback;
    if (!error.response) return {
        message: english ? "We could not reach the server. Check your connection and try again." : "সার্ভারের সঙ্গে সংযোগ করা যায়নি। ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।",
        fields: {}
    };

    const payload = error.response.data;
    if (!payload || typeof payload !== "object") return fallback;
    const fields: Record<string, string> = {};
    let message = "";
    for (const [key, rawValue] of Object.entries(payload as Record<string, unknown>)) {
        const value = Array.isArray(rawValue) ? rawValue.join(" ") : typeof rawValue === "string" ? rawValue : "";
        if (!value) continue;
        if (key === "detail" || key === "non_field_errors") message = value;
        else fields[key] = value;
    }
    return {message: message || (Object.keys(fields).length ? "" : fallback.message), fields};
}
