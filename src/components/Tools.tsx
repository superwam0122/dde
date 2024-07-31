//用于显示各种工具按钮，这些按钮能够执行不同的功能，如全屏切换、分享、下载图片、恢复图表、区域放大和变化计算。
import { Button, Tooltip } from "antd";
import { createStyles } from "antd-style";
// import domtoimage from "dom-to-image";
import { useEffect, useMemo, useState } from "react";

import { eventEmitter } from "@/event";
import {
  brushEnd,
  brushStart,
  restoreChart,
  saveImage,
  zoomEnd,
  zoomStart,
} from "@/event";
import useT from "@/hooks/use-t";

import { Icon } from "./Icon";

import type { ScreenStateType } from "@/pages/home";

interface TooltipProps {
  screenState: ScreenStateType;
  screenStateChange: (state: ScreenStateType) => void;
  isSelectMode: boolean;
  selectedModeChange: (state: boolean) => void;
}

const ImageConfigForm = {
  type: "jpeg",
  size: 1,
};

export default function Tools(props: TooltipProps) {
  const { screenState, screenStateChange, isSelectMode, selectedModeChange } =
    props;
  const t = useT("btns");

  const [zoomOn, setZoomOn] = useState(false);
  const [brushOn, setBrushOn] = useState(false);

  useEffect(() => {
    eventEmitter.on("restore", () => {
      setZoomOn(false);
      setBrushOn(false);
    });
    return () => {
      eventEmitter.off("restore");
    };
  }, []);

  const setZoomStatus = (open: boolean) => {
    if (open) {
      setBrushOn(false);
      zoomStart();
    } else {
      zoomEnd();
    }
    setZoomOn(open);
  };
  const setBrushStatus = (open: boolean) => {
    if (open) {
      setZoomOn(false);
      brushStart();
    } else {
      brushEnd();
    }
    setBrushOn(open);
  };

  const { styles } = blockStyles();
  const leftTools = useMemo(
    () => [
      {
        title: screenState === "normal" ? t("fullScreen") : t("reduction"),
        icon:
          screenState === "normal" ? (
            <Icon
              type="fullScreen"
              className={styles.icon}
              onClick={() => screenStateChange("full")}
            />
          ) : (
            <Icon
              type="falseFullScreen"
              className={styles.icon}
              onClick={() => screenStateChange("normal")}
            />
          ),
      },
      {
        title: t("share"),
        icon: <Icon type="share" className={styles.icon} />,
      },
      {
        title: t("download"),
        icon: (
          <Icon
            type="download"
            onClick={() => {
              saveImage();
            }}
            className={styles.icon}
          />
        ),
      },
    ],
    [screenState],
  );

  return (
    <div className={styles.tools}>
      <div className={styles.leftTools}>
        {leftTools.map((tool) => (
          <Tooltip title={tool.title} key={tool.title}>
            {tool.icon}
          </Tooltip>
        ))}
      </div>
      <div className={styles.rightTools}>
        <Icon
          type="refresh"
          onClick={() => {
            restoreChart();
            setZoomStatus(false);
            setBrushStatus(false);
          }}
          className={styles.icon}
        />
        <Button
          onClick={() => setZoomStatus(!zoomOn)}
          className={zoomOn ? styles.activeBtn : ""}
        >
          区域放大
        </Button>
        <Button
          // onClick={() => setBrushStatus(!brushOn)}
          // className={brushOn ? styles.activeBtn : ""}
          onClick={() => selectedModeChange(!isSelectMode)}
          className={isSelectMode ? styles.activeBtn : ""}
        >
          变化计算
        </Button>
      </div>
    </div>
  );
}

const blockStyles = createStyles(({ css, token }) => ({
  tools: css`
    display: flex;
    justify-content: space-between;
  `,
  leftTools: css`
    display: flex;
    gap: 0.8rem;
  `,
  icon: css`
    cursor: pointer;
  `,
  rightTools: css`
    display: flex;
    gap: 0.8rem;
  `,
  activeBtn: css`
    color: #ff722b;
    border-color: #ff722b;
  `,
}));
