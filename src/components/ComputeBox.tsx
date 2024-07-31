//用于展示数据并计算差值和比率
import { Button, Table, Tooltip } from "antd";
import { createStyles } from "antd-style";
import domtoimage from "dom-to-image";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";

import useT from "@/hooks/use-t";

interface ComputeBoxProps {
  data: { dataIndex: number; seriesName: string; value: number[] }[];
}

export default function ComputeBox(props: ComputeBoxProps) {
  const { data } = props;
  const t = useT("computeBox");

  const { styles } = blockStyles();

  const tableData = useMemo(() => {
    return data.map((item) => ({
      key: nanoid(),
      seriesName: item.seriesName,
      age: +item.value[0],
      value: +item.value[1],
    }));
  }, [data]);

  const resultData = useMemo(() => {
    if (tableData.length <= 1) {
      return null;
    }
    const difference = tableData[0].value - tableData[1].value;
    const rate = (
      +difference /
      (tableData[0].value - tableData[1].value)
    ).toFixed(2);
    return tableData.length > 1
      ? {
          difference,
          rate: +rate ? rate : 0,
        }
      : null;
  }, [tableData]);

  const columns = [
    {
      title: t("data"),
      dataIndex: "seriesName",
      key: "seriesName",
      className: styles.replaceColor,
    },
    {
      title: t("age"),
      dataIndex: "age",
      key: "age",
      className: styles.replaceColor,
    },
    {
      title: t("value"),
      dataIndex: "value",
      key: "value",
      className: styles.replaceColor,
    },
  ];

  return (
    <div className={styles.computeBox}>
      <Table
        columns={columns}
        dataSource={tableData}
        className={styles.defWidth}
        pagination={false}
      />
      {resultData && (
        <div style={{ padding: "0.8rem 0.4rem 0.3rem 0.4rem" }}>
          <div className={styles.resultBox}>
            <div>
              {" "}
              <span className={styles.textBox}>{t("difference")}</span>{" "}
              {resultData.difference}
            </div>
            <div>
              <span className={styles.textBox}>{t("rate")}</span>{" "}
              {resultData.rate}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const blockStyles = createStyles(({ css, token }) => ({
  computeBox: css`
    width: 15rem;
  `,
  defWidth: css`
    width: 15rem;
  `,
  replaceColor: css`
    background: #fff !important;
  `,
  resultBox: css`
    padding: 0.5rem;
    background: #f9f9fb;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  `,
  textBox: css`
    color: #666;
  `,
}));
