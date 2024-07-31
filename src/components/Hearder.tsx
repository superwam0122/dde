//Header 组件是一个简单的顶部导航栏，包含了网站的 Logo、标题和语言切换按钮。
//它的实现使用了 Ant Design 的 Button 组件和 createStyles 函数创建的样式，以及自定义的 LangSwitcher 组件和 useT 钩子实现的国际化功能
import { Button } from "antd";
import { createStyles } from "antd-style";

import { LangSwitcher } from "@/components/LangSwitcher";
import useT from "@/hooks/use-t";

export default function Header() {  //定义了一个无状态函数组件 Header，用于渲染页面顶部的 Header 区域
  const { styles } = blockStyles();
  const t = useT("site");

  return ( //一个 div 元素，用于显示 Logo，className 为 styles.logo；一个 div 元素，用于显示标题和语言切换按钮，className 为 styles.main
    <div className={styles.header}>
      <div className={styles.logo}>   
        <img src="/logo.svg" alt="" className={styles.img} />
      </div>
      <div className={styles.main}>
        <span className={styles.title}>{t("title")}</span>
        <LangSwitcher />
      </div>
    </div>
  );
}
const blockStyles = createStyles(({ css, token }) => ({
  header: css`
    border-bottom: 1px solid ${token.colorBorderBg};
    box-sizing: border-box;
    display: flex;
    align-items: stretch;
  `,
  main: css`
    display: flex;
    flex: 1;
    padding: 1rem;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    border-left: 1px solid ${token.colorBorderBg};
    border-right: 1px solid ${token.colorBorderBg};
  `,
  logo: css`
    padding: 0 1rem 0 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  img: css`
    width: 1.5rem;
    height: 1.5rem;
  `,
  title: css`
    font-weight: 500;
  `,
}));
