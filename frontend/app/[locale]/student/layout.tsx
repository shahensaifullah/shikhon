import type { Metadata } from "next";
import { StudentShell } from "@/components/student-shell";
import { getMessages } from "@/i18n/messages";
import { isLocale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getMessages(locale);
  return { title: messages.metadata.studentTitle, description: messages.metadata.studentDescription };
}

export default function StudentLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <StudentShell>{children}</StudentShell>;
}
