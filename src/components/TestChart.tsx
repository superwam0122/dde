//使用ECharts库通过echarts-for-react包装器来绘制一个折线图
import ReactEcharts from "echarts-for-react";
import React, { useEffect, useRef, useState } from "react";

export default function TestChart() {
  const getOption = () => {
    const data = [820, 932, 901, 934, 1290, 1330, 1320];
    const categories = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const seriesData = data.map((item, index, array) => {
      if (index < array.length - 1) {
        return {
          value: [
            categories[index],
            item,
            categories[index + 1],
            array[index + 1],
          ],
          color: item < array[index + 1] ? "red" : "green",
        };
      } else {
        return {
          value: [categories[index], item],
          color: "green",
        };
      }
    });

    const series = seriesData.map((item, index) => ({
      type: "line",
      data:
        typeof item.value[2] !== "undefined"
          ? [
              [item.value[0], item.value[1]],
              [item.value[2], item.value[3]],
            ]
          : [[item.value[0], item.value[1]]],
      lineStyle: {
        color: item.color,
      },
    }));
    console.log("series", series);

    return {
      xAxis: {
        type: "category",
        data: categories,
      },
      yAxis: {
        type: "value",
      },
      series,
    };
  };

  return (
    <div>
      <ReactEcharts option={getOption()} style={{ height: "400px" }} />
    </div>
  );
}
