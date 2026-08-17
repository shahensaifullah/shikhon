import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist_Mono, Noto_Sans_Bengali, Noto_Serif_Bengali } from "next/font/google";
import { I18nProvider } from "@/i18n/provider";
import { getMessages } from "@/i18n/messages";
import { isLocale, locales } from "@/i18n/config";
import "../globals.css";

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bangla",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-bangla-serif",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const messages = getMessages(locale);
  return {
    title: { default: messages.metadata.title, template: `%s | ${messages.common.brand}` },
    description: messages.metadata.description,
  };
}

export default async function RootLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const messages = getMessages(locale);
  return (
    <html lang={locale} className={`${notoSansBengali.variable} ${notoSerifBengali.variable} ${geistMono.variable}`}>
      <body><I18nProvider locale={locale} messages={messages}>{children}</I18nProvider></body>
    </html>
  );
}
