import en_US from "antd/locale/en_US";
import zh_CN from "antd/locale/zh_CN";

import { triggerRefreshLang } from "@/event";

import enUS from "./messages/en-US.json";
import zhCN from "./messages/zh-CN.json";

import type { IntlMessages } from "@/hooks/useIntl";
import type { Locale } from "antd/es/locale";

export const languages = {
  "zh-CN": {
    app: zhCN,
    semi: zh_CN,
  },
  "en-US": {
    app: enUS,
    semi: en_US,
  },
};

export type Locales = keyof typeof languages;

export const defaultLocale: Locales = "en-US";

export const allLocales: string[] = Object.keys(languages);

export function getMessages(locale: Locales): {
  app: IntlMessages;
  semi: Locale;
} {
  return languages[locale] as any;
}

export function getLocale(): Locales {
  const locale = localStorage.getItem("locale") as Locales;
  return locale ?? defaultLocale;
}

export function setLocale(lang: Locales) {
  localStorage.setItem("locale", lang);
  triggerRefreshLang();
}
