import React, { useState } from "react";
import { Button, Upload, Modal, Select, message } from "antd";
import Papa from "papaparse";
import { createStyles } from "antd-style";
import { Icon } from "./Icon";
import useT from "@/hooks/use-t";

const blockStyles = createStyles(({ css }) => ({
  noSelectMain: css`
    background: #fff;
    margin-top: 0.5rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  main: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
  `,
  icon: css`
    svg {
      width: 5rem;
      height: 5rem;
    }
  `,
  modalContent: css`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
  selectContainer: css`
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
    gap: 20px;
    width: 100%;
  `,
  selectLabelContainer: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,
  selectLabel: css`
    font-weight: bold;
    white-space: nowrap;
  `,
  tableWrapper: css`
    overflow-y: auto;
    max-height: 300px;
    border: 1px solid #ddd;
    padding: 10px;
    margin-top: 20px;
    margin-bottom: 1px;
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
    th,
    td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    th {
      background-color: #f2f2f2;
    }
  `,
  chartContainer: css`
    width: 100%;
    height: 400px;
  `,
  footerButtons: css`
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  `,
  modalTitle: css`
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  `,
}));

const NoSelectMain = ({ checkedIdsChange }) => {
  const t = useT("noData");
  const { styles } = blockStyles();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [columns, setColumns] = useState<string[]>([]);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string | null>(null);
  const [selectedYAxis, setSelectedYAxis] = useState<string | null>(null);
  const [chartType, setChartType] = useState<string | null>(null);

  const uploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      if (file.type !== "text/csv") {
        message.warning(t("fileTip"));
        return false;
      }
      Papa.parse(file, {
        header: true,
        complete: function (results) {
          if (results.data.length === 0) {
            message.error("The CSV file is empty or cannot be parsed.");
            return;
          }
          const units = Object.keys(results.data[0]);
          const validUnits = units.filter((unit) => unit !== "__parsed_extra");
          if (!validUnits || !validUnits.every((unit) => unit)) {
            message.error("The CSV file contains invalid headers.");
            return;
          }
          setColumns(validUnits);
          setParsedData(
            results.data.map((row) => {
              const { __parsed_extra, ...validRow } = row;
              return validRow;
            })
          );
          setIsModalVisible(true);
        },
      });
      return false;
    },
  };

  const handleOk = () => {
    if (!selectedXAxis || !selectedYAxis || !chartType) {
      message.error("请同时选择X轴、Y轴和图表类型。");
      return;
    }

    const filteredData = parsedData.map((row) => ({
      [selectedXAxis]: row[selectedXAxis],
      [selectedYAxis]: row[selectedYAxis],
    }));

    const item = {
      id: "upload",
      label: `${selectedXAxis}, ${selectedYAxis}`,
      version: "",
      color: "red",
      symbol: "none",
      type: chartType,
      data: {
        units: [selectedXAxis, selectedYAxis],
        data: filteredData.map((d) => [parseFloat(d[selectedXAxis]), parseFloat(d[selectedYAxis])]),
      },
    };

    console.log("Item:", item);
    checkedIdsChange([item]); // 确保checkedIdsChange与ChartPanel中的一致
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleXAxisChange = (value) => {
    setSelectedXAxis(value);
  };

  const handleYAxisChange = (value) => {
    setSelectedYAxis(value);
  };

  const handleChartTypeChange = (value) => {
    setChartType(value);
  };

  const renderTable = () => {
    if (parsedData.length === 0) return null;
    return (
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {parsedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className={styles.noSelectMain}>
      <div className={styles.main}>
        <Icon type="noData" className={styles.icon} />
        <span>{t("selectData")}</span>
        <Upload {...uploadProps}>
          <Button type="primary">{t("uploadData")}</Button>
        </Upload>
      </div>

      <Modal
        title={null}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        footer={null}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalTitle}>Preview and select columns</div>
          <div className={styles.selectContainer}>
            <div className={styles.selectLabelContainer}>
              <span className={styles.selectLabel}>Select X-axis data</span>
              <Select
                placeholder="Please select the X-axis data you want to render"
                value={selectedXAxis}
                onChange={handleXAxisChange}
                style={{ width: "100%" }}
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {columns.map((column, index) => (
                  <Select.Option key={index} value={column}>
                    {column}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className={styles.selectLabelContainer}>
              <span className={styles.selectLabel}>Select Y-axis data</span>
              <Select
                placeholder="Please select the Y-axis data you want to render"
                value={selectedYAxis}
                onChange={handleYAxisChange}
                style={{ width: "100%" }}
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                {columns.map((column, index) => (
                  <Select.Option key={index} value={column}>
                    {column}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div className={styles.selectLabelContainer}>
              <span className={styles.selectLabel}>Select the chart type</span>
              <Select
                placeholder="Please select a chart type"
                value={chartType}
                onChange={handleChartTypeChange}
                style={{ width: "100%" }}
                getPopupContainer={(trigger) => trigger.parentElement}
              >
                <Select.Option value="scatter">Scatter plot</Select.Option>
                <Select.Option value="line">Line chart</Select.Option>
              </Select>
            </div>
          </div>
          <div className={styles.tableWrapper}>{renderTable()}</div>
          <div className={styles.footerButtons}>
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button key="submit" type="primary" onClick={handleOk}>
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NoSelectMain;
