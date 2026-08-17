import type {Metadata} from "next";
import {LoginForm} from "@/components/auth/login-form";
import {getMessages} from "@/i18n/messages";
import {isLocale} from "@/i18n/config";

export async function generateMetadata({params}: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const {locale} = await params;
    if (!isLocale(locale)) return {};
    const messages = getMessages(locale);
    return {title: messages.metadata.loginTitle, description: messages.metadata.loginDescription};
}

export default async function LoginPage({searchParams}: {
    searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
    const params = await searchParams;
    return (
        <LoginForm
            initialPhone={typeof params.phone === "string" ? params.phone : ""}
            sessionExpired={params.session === "expired"}
            nextPath={typeof params.next === "string" ? params.next : "/student"}
        />
    );
}
