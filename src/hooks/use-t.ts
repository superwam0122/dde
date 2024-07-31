import { getLocale, getMessages } from "@/locales";
import { translateFunc } from "./useIntl/translateFunc";
import useIntlContext from "./useIntl/useIntlContext";
import type { IntlMessages } from "./useIntl";

// 获取对象中嵌套键的类型
export type NestedKeyOf<ObjectType> = ObjectType extends object
  ? {
      [Key in keyof ObjectType]:
        | `${Key & string}`
        | `${Key & string}.${NestedKeyOf<ObjectType[Key]>}`;
    }[keyof ObjectType]
  : never;

// 获取对象中嵌套值的类型
export type NestedValueOf<ObjectType, Property extends string> = 
  Property extends `${infer Key}.${infer Rest}`
    ? Key extends keyof ObjectType
      ? NestedValueOf<ObjectType[Key], Rest>
      : never
    : Property extends keyof ObjectType
      ? ObjectType[Property]
      : never;

// 获取命名空间键
export type NamespaceKeys<ObjectType, Keys extends string> = {
  [Property in Keys]: NestedValueOf<ObjectType, Property> extends string
    ? never
    : Property;
}[Keys];

// 获取消息键
export type MessageKeys<ObjectType, Keys extends string> = {
  [Property in Keys]: NestedValueOf<ObjectType, Property> extends string
    ? Property
    : never;
}[Keys];

// React hook，用于在组件中获取翻译函数
export default function useT<
  NestedKey extends NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>> = never,
>(namespace?: NestedKey) {
  const context = useIntlContext(); // 获取国际化上下文
  const { messages } = context;

  return (
    id: MessageKeys<
      NestedValueOf<
        {
          "!": IntlMessages;
        },
        [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
      >,
      NestedKeyOf<
        NestedValueOf<
          {
            "!": IntlMessages;
          },
          [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
        >
      >
    >,
    values?: Record<string, any>,
  ) =>
    translateFunc(
      messages,
      namespace ? `${namespace}.${String(id)}` : id,
      values,
    );
}

// 异步函数，用于在非组件环境中获取翻译函数
export async function getT<
  Intl = IntlMessages,
  NestedKey extends NamespaceKeys<Intl, NestedKeyOf<Intl>> = never,
>(namespace?: NestedKey) {
  const locale = getLocale(); // 获取当前语言环境
  const messages = await getMessages(locale); // 获取翻译消息

  return (
    id: MessageKeys<
      NestedValueOf<
        {
          "!": Intl;
        },
        [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
      >,
      NestedKeyOf<
        NestedValueOf<
          {
            "!": Intl;
          },
          [NestedKey] extends [never] ? "!" : `!.${NestedKey}`
        >
      >
    >,
    values?: Record<string, any>,
  ) =>
    translateFunc(
      messages,
      namespace ? `${namespace}.${String(id)}` : id,
      values,
    );
}
