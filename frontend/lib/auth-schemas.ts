import {z} from "zod";
import type {Messages} from "@/i18n/messages";

type ValidationMessages = Messages["validation"];

export function createBangladeshPhoneSchema(messages: ValidationMessages) {
    return z.string().regex(/^01[3-9]\d{8}$/, messages.phone);
}

export function createRegisterSchema(messages: ValidationMessages) {
    return z.object({
        fullName: z.string().trim().min(2, messages.nameRequired).max(150, messages.nameMax),
        phone: createBangladeshPhoneSchema(messages),
        address: z.string().trim().max(500, messages.addressMax),
        terms: z.boolean().refine(Boolean, messages.terms),
    });
}

export function createLoginPhoneSchema(messages: ValidationMessages) {
    return z.object({phone: createBangladeshPhoneSchema(messages)});
}

export function createOtpSchema(messages: ValidationMessages) {
    return z.object({code: z.string().regex(/^\d{6}$/, messages.otp)});
}

export type RegisterFormValues = { fullName: string; phone: string; address: string; terms: boolean };
export type LoginPhoneFormValues = { phone: string };
export type OtpFormValues = { code: string };

export function toBangladeshE164(phone: string) {
    return `+88${phone}`;
}
