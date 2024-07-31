import React from "react";
import AntIcon from "@ant-design/icons";
import loadable from "@loadable/component";

// 定义一个 iconMap 对象，将图标类型映射到对应的动态加载的组件
const iconMap = {
  language: loadable(() => import("../assets/Icons/language.svg?react")),
  link: loadable(() => import("../assets/Icons/link.svg?react")),
  search: loadable(() => import("../assets/Icons/search.svg?react")),
  fullScreen: loadable(() => import("../assets/Icons/fullScreen.svg?react")),
  falseFullScreen: loadable(() => import("../assets/Icons/falseFullScreen.svg?react")),
  download: loadable(() => import("../assets/Icons/download.svg?react")),
  share: loadable(() => import("../assets/Icons/share.svg?react")),
  refresh: loadable(() => import("../assets/Icons/refresh.svg?react")),
  set: loadable(() => import("../assets/Icons/set.svg?react")),
  right: loadable(() => import("../assets/Icons/right.svg?react")),
  noData: loadable(() => import("../assets/Icons/noData.svg?react")),
};

// 定义 IconType 类型，表示图标的类型，它是 iconMap 对象的键之一
export type IconType = keyof typeof iconMap;

// 定义 IconProps 类型，继承了 AntIcon 组件的 props，并添加了一个 type 属性，表示图标的类型
export type IconProps = React.ComponentProps<typeof AntIcon> & {
  type: IconType;
};

// 定义一个无状态函数组件 Icon，用于渲染图标
export function Icon({ type, ...props }: IconProps) {
  // 使用 AntIcon 组件渲染图标，通过 component 属性加载动态组件
  return <AntIcon component={iconMap[type]} {...props} />;
}

export default Icon;
