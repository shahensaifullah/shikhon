import type {InternalAxiosRequestConfig} from "axios";
import {apiLanguage, defaultLocale, localeFromPathname} from "@/i18n/config";

export function currentLocale() {
    return typeof window === "undefined" ? defaultLocale : localeFromPathname(window.location.pathname);
}

/** Adds the API language to every Axios request without call-site repetition. */
export function addLanguageQuery(config: InternalAxiosRequestConfig) {
    config.params = {...(config.params ?? {}), lang: apiLanguage(currentLocale())};
    return config;
}
