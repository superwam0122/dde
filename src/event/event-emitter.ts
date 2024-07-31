import type { IEventType } from ".";

export class EventEmitter {
  public callbacks: { [key in IEventType]: Function[] } = {} as any;

  public on(event: IEventType, fn: Function): this {    //注册事件
    if (!this.callbacks[event]) {
      this.callbacks[event] = [];
    }

    this.callbacks[event] = [...this.callbacks[event], fn];

    return this;
  }

  public emit(event: IEventType, ...args: any): this {  // 触发事件
    const callbacks = this.callbacks[event];

    if (callbacks) {
      callbacks.forEach((callback) => callback.apply(this, args));
    }

    return this;
  }

  public off(event: IEventType, fn?: Function): this {  // 移除特定事件的回调函数
    const callbacks = this.callbacks[event];

    if (callbacks) {
      if (fn) {
        this.callbacks[event] = callbacks.filter((callback) => callback !== fn);
      } else {
        delete (this.callbacks as any)[event];
      }
    }

    return this;
  }

  destroy(): void {      // 销毁所有事件回调函数
    this.callbacks = {} as any;
  }
}
