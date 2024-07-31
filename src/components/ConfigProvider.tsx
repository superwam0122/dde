//定义了一个 ConfigProvider 组件，用于配置全局主题和国际化设置
import { ConfigProvider as AntdConfigProvider } from "antd";
import { useAtom } from "jotai";
import { type PropsWithChildren, useEffect } from "react";

import { eventEmitter } from "@/event";
import { localeAtom, messages } from "@/globals/locale";
import IntlProvider from "@/hooks/useIntl/IntlProvider";

import type { Locales } from "@/locales";
import type { ThemeConfig } from "antd";

const globalTheme: ThemeConfig = {    //定义了全局主题配置 globalTheme，设置了主色调和边框背景色
  token: {
    colorPrimary: "#FC4C02",
    colorBorderBg: "#E1E3E7",
  },
};

export default function ConfigProvider({ children }: PropsWithChildren) {  //使用 useAtom 钩子获取 messages 和 localeAtom 的值。messages 包含了应用的多语言文本，localeAtom 是当前的语言设置
  const [msg] = useAtom(messages);
  const [, setLocale] = useAtom(localeAtom);

  useEffect(() => {   //使用 useEffect 钩子在组件挂载时添加一个事件监听器，当 refresh_lang 事件被触发时，更新当前语言
    eventEmitter.on("refresh_lang", (lang: Locales) => {
      setLocale(lang);
    });
    return () => {
      eventEmitter.off("refresh_lang");
    };
  }, []);

  return (
    <IntlProvider messages={msg.app}>
      <AntdConfigProvider locale={msg.semi} theme={globalTheme}>
        {children}
      </AntdConfigProvider>
    </IntlProvider>
  );
}
