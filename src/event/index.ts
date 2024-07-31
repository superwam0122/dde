//定义了一系列的事件和触发这些事件的函数，并使用EventEmitter类来管理这些事件的订阅和触发
import { EventEmitter } from "@/event/event-emitter";

import type { TimeScaleType } from "@/components/TimeScale";

export const eventEmitter = new EventEmitter();  //EventEmitter 类负责管理所有触发这些事件的函数

export type IEventType =
  | "refresh_lang"
  | "zoom_start"
  | "zoom_end"
  | "brush_start"
  | "brush_end"
  | "restore"
  | "save_image"
  | "timeScaleChange";

export type CheckReadyEvents = "check_form";

/** 刷新当前的语言 */
export const triggerRefreshLang = () => {
  eventEmitter.emit("refresh_lang");
};

/** 打开放大功能 */
export const zoomStart = () => {
  eventEmitter.emit("zoom_start");
};

/** 关闭放大功能 */
export const zoomEnd = () => {
  eventEmitter.emit("zoom_end");
};

/** 打开框选功能 */
export const brushStart = () => {
  eventEmitter.emit("brush_start");
};

/** 关闭框选功能 */
export const brushEnd = () => {
  eventEmitter.emit("brush_end");
};

/** 恢复图表到初始状态功能 */
export const restoreChart = () => {
  eventEmitter.emit("restore");
};

/** 保存为图片文件 */
export const saveImage = () => {
  eventEmitter.emit("save_image");
};

/** 时间轴变化 */
export const timeScaleChange = (data: TimeScaleType) => {
  eventEmitter.emit("timeScaleChange", data);
};
