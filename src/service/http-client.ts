//自定义的axios实例request，并配置了请求和响应拦截器，以处理常见的HTTP请求错误。
import { message } from "antd";
import axios from "axios";

import type {
  Axios,
  AxiosDefaults,
  AxiosHeaderValue,
  AxiosRequestConfig,
  HeadersDefaults,
} from "axios";

export interface AxiosInstance extends Axios {
  <T = any, D = any>(config: AxiosRequestConfig<D>): Promise<T>;
  <T = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<T>;

  defaults: Omit<AxiosDefaults, "headers"> & {
    headers: HeadersDefaults & {
      [key: string]: AxiosHeaderValue;
    };
  };
}

export const request = axios.create({
  timeout: 10 * 60 * 1000,        //创建一个自定义的axios实例request，设置了超时时间为10分钟，并允许携带凭证（如cookie）
  withCredentials: true,
}) as AxiosInstance;

const isBrowser = typeof window !== "undefined";   //isBrowser变量用于判断当前环境是否为浏览器环境，以便在浏览器环境中显示错误消息

request.interceptors.response.use(
  (data) => {
    return data.data;
  },
  (err) => {
    if (err && err.response && err.response.status) {
      const status = err.response.status;

      switch (status) {
        case 504:
        case 404:
          isBrowser &&
            message.error(
              (err.response && err.response.data && err.response.data.msg) ||
                "服务器异常",
            );
          break;
        case 401:
          if (isBrowser) {
            window.localStorage.removeItem("user");
            window.localStorage.removeItem("token");
          }
          break;
        case 429:
          message.error("请求过于频繁，请稍候再试！");
          break;
        default:
          isBrowser &&
            message.error(
              (err.response && err.response.data && err.response.data.msg) ||
                "未知错误!",
            );
      }
      return Promise.reject({
        code: err.response.status,
        message: err.response.data.msg,
      });
    }

    return Promise.reject(err);
  },
);
