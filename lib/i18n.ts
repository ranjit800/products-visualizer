import enCommon from "@/locales/en/common.json";
import hiCommon from "@/locales/hi/common.json";

export type Locale = "en" | "hi";

export const DEFAULT_LOCALE: Locale = "en";

export type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  en: enCommon,
  hi: hiCommon,
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function t(dict: Dictionary, key: string): string {
  return dict[key] ?? key;
}

