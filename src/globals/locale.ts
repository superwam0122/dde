import { atom } from "jotai";

import { getLocale, getMessages } from "@/locales";

import type { Locales } from "@/locales";

export const language = atom(getLocale());
export const messages = atom((get) => {
  const locale = get(language);
  return getMessages(locale);
});

export const localeAtom = atom(
  (get) => get(language),
  async (_get, set, lang: Locales) => {
    set(language, lang);
    localStorage.setItem("locale", lang);
  },
);
