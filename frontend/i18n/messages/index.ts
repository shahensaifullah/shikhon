import "server-only";
import type { Locale } from "@/i18n/config";
import { sharedMessages } from "@/i18n/messages/shared";
import { homeMessages } from "@/i18n/messages/home";
import { authMessages } from "@/i18n/messages/auth";
import { studentMessages } from "@/i18n/messages/student";
import type { TranslationShape } from "@/i18n/messages/types";

const bn = {
  ...sharedMessages.bn,
  ...homeMessages.bn,
  ...authMessages.bn,
  ...studentMessages.bn,
};

export type Messages = TranslationShape<typeof bn>;

const en: Messages = {
  ...sharedMessages.en,
  ...homeMessages.en,
  ...authMessages.en,
  ...studentMessages.en,
};

const dictionaries: Record<Locale, Messages> = { bn, en };

export function getMessages(locale: Locale): Messages {
  return dictionaries[locale];
}
