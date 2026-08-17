"use client";

import React, { createContext, useContext } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";

type I18nContextValue = { locale: Locale; messages: Messages };
const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ locale, messages, children }: I18nContextValue & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}
