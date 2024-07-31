import { useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";
import { createStyles } from "antd-style";
import { eventEmitter, timeScaleChange } from "@/event";
import { currentTimeAtom } from "@/globals/timeScale";
import GeoTimeScale from "@/utils/GeoTimeScale";
import { findInitNearItem } from "./chore";

export interface TimeScaleType {
  start: number;
  end: number;
}

export default function TimeScale({
  initTimeScaleDate = [0, 0],
}: {
  initTimeScaleDate: [number, number];
}) {
  const geotimeLine = useRef<GeoTimeScale>();
  const { styles } = blockStyles();
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);
  const [geoTimeData, setGeoTimeData] = useState([]);

  useEffect(() => {
    if (initTimeScaleDate.findIndex((date) => date) > -1) {
      fetch("/GTS_2020.json").then(async (res) => {
        const intervals = await res.json();
        setGeoTimeData(intervals);
        if (!geotimeLine.current) {
          const initNearItem = findInitNearItem(intervals, initTimeScaleDate);
          geotimeLine.current = new GeoTimeScale(
            "#geoTimeScale-simple",
            intervals,
            {
              onChange: (val) => {
                const { data } = val;
                const time = {
                  start: data.start,
                  end: data.end,
                  type: "timeScale",
                };
                setCurrentTime(time);
                timeScaleChange(time);
                const startInYears = data.start * 1_000_000;
                const endInYears = data.end * 1_000_000;
                eventEmitter.emit("timeRangeSelected", { start: startInYears, end: endInYears });
              },
              simplify: true,
              height: 50,
            },
          );
          setCurrentTime({
            start: initNearItem.start,
            end: initNearItem.end,
            type: "timeScale",
          });
          geotimeLine.current.stage = initNearItem.name;
        }
      });
    }
  }, [initTimeScaleDate]);

  return (
    <div className={styles.timeScale}>
      <div id="geoTimeScale-simple" />
    </div>
  );
}

const blockStyles = createStyles(({ css, token }) => ({
  timeScale: css`
    width: 90%;
    padding: 0 50px;
  `,
}));
