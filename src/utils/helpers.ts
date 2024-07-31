import type { Selection } from "d3";

export function getTextWidth(text: string, font: string) {  //函数用于计算给定文本在指定字体样式下的宽度
  // @ts-ignore
  const canvas =    //使用一个静态变量 canvas 来存储 canvas 元素
    getTextWidth.canvas ||
    (getTextWidth.canvas = document.createElement("canvas"));
  // re-use canvas object for better performance
  const context = canvas.getContext("2d");   //获取 2D 渲染上下文，用于绘制和测量文本
  context.font = font;    //设置上下文的字体样式
  const metrics = context.measureText(text);  //context.measureText(text) 返回一个包含文本宽度信息的对象

  return metrics.width;   //metrics.width 获取文本的宽度
}

// temporary: avoid a crash due to starting a transition
export function trans<T extends Selection<any, any, any, any>>(   //函数用于处理 D3 选择集的过渡效果，并避免过渡过程中可能发生的错误
  node: T,
  duration: number,
): T {
  return duration
    ? (node.transition().duration(duration) as unknown as T)   //如果 duration 大于 0，调用 node.transition().duration(duration) 来创建一个过渡效果
    : node;          //否则，直接返回 node
}
