//组件实现了一个语言切换功能，通过 Dropdown 显示可用语言选项，并允许用户点击切换当前语言。
//组件灵活，允许传入自定义的图标、样式和处理语言数据的回调函数
import { Dropdown } from "antd";
import { useAtom } from "jotai";
import React from "react";

import { localeAtom } from "@/globals/locale";
import { allLocales } from "@/locales";

import { Icon } from "./Icon";

import type { MenuProps } from "antd";

interface LocalData {
  lang: string;
  label?: string;
  icon?: string;
  title?: string;
}

interface LangSwitcherProps {
  className?: string;
  postLocalesData?: (locales: LocalData[]) => LocalData[];
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

const defaultLangUConfigMap: Record<
  string,
  {
    lang: string;
    label: string;
    icon: string;
    title: string;
  }
> = {
  "ar-EG": {
    lang: "ar-EG",
    label: "العربية",
    icon: "🇪🇬",
    title: "لغة",
  },
  "az-AZ": {
    lang: "az-AZ",
    label: "Azərbaycan dili",
    icon: "🇦🇿",
    title: "Dil",
  },
  "bg-BG": {
    lang: "bg-BG",
    label: "Български език",
    icon: "🇧🇬",
    title: "език",
  },
  "bn-BD": {
    lang: "bn-BD",
    label: "বাংলা",
    icon: "🇧🇩",
    title: "ভাষা",
  },
  "ca-ES": {
    lang: "ca-ES",
    label: "Catalá",
    icon: "🇨🇦",
    title: "llengua",
  },
  "cs-CZ": {
    lang: "cs-CZ",
    label: "Čeština",
    icon: "🇨🇿",
    title: "Jazyk",
  },
  "da-DK": {
    lang: "da-DK",
    label: "Dansk",
    icon: "🇩🇰",
    title: "Sprog",
  },
  "de-DE": {
    lang: "de-DE",
    label: "Deutsch",
    icon: "🇩🇪",
    title: "Sprache",
  },
  "el-GR": {
    lang: "el-GR",
    label: "Ελληνικά",
    icon: "🇬🇷",
    title: "Γλώσσα",
  },
  "en-GB": {
    lang: "en-GB",
    label: "English",
    icon: "🇬🇧",
    title: "Language",
  },
  "en-US": {
    lang: "en-US",
    label: "English",
    icon: "🇺🇸",
    title: "Language",
  },
  "es-ES": {
    lang: "es-ES",
    label: "Español",
    icon: "🇪🇸",
    title: "Idioma",
  },
  "et-EE": {
    lang: "et-EE",
    label: "Eesti",
    icon: "🇪🇪",
    title: "Keel",
  },
  "fa-IR": {
    lang: "fa-IR",
    label: "فارسی",
    icon: "🇮🇷",
    title: "زبان",
  },
  "fi-FI": {
    lang: "fi-FI",
    label: "Suomi",
    icon: "🇫🇮",
    title: "Kieli",
  },
  "fr-BE": {
    lang: "fr-BE",
    label: "Français",
    icon: "🇧🇪",
    title: "Langue",
  },
  "fr-FR": {
    lang: "fr-FR",
    label: "Français",
    icon: "🇫🇷",
    title: "Langue",
  },
  "ga-IE": {
    lang: "ga-IE",
    label: "Gaeilge",
    icon: "🇮🇪",
    title: "Teanga",
  },
  "he-IL": {
    lang: "he-IL",
    label: "עברית",
    icon: "🇮🇱",
    title: "שפה",
  },
  "hi-IN": {
    lang: "hi-IN",
    label: "हिन्दी, हिंदी",
    icon: "🇮🇳",
    title: "भाषा: हिन्दी",
  },
  "hr-HR": {
    lang: "hr-HR",
    label: "Hrvatski jezik",
    icon: "🇭🇷",
    title: "Jezik",
  },
  "hu-HU": {
    lang: "hu-HU",
    label: "Magyar",
    icon: "🇭🇺",
    title: "Nyelv",
  },
  "hy-AM": {
    lang: "hu-HU",
    label: "Հայերեն",
    icon: "🇦🇲",
    title: "Լեզու",
  },
  "id-ID": {
    lang: "id-ID",
    label: "Bahasa Indonesia",
    icon: "🇮🇩",
    title: "Bahasa",
  },
  "it-IT": {
    lang: "it-IT",
    label: "Italiano",
    icon: "🇮🇹",
    title: "Linguaggio",
  },
  "is-IS": {
    lang: "is-IS",
    label: "Íslenska",
    icon: "🇮🇸",
    title: "Tungumál",
  },
  "ja-JP": {
    lang: "ja-JP",
    label: "日本語",
    icon: "🇯🇵",
    title: "言語",
  },
  "ku-IQ": {
    lang: "ku-IQ",
    label: "کوردی",
    icon: "🇮🇶",
    title: "Ziman",
  },
  "kn-IN": {
    lang: "kn-IN",
    label: "ಕನ್ನಡ",
    icon: "🇮🇳",
    title: "ಭಾಷೆ",
  },
  "ko-KR": {
    lang: "ko-KR",
    label: "한국어",
    icon: "🇰🇷",
    title: "언어",
  },
  "lv-LV": {
    lang: "lv-LV",
    label: "Latviešu valoda",
    icon: "🇱🇮",
    title: "Kalba",
  },
  "mk-MK": {
    lang: "mk-MK",
    label: "македонски јазик",
    icon: "🇲🇰",
    title: "Јазик",
  },
  "mn-MN": {
    lang: "mn-MN",
    label: "Монгол хэл",
    icon: "🇲🇳",
    title: "Хэл",
  },
  "ms-MY": {
    lang: "ms-MY",
    label: "بهاس ملايو‎",
    icon: "🇲🇾",
    title: "Bahasa",
  },
  "nb-NO": {
    lang: "nb-NO",
    label: "Norsk",
    icon: "🇳🇴",
    title: "Språk",
  },
  "ne-NP": {
    lang: "ne-NP",
    label: "नेपाली",
    icon: "🇳🇵",
    title: "भाषा",
  },
  "nl-BE": {
    lang: "nl-BE",
    label: "Vlaams",
    icon: "🇧🇪",
    title: "Taal",
  },
  "nl-NL": {
    lang: "nl-NL",
    label: "Vlaams",
    icon: "🇳🇱",
    title: "Taal",
  },
  "pl-PL": {
    lang: "pl-PL",
    label: "Polski",
    icon: "🇵🇱",
    title: "Język",
  },
  "pt-BR": {
    lang: "pt-BR",
    label: "Português",
    icon: "🇧🇷",
    title: "Idiomas",
  },
  "pt-PT": {
    lang: "pt-PT",
    label: "Português",
    icon: "🇵🇹",
    title: "Idiomas",
  },
  "ro-RO": {
    lang: "ro-RO",
    label: "Română",
    icon: "🇷🇴",
    title: "Limba",
  },
  "ru-RU": {
    lang: "ru-RU",
    label: "Русский",
    icon: "🇷🇺",
    title: "язык",
  },
  "sk-SK": {
    lang: "sk-SK",
    label: "Slovenčina",
    icon: "🇸🇰",
    title: "Jazyk",
  },
  "sr-RS": {
    lang: "sr-RS",
    label: "српски језик",
    icon: "🇸🇷",
    title: "Језик",
  },
  "sl-SI": {
    lang: "sl-SI",
    label: "Slovenščina",
    icon: "🇸🇱",
    title: "Jezik",
  },
  "sv-SE": {
    lang: "sv-SE",
    label: "Svenska",
    icon: "🇸🇪",
    title: "Språk",
  },
  "ta-IN": {
    lang: "ta-IN",
    label: "தமிழ்",
    icon: "🇮🇳",
    title: "மொழி",
  },
  "th-TH": {
    lang: "th-TH",
    label: "ไทย",
    icon: "🇹🇭",
    title: "ภาษา",
  },
  "tr-TR": {
    lang: "tr-TR",
    label: "Türkçe",
    icon: "🇹🇷",
    title: "Dil",
  },
  "uk-UA": {
    lang: "uk-UA",
    label: "Українська",
    icon: "🇺🇰",
    title: "Мова",
  },
  "vi-VN": {
    lang: "vi-VN",
    label: "Tiếng Việt",
    icon: "🇻🇳",
    title: "Ngôn ngữ",
  },
  "zh-CN": {
    lang: "zh-CN",
    label: "简体中文",
    icon: "🇨🇳",
    title: "语言",
  },
  "zh-TW": {
    lang: "zh-TW",
    label: "繁體中文",
    icon: "🇭🇰",
    title: "語言",
  },
};

export const LangSwitcher: React.FC<LangSwitcherProps> = (props) => {
  const { className, postLocalesData, icon, style, ...restProps } = props;
  const [locale, setLocale] = useAtom(localeAtom);

  const defaultLangUConfig = allLocales.map(
    (key) =>
      defaultLangUConfigMap[key] || {
        lang: key,
        label: key,
        icon: "🌐",
        title: key,
      },
  );

  const allLangUIConfig =
    postLocalesData?.(defaultLangUConfig) || defaultLangUConfig;

  const menuItemIconStyle = { marginRight: "8px" };

  const inlineStyle = {
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    verticalAlign: "middle",
    ...style,
  };

  const items: MenuProps["items"] = allLangUIConfig.map((item) => ({
    key: item.lang,
    label: (
      <div onClick={() => setLocale(item.lang as any)}>
        <span
          role="img"
          aria-label={item?.label || "en-US"}
          style={menuItemIconStyle}
        >
          {item?.icon || "🌐"}
        </span>
        {item?.label || "en-US"}
      </div>
    ),
  }));

  return (
    <Dropdown
      menu={{
        items,
        selectable: true,
        selectedKeys: [locale],
      }}
      {...restProps}
    >
      <div
        className={className}
        style={inlineStyle}
        role={"button"}
        tabIndex={0}
      >
        {icon ? icon : <Icon type="language" />}
      </div>
    </Dropdown>
  );
};
