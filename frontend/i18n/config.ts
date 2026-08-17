export const locales = ["bn", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localeFromPathname(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : defaultLocale;
}

export function apiLanguage(locale: Locale) {
  return locale === "bn" ? "ban" : "eng";
}

export function localizeHref(locale: Locale, href: string) {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const segments = href.split("/");
  if (isLocale(segments[1] ?? "")) segments.splice(1, 1);
  const path = segments.join("/") || "/";
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
