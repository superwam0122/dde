import React, { useEffect, useMemo, useRef, useState } from "react";
import { createStyles } from "antd-style";
import ReactECharts from "echarts-for-react";
import { eventEmitter } from "@/event";
import ComputeBox from "./ComputeBox";
import { DragablePanel } from "./DragablePanel";
import { LegendSet, svgIcon } from "./LegendSet";
import TimeScale from "./TimeScale";
import { renderLineVisualMap, switchOptions, symbolList } from "./chore";
import type { PropsWithChildren } from "react";

interface ChartProps {
  items: API.DataItem[];
  isSelectMode: boolean;
}

export interface SelectedPointType {
  dataIndex: number;
  seriesName: string;
  value: [];
}

export default function ChartPanel({
  items,
  isSelectMode,
}: PropsWithChildren<ChartProps>) {
  const { styles } = blockStyles();
  const [echartsData, setEchartsData] = useState<API.DataItem[]>([]);
  const [initTimeScaleDate, setInitTimeScaleDate] = useState<[number, number]>([0, 0]);
  const [selectedPoints, setSelectedPoints] = useState<SelectedPointType[]>([]);
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);

  useEffect(() => {
    setEchartsData(items);

    if (items.length) {
      const mergedArr = items.map((item) => item.data?.data || []).flat();

      if (mergedArr.length > 0) {
        const xValues = mergedArr.map((item) => parseFloat(item[0])).filter((value) => !isNaN(value));
        const maxX = Math.max(...xValues);
        const minX = Math.min(...xValues);
        if (maxX !== minX) {
          setInitTimeScaleDate([minX, maxX]);
        }
      }
    }
  }, [items]);

  useEffect(() => {
    const handleTimeRangeSelected = ({ start, end }) => {
      console.log("Received timeRangeSelected event:", { start, end });
      setInitTimeScaleDate([start, end]);
    };

    eventEmitter.on("timeRangeSelected", handleTimeRangeSelected);

    return () => {
      eventEmitter.off("timeRangeSelected", handleTimeRangeSelected);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (chart1Ref.current) {
        chart1Ref.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    eventEmitter.on("zoom_start", () => {
      zoomOpen(true);
    });
    eventEmitter.on("zoom_end", () => {
      zoomOpen(false);
    });
    eventEmitter.on("brush_start", () => {
      brushOpen(true);
    });
    eventEmitter.on("brush_end", () => {
      brushOpen(false);
    });
    eventEmitter.on("restore", () => {
      restore();
    });
    eventEmitter.on("save_image", () => {
      saveAsImage();
    });
    return () => {
      eventEmitter.off("zoom_start");
      eventEmitter.off("zoom_end");
      eventEmitter.off("brush_start");
      eventEmitter.off("brush_end");
      eventEmitter.off("restore");
      eventEmitter.off("save_image");
    };
  }, []);

  useEffect(() => {
    setSelectedPoints([]);
  }, [isSelectMode]);

  const handlePointClick = (params: any) => {
    if (!isSelectMode) return;
    const { dataIndex, seriesName, value } = params;

    if (
      selectedPoints.length >= 2 ||
      (selectedPoints.length === 1 &&
        selectedPoints[0].seriesName !== seriesName)
    ) {
      setSelectedPoints([
        {
          dataIndex,
          seriesName,
          value,
        },
      ]);
    } else {
      setSelectedPoints((prevPoints: any) =>
        prevPoints.findIndex(
          (prePoint: { dataIndex: number; seriesName: string }) =>
            prePoint.dataIndex === dataIndex &&
            prePoint.seriesName === seriesName,
        ) > -1
          ? prevPoints.filter(
              (idx: { dataIndex: number }) => idx.dataIndex !== dataIndex,
            )
          : [
              ...prevPoints,
              {
                dataIndex,
                seriesName,
                value,
              },
            ],
      );
    }
  };

  const zoomOpen = (bo: boolean | null) => {
    if (chart1Ref.current) {
      chart1Ref.current.getEchartsInstance().dispatchAction(
        {
          type: "takeGlobalCursor",
          key: "dataZoomSelect",
          dataZoomSelectActive: bo,
        },
        { silent: true },
      );
    }
  };

  const brushOpen = (bo: boolean | null) => {
    const opt = {
      type: "takeGlobalCursor",
      key: bo ? "brush" : "brushEnd",
      brushOption: {},
    } as any;
    if (bo) {
      opt.areas = [];
      opt.brushOption.areas = [];
    }
    if (chart1Ref.current) {
      chart1Ref.current.getEchartsInstance().dispatchAction(opt);
    }
  };

  const restore = () => {
    if (chart1Ref.current) {
      chart1Ref.current.getEchartsInstance().dispatchAction(
        {
          type: "restore",
        },
        { silent: true },
      );
    }
  };

  const saveAsImage = () => {
    const chartDom = chart1Ref?.current.getEchartsInstance();
    const opt = chartDom.getOption();

    const chartDom2 = chart2Ref?.current.getEchartsInstance();
    chartDom2.setOption(opt, true);
    chartDom.showLoading();
    setTimeout(() => {
      if (chartDom2) {
        const a = document.createElement("a");
        a.href = chartDom2.getDataURL();
        a.download = `chart.svg`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        chart2Ref?.current.getEchartsInstance().dispose();
        chartDom.hideLoading();
      }
    }, 1000);
  };

  const setXAxis = (list: []) => {
    console.log("Setting X Axis with initTimeScaleDate:", initTimeScaleDate);
    return list.map((_, index) => ({
      gridIndex: index,
      type: "value",
      name: list[index].xAxis,
      nameLocation: "middle",
      nameGap: 30,
      nameTextStyle: {
        fontSize: 14,
      },
      splitLine: {
        show: true,
      },
      min: initTimeScaleDate[0], 
      max: initTimeScaleDate[1], 
      inverse: true, 
    }));
  };
  

  const setYAxis = (list: []) => {
    return list.map((_, index) => ({
      gridIndex: index,
      type: "value",
      name: list[index].yAxis,
      nameLocation: "middle",
      nameGap: 50,
      nameTextStyle: {
        fontSize: 14,
      },
      splitLine: {
        show: true,
      },
    }));
  };

  const setSeriesData = (list: API.DataItem[]) => {
    const seriesData = list.map((item, index) => ({
      ...switchOptions(item, index, isSelectMode, selectedPoints),
      xAxisIndex: index,
      yAxisIndex: index,
      gridIndex: index,
      name: item.data.units[1], // 使用units[1]作为系列名称
    }));
    console.log("Series Data set:", seriesData);
    return seriesData;
  };
  

  const setLegendsData = (list: API.DataItem[]) => {
    return list.map((item) => ({
      icon: symbolList[item.symbol],
      name: item.data.units[1], // 使用units[1]作为图例文字
      color: item.color,
    }));
  };

  const setColor = (list: API.DataItem[]) => {
    return list.map((item) => item.color);
  };

  const setLinklist = (list: []) => {
    const ids = [];
    const parentObj = setParentList(list);
    for (const key in parentObj) {
      ids.push("id_" + key);
    }

    return [
      {
        xAxisId: ids,
      },
      {
        xAxisId: ids,
      },
      {
        yAxisId: ids,
      },
      {
        yAxisId: ids,
      },
    ];
  };

  const setParentList = (list: []) => {
    const result = {} as any;
    list.forEach((item) => {
      if (result[item.parentLabel] && result[item.parentLabel].length) {
        result[item.parentLabel].push(item);
      } else {
        result[item.parentLabel] = [item];
      }
    });
    return result;
  };

  const setGrid = (list: []) => {
    const length = list.length;
    const result = [];
    const height = 90 / length;

    for (let i = 0; i < length; i++) {
      result.push({
        id: `grid_${i}`,
        top: `${i * height + 10}%`,
        height: `${height - 5}%`,
        left: "10%",
        width: "80%",
      });
    }

    return result;
  };

  const chartOptions = useMemo(() => {
    if (!echartsData.length) return {};

    const xAxisList = setXAxis(echartsData);
    const yAxisList = setYAxis(echartsData);
    const seriesData = setSeriesData(echartsData);
    const visualMap = echartsData
      .filter((item) => item.type === "line")
      .map((line) => renderLineVisualMap(line, isSelectMode, selectedPoints));

    return {
      legend: {
        type: "plain",
        top: 5,
        left: 30,
        show: true,
        data: setLegendsData(echartsData),
      },
      axisPointer: {
        show: true,
        snap: true,
        lineStyle: {
          type: "dashed",
        },
        label: {
          show: false,
          margin: 6,
          backgroundColor: "#556",
          color: "#fff",
        },
        triggerTooltip: false,
        link: setLinklist(echartsData),
      },
      dataZoom: [
        {
          width: 20,
          height: 20,
          left: 10,
          bottom: 10,
          xAxisIndex: [0, 1, 2, 3],
          yAxisIndex: [0, 1, 2, 3],
          type: "inside",
          filterMode: "empty",
          realtime: false,
          show: false,
        },
      ],
      grid: setGrid(echartsData),
      color: setColor(echartsData),
      tooltip: {
        trigger: "axis",
        axisPointer: { animation: false },
        appendToBody: true,
        confine: true,
        formatter: (params: { value: string }[]) => {
          let str = "";
          str += `<div style='display: flex;justify-content: space-between;align-items: center;margin-bottom: 4px;'><label style='color: #262626;font-size: 14px;'>${params[0].axisValue} years ago</label></div>`;
          str += `<div style='width: 100%;height: 1px;background: #ECEDF0;margin: 10px 0;'></div>`;
          params.forEach((item) => {
            let theItem = {} as any;
            echartsData.forEach((eData) => {
              if (eData.id == item.seriesName) {
                theItem = eData;
              }
            });
            str += `<div style='display: flex; gap: 1rem; justify-content: space-between;align-items: center;margin-bottom: 4px;'><label style='color: #C0C2C3;display: flex;'><span style='display:inline-block;height: 24px;'>${ReactDOMServer.renderToString(
              svgIcon(theItem.symbol, theItem.color),
            )}</span>${item.seriesName}</label><span>${item.value[1]}</span></div>`;
          });
          return str;
        },
      },
      toolbox: {
        feature: {
          dataZoom: {},
          brush: {
            type: ["rect", "polygon", "clear"],
          },
          saveAsImage: {
            type: "svg",
          },
        },
        right: "-200",
      },
      xAxis: xAxisList,
      yAxis: yAxisList,
      series: seriesData,
      visualMap,
    };
  }, [echartsData, selectedPoints, isSelectMode, initTimeScaleDate]);

  const computeBoxShow = useMemo(() => {
    return (
      isSelectMode &&
      selectedPoints.length >= 1 &&
      items.findIndex((item) => item.label === selectedPoints[0].seriesName) > -1
    );
  }, [isSelectMode, selectedPoints, items]);

  const onBrushEnd = (event: any) => {
    if (event.areas && event.areas.length > 1) {
      brushOpen(false);
      event.areas = [];
      chart1Ref?.current.getEchartsInstance().dispatchAction(
        {
          type: "takeGlobalCursor",
          key: "unselect",
        },
        { silent: true },
      );
    } else {
      brushOpen(true);
    }
  };

  const onDataZoom = (event: any) => {
    console.log("onDataZoom", event);
  };

  const onEvents = {
    click: handlePointClick,
    brushEnd: onBrushEnd,
    dataZoom: onDataZoom,
  };

  return (
    <div className={styles.chartPanel} id="chartImg">
      <div className={styles.chartBox} id="chartContainer">
        <div className={styles.legendLine}></div>
        <LegendSet
          itemlist={echartsData}
          changeLegends={(data) => {
            setEchartsData(data);
          }}
        />
        <ReactECharts
          option={chartOptions}
          ref={chart1Ref}
          onEvents={onEvents}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "relative",
          }}
        />
        <ReactECharts
          option={{}}
          ref={chart2Ref}
          opts={{ renderer: "svg" }}
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
            position: "absolute",
            right: "-100%",
            top: "0",
          }}
        />
      </div>
      <div className={styles.timeBox}>
        <TimeScale initTimeScaleDate={initTimeScaleDate} />
      </div>
      <DragablePanel
        visible={computeBoxShow}
        className={`${styles.dragPanel} ${
          computeBoxShow && styles.dragePanelPad
        }`}
      >
        {computeBoxShow && <ComputeBox data={selectedPoints} />}
      </DragablePanel>
    </div>
  );
}

const blockStyles = createStyles(({ css, token }) => ({
  chartPanel: css`
    position: relative;
    margin-top: 0.5rem;
    flex: 1;
    background: #fff;
    display: flex;
    flex-direction: column;
  `,
  chartBox: css`
    flex: 1;
    padding: 0.4rem 0 0 0;
    position: relative;
  `,
  timeBox: css`
    min-height: 74px;
  `,
  legendLine: css`
    position: absolute;
    top: 45px;
    left: 0;
    height: 1px;
    width: 100%;
    background: #e2e3e7;
  `,
  dragPanel: css`
    background: #fff;
    position: absolute;
    left: 40%;
    top: 35%;
    z-index: 1000;
    border: 1px solid #e2e3e7;
    box-shadow: 0px 2px 15px 0px rgba(74, 74, 81, 0.25);
    border-radius: 4;
  `,
  dragePanelPad: css`
    padding: 0.8rem;
  `,
}));
