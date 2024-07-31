//用于管理图表数据、样式和交互
import type { SelectedPointType } from "./ChartPanel";

//用于定义图表样式参数的接口
export interface StyleParamsType {  //接口定义了图表样式参数，可以设置颜色、符号、符号大小和透明度。
  color?: string;
  symbol?: string;
  symbolSize?: number;
  opacity?: number;
}

//包含不同数据类型及其版本的数组
export const panelData = [
  {
    title: "氧同位素",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "碳同位素",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "CO2浓度",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "海平面高度",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "海表温度",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "冰芯氧同位素",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "Na+",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "K+",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "10Be 浓度",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "HSG",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "甲烷浓度",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "纹泥厚度",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "孢粉比率",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "CaC03 比率",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "硅藻比率",
    list: ["版本_01", "版本_02", "版本_03"],
  },
  {
    title: "树轮残差",
    list: ["版本_01", "版本_02", "版本_03"],
  },
];

//包含各种符号类型及其路径的对象，用于在图表中显示不同的符号
export const symbolList = {
  circle_1: "circle",
  rect_1: "rect",
  triangle_1: "triangle",
  line: "",
  plus: "path://M13 6H11V11H6V13H11V18H13V13H18V11H13V6Z",
  multiple_sign:
    "path://M10.2426 12L6 16.2426L7.41421 17.6568L11.6569 13.4142L15.8995 17.6568L17.3137 16.2426L13.0711 12L17.3137 7.75735L15.8995 6.34314L11.6569 10.5858L7.41421 6.34314L6 7.75735L10.2426 12Z",
  line_o:
    "path://M5 11V9H3V11H5ZM7.10002 11V13H8.73483L9.06004 11.3979L7.10002 11ZM5 13H3V15H5V13ZM7.10002 13L9.06004 12.6021L8.73483 11H7.10002V13ZM16.9 13V11H15.2652L14.94 12.6021L16.9 13ZM19 13V15H21V13H19ZM19 11H21V9H19V11ZM16.9 11L14.94 11.3979L15.2652 13H16.9V11ZM5 13H7.10002V9H5V13ZM7 13V11H3V13H7ZM7.10002 11H5V15H7.10002V11ZM5.13999 13.3979C5.78874 16.5938 8.61113 19 12 19V15C10.551 15 9.33784 13.9706 9.06004 12.6021L5.13999 13.3979ZM12 19C15.3889 19 18.2113 16.5938 18.86 13.3979L14.94 12.6021C14.6622 13.9706 13.449 15 12 15V19ZM19 11H16.9V15H19V11ZM17 11V13H21V11H17ZM16.9 13H19V9H16.9V13ZM18.86 10.6021C18.2113 7.40616 15.3889 5 12 5V9C13.449 9 14.6622 10.0294 14.94 11.3979L18.86 10.6021ZM12 5C8.61113 5 5.78874 7.40616 5.13999 10.6021L9.06004 11.3979C9.33784 10.0294 10.551 9 12 9V5Z",
  diamond_1:
    "path://M16.2426 12.0711L12 7.82843L7.75736 12.0711L12 16.3137L16.2426 12.0711ZM12 5L4.92893 12.0711L12 19.1421L19.0711 12.0711L12 5Z",
  circle: "circle",
  rect: "rect",
  triangle: "path://M12 6.80383L18 17.1961H6L12 6.80383Z",
  diamond: "path://M12 5L4.92893 12.0711L12 19.1421L19.0711 12.0711L12 5Z",
};

//用于渲染线条的视觉映射
export const renderLineVisualMap = (
  item: API.DataItem,                    //接收三个参数：item 表示数据项
  isSelectMode: boolean,                 //isSelectMode 表示是否处于选择模式
  selectedPoints: SelectedPointType[],   //selectedPoints 表示选定的数据点数组
) => {
  const { data, label, color } = item;
  const selectedLinePoints = selectedPoints.filter(
    (point) => point.seriesName === item.label,     //通过筛选 selectedPoints 数组，找出与当前数据项相关的选定数据点
  );
  if (!isSelectMode || !selectedLinePoints.length) {
    return null;                                    //如果不处于选择模式或没有选定的数据点，则返回 null
  }
  const pieces = data.data.map((unit: any, index: number) => {
    let currentColor = isSelectMode ? "rgba(242, 91, 40, 0.10)" : color;  //遍历数据的每个单元（索引），根据当前是否处于选择模式来确定颜色。如果处于选择模式，则设置为半透明色，否则使用数据项的颜色
    if (selectedLinePoints.length === 2) {
      const max = Math.max(
        selectedLinePoints[0].dataIndex,
        selectedLinePoints[1].dataIndex,
      );
      const min = Math.min(
        selectedLinePoints[0].dataIndex,
        selectedLinePoints[1].dataIndex,
      );
      if (index > min && index < max) {
        currentColor = color;   //如果有两个选定的数据点，则在这两个点之间的区间设置为正常颜色，其他区间保持半透明色
      }
    }

    return {
      gt: index,
      lte: index + 1,
      color: currentColor,
    };
  });

  return {   //最后，返回一个对象，包含了用于渲染线条的视觉映射配置信息，其中包括是否显示、维度、系列名称和颜色分段
    show: false,
    dimension: 0,
    seriesName: label,
    pieces,
  };
};

//用于根据数据项和选择模式切换图表选项
export const switchOptions = (   //接收四个参数
  item: API.DataItem,            //item 表示数据项
  index: number,                 //index 表示索引
  isSelectMode: boolean,         //isSelectMode 表示是否处于选择模式
  selectedPoints: SelectedPointType[],  //selectedPoints 表示选定的数据点数组
) => {
  let seriesOpt = {};     //初始化一个空对象 seriesOpt
  switch (item.type) {    //根据数据项的类型使用 switch 语句分别处理不同类型的数据。针对散点图和线图，设置相关的配置参数。对于其他类型的数据，设置一些通用的配置参数
    case "scatter":
      seriesOpt = {     //散点图的配置参数
        xAxisId: "id_" + item.parentLabel,
        yAxisId: "id_" + item.parentLabel,
        name: item.id,
        type: item.type,
        symbolSize: item.symbolSize || 10,
        data: item.data.data.map((_: any, ind: number) => {
          const itemStyle = {
            color: item.symbol.includes("_1") ? "transparent" : item.color,
            borderColor: isSelectMode
              ? selectedPoints.findIndex(
                  (point) =>
                    point.seriesName === item.label && point.dataIndex === ind,
                ) > -1
                ? item.color
                : "rgba(184, 183, 183, 0.225)"
              : item.color,
            borderWidth: item.symbol.includes("_1") ? 2 : 0,
          };
          return {
            value: item.data.data[ind],
            itemStyle: {
              ...itemStyle,
            },
          };
        }),
        // large: true,
        blendMode: "source-over",
        largeThreshold: 500,
        symbol: symbolList[item.symbol],
        itemStyle: {
          opacity: item.opacity || 1,
        },
      };
      break;
    case "line":
      seriesOpt = {         //线图的配置参数
        xAxisId: "id_" + item.parentLabel,
        yAxisId: "id_" + item.parentLabel,
        name: item.id,
        type: item.type,
        symbolSize: item.symbolSize || 1,
        data: item.data.data.map((_: any, ind: number) => {
          return {
            value: item.data.data[ind],
            symbolSize: isSelectMode
              ? selectedPoints.findIndex(
                  (point) =>
                    point.seriesName === item.label && point.dataIndex === ind,
                ) > -1
                ? item.symbolSize || 10
                : 1
              : 1,
            symbol: symbolList[item.symbol],
            itemStyle: {
              opacity: item.opacity || 1,
              color: isSelectMode
                ? selectedPoints.findIndex(
                    (point) =>
                      point.seriesName === item.label &&
                      point.dataIndex === ind,
                  ) > -1
                  ? item.color
                  : "rgba(242, 91, 40, 0.10)"
                : "rgba(242, 91, 40, 0.10)",
            },
          };
        }),
        itemStyle: {
          color: isSelectMode ? "rgba(242, 91, 40, 0.10)" : item.color,
        },
        lineStyle: {
          opacity: item.opacity || 1,
        },
      };
      break;
    default:
      seriesOpt = {       //其他类型图表的通用配置参数
        xAxisId: "id_" + item.parentLabel,
        yAxisId: "id_" + item.parentLabel,
        name: item.label,
        type: item.type,
        symbol: "none",
      };
      break;
  }
  return seriesOpt;    //最后，返回一个对象，表示图表选项的配置信息
};

//用于在给定的数据列表中查找与给定范围最接近的数据项，用于初始化图表时定位合适的数据显示范围
export const findInitNearItem = (list: any[], [a, b]: [number, number]) => { //接收两个参数：list 表示数据列表，[a, b] 表示一个范围
  // 初始数据
  const items = list;    //初始化一个变量 items，表示初始数据

  // 按层级（level）降序排列
  items.sort((item1, item2) => (item2.level || 0) - (item1.level || 0)); //按照数据项的层级（如果有）降序排列，以确保优先选择更深层级的数据项

  const results = [];
  for (const item of items) {     //遍历数据列表，找到满足条件的数据项：其结束位置小于给定范围的结束位置，且起始位置大于给定范围的起始位置
    // 找到满足条件的项
    if (item.end <= b && item.start > a) {
      results.push(item);
    }
  }

  // 如果没有找到满足条件的项，则查找它们的父级项
  if (results.length === 0) {
    for (const item of items) {
      if (items.find((i) => i.id === item.parentId)) {
        results.push(item);
      }
    }
  }

  // 在结果集中选择误差最小的项，误差定义为该项与给定范围的距离
  const minErrorItem = results.reduce((prev, cur) => {
    const prevError = Math.abs(prev.start - a + (prev.end - b)) / 2;
    const curError = Math.abs(cur.start - a + (cur.end - b)) / 2;
    return prevError < curError ? prev : cur;
  }, results[0]);

  return minErrorItem;  //最后，返回选择误差最小的项作为结果
};
