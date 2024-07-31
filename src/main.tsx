//简单的React应用程序入口文件，它使用ReactDOM库将React组件渲染到HTML页面中的一个特定位置。
import React from "react";
import ReactDOM from "react-dom/client";


import ConfigProvider from "./components/ConfigProvider";
import Home from "./pages/home";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider>
      <Home />
    </ConfigProvider>
  </React.StrictMode>,
);


