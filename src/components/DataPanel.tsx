import React, { useState, useEffect } from "react";
import { Checkbox, Input, message, Button, Divider } from "antd";
import { fetchAllObjects, fetchAllReferencesByObject, fetchDataByReference } from "@/service/api";
import useT from "@/hooks/use-t";
import { Icon } from "./Icon";
import type { ScreenStateType } from "@/pages/home";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import { createStyles } from "antd-style";

export interface DataItemType {
  title: string;
  list: string[];
}

interface DataPanelProps {
  screenState: ScreenStateType;
  checkedIds: API.DataItem[];
  checkedIdsChange: (list: API.DataItem[]) => void;
  setLoading: (loading: boolean) => void;
}

const blockStyles = createStyles(({ css, token }) => ({
  dataPanel: css`
    height: 100%;
    background: #f8f8fb;
    border-right: 1px solid ${token.colorBorderBg};
    box-shadow: 4px 0px 4px 0px rgba(182, 182, 182, 0.1);
    transition: all 100ms linear;
    display: flex;
  `,
  panelLeft: css`
    height: 100%;
    border-right: 1px solid ${token.colorBorderBg};
    background: #fff;
    width: 17rem;
  `,
  searchBox: css`
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
  dataItem: css`
    width: 100%;
    padding: 0.5rem 1rem 0.5rem 1rem;
    transition: background-color 200ms;
    &:hover {
      background: #f9f9fb;
    }
  `,
  panelRight: css`
    width: 15rem;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    background: #f2f3f9;
  `,
  referenceBox: css`
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,
  referenceHeader: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-weight: bold;
    font-size: 16px;
  `,
  referenceItem: css`
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    .ant-checkbox-wrapper {
      display: flex;
      align-items: center;
    }
    .anticon-link {
      margin-left: auto;
    }
  `,
  referenceLabel: css`
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 12rem;
  `,
}));

export default function DataPanel(props: DataPanelProps) {
  const { screenState, checkedIds, checkedIdsChange, setLoading } = props;
  const { styles } = blockStyles();
  const t = useT("dataPanel");
  const [objects, setObjects] = useState<string[]>([]);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [keyword, setKeyword] = useState("");
  const [references, setReferences] = useState<Record<string, { reference: string, x_data: string, y_data: string, time_unit: string }[]>>({});
  const [referenceCheckedList, setReferenceCheckedList] = useState<Record<string, { reference: string, x_data: string, y_data: string, time_unit: string }[]>>({});
  const [selectedObjects, setSelectedObjects] = useState<string[]>([]);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        const result = await fetchAllObjects();
        setObjects(result);
      } catch (error) {
        console.error("Failed to fetch objects:", error);
        showMessage("Failed to fetch objects");
      }
    };

    fetchObjects();
  }, []);

  const fetchReferences = async (object: string, isNewlyChecked: boolean) => {
    setLoading(true);
    try {
      const result = await fetchAllReferencesByObject(object);
      if (result.length === 0 && isNewlyChecked) {
        showMessage("No references found for the selected object");
      }
      setReferences(prev => ({ ...prev, [object]: result }));
    } catch (error) {
      console.error('Failed to fetch references:', error);
      if (isNewlyChecked) {
        showMessage("Failed to fetch references");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchDataByReference = async (object: string, reference: string) => {
    try {
      const response = await fetchDataByReference(object, reference);
      console.log('Fetched Data for object:', object, 'and reference:', reference, ':', response);

      if (!response || !response.length) throw new Error("No data found in response");

      const refInfo = references[object]?.find((r) => r.reference === reference);
      if (!refInfo) {
        throw new Error("Missing reference information for the selected reference");
      }

      const { x_data, y_data, time_unit } = refInfo;

      const xAxisData = response.map((item: any) => parseFloat(item.data[x_data]));
      let processedXAxisData = xAxisData;

      switch (time_unit) {
        case 'ka':
          processedXAxisData = xAxisData.map(x => x * 1000);
          break;
        case 'Ma':
          processedXAxisData = xAxisData.map(x => x * 1000000);
          break;
        case '14C a BP':
        case 'calkaBP':
          processedXAxisData = xAxisData.map(x => x * 1000);
          break;
        case 'kyr BP':
          processedXAxisData = xAxisData.map(x => x * 1000);
          break;
        case 'GTS2004':
        case 'null':
        default:
          break;
      }

      const y_data_array = y_data.split(/[,，]/); // 分割y_data为多个属性

      y_data_array.forEach((y_data_item) => {
        const yAxisData = response.map((item: any) => parseFloat(item.data[y_data_item]));

        const chartItem = {
          id: `${object}_${reference}_${y_data_item}`,  // 确保每个图表有唯一的id
          label: `${object}_${reference}`, // 使用object和y_data值作为图例
          version: "",
          color: "red",
          symbol: "none",
          type: "scatter",
          data: {
            units: [x_data, y_data_item],
            data: processedXAxisData.map((x: number, i: number) => [x, yAxisData[i]]),
          },
        };

        checkedIdsChange((prev) => [...prev, chartItem]);
      });
    } catch (error) {
      console.error('Error fetching data by reference:', error);
      showMessage(error.message);
    }
  };

  const showMessage = (errorMessage: string) => {
    const key = `open${Date.now()}`;
    message.error({
      content: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <span>{errorMessage}</span>
          <Button type="primary" size="small" style={{ marginLeft: '10px' }} onClick={() => message.destroy(key)}>
            Close
          </Button>
        </div>
      ),
      duration: 1,
      key,
      style: { width: '1600px' }, // Adjust the width as needed
    });
  };

  const selectChange = (list: CheckboxValueType[]) => {
    // 获取当前选中的对象列表
    const newlyChecked = list.filter((item) => !checkedList.includes(item));
    const removedObjects = checkedList.filter((item) => !list.includes(item));
    setCheckedList(list);
    setSelectedObjects(list.map(item => item as string));

    // 对于每个新选中的对象，获取其引用数据
    newlyChecked.forEach((object) => {
      fetchReferences(object as string, true);
    });

    // 对于每个被取消选中的对象
    removedObjects.forEach((object) => {
      // 获取该对象的所有引用
      const objectReferences = references[object as string] || [];

      // 移除相应引用的选中状态
      setReferenceCheckedList(prev => {
        const { [object as string]: _, ...rest } = prev;
        return rest;
      });

      // 从checkedIds中移除这些引用对应的图表数据
      const newCheckedIds = checkedIds.filter(item => !item.label.startsWith(`${object as string}_`));
      checkedIdsChange(newCheckedIds);
    });
  };

  const referenceSelectChange = (object: string, list: CheckboxValueType[]) => {
    const selectedReferences = references[object]?.filter(ref => list.includes(ref.reference));
    setReferenceCheckedList(prev => ({ ...prev, [object]: selectedReferences }));

    const previousReferences = referenceCheckedList[object] || [];
    const addedReferences = selectedReferences.filter(ref => !previousReferences.includes(ref));
    const removedReferences = previousReferences.filter(ref => !selectedReferences.includes(ref));

    addedReferences.forEach((ref) => {
      handleFetchDataByReference(object, ref.reference);
    });

    removedReferences.forEach((ref) => {
      const yDataItems = (ref.y_data || "").split(/[,，]/);
      yDataItems.forEach((y_data_item) => {
        const newCheckedIds = checkedIds.filter(item => item.label !== `${object}_${ref.reference}`);
        checkedIdsChange(newCheckedIds);
      });
    });
  };

  const searchChange = (e: any) => {
    setKeyword(e.target.value);
  };

  return (
    <div className={`${styles.dataPanel} ${screenState === "full" ? styles.widHid : ""}`}>
      <div className={styles.panelLeft}>
        <div className={styles.searchBox}>
          <Input
            size="large"
            placeholder={t("searchData")}
            bordered={false}
            prefix={<Icon type="search" />}
            onChange={searchChange}
          />
        </div>
        <Divider style={{ margin: 0 }} />
        <Checkbox.Group value={checkedList} onChange={selectChange}>
          {objects
            .filter((obj) => obj && obj.includes(keyword))
            .map((object, index) => (
              <div key={index} className={styles.dataItem}>
                <Checkbox value={object}>{object}</Checkbox>
              </div>
            ))}
        </Checkbox.Group>
      </div>
      <div className={styles.panelRight}>
        {selectedObjects.map(selectedObject => (
          <div key={selectedObject} className={styles.referenceBox}>
            <div className={styles.referenceHeader}>
              <span>{selectedObject}</span>
            </div>
            <Checkbox.Group
              value={referenceCheckedList[selectedObject]?.map(ref => ref.reference) || []}
              onChange={(list) => referenceSelectChange(selectedObject, list)}
            >
              {references[selectedObject]?.map((ref, index) => (
                <div key={index} className={styles.referenceItem}>
                  <Checkbox value={ref.reference} className={styles.referenceLabel}>
                    {ref.reference.length > 20 ? ref.reference.slice(0, 20) + "..." : ref.reference}
                  </Checkbox>
                </div>
              ))}
            </Checkbox.Group>
          </div>
        ))}
      </div>
    </div>
  );
}
