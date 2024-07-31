import type enUS from "@/locales/messages/en-US.json";

declare type IntlMessages = typeof enUS;

declare type IntlConfig<Messages = IntlMessages> = {
  /** All messages that will be available. */
  messages?: Messages;
};
