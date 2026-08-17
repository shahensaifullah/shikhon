import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { getMessages } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getMessages(locale);
  return { title: messages.metadata.registerTitle, description: messages.metadata.registerDescription };
}

export default function RegisterPage() {
  return <RegisterForm />;
}
