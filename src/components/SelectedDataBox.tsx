import { Checkbox, Col, Divider, Row } from "antd";
import { createStyles } from "antd-style";
import { useAtom } from "jotai";
import { useMemo } from "react";

import { restoreChart } from "@/event";
import { currentTimeAtom } from "@/globals/timeScale";
import useT from "@/hooks/use-t";
import { getDataById } from "@/service/search";

import { Icon } from "./Icon";

import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { CheckboxValueType } from "antd/es/checkbox/Group";
import type { TimeScaleType } from "./TimeScale";

const CheckboxGroup = Checkbox.Group;

interface SelectedDataBoxProps {
  data: API.SearchItem;
  checkedIds: API.DataItem[];
  checkedIdsChange: (list: API.DataItem[]) => void;
}

const blockStyles = createStyles(({ css, token }) => ({
  dataBox: css`
    width: 12rem;
    background: #fff;
    border: 1px solid ${token.colorBorderBg};
    border-radius: 4px;
  `,
  header: css`
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
  `,
  title: css`
    font-weight: 500;
  `,
  checkall: css`
    color: #999;
  `,
  dataItem: css`
    padding: 0.5rem 1rem 0.5rem 1rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 200ms;
    &:hover {
      background: #f9f9fb;
    }
  `,
  dataItemLabel: css`
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  `,
  link: css`
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: background-color 200ms;
    &:hover {
      background: #d5d5d8;
    }
    cursor: pointer;
  `,
}));

export default function SelectedDataBox(props: SelectedDataBoxProps) {
  const { data, checkedIds, checkedIdsChange } = props;
  const { styles } = blockStyles();
  const t = useT("selectedDataBox");
  const [currentTime, setCurrentTime] = useAtom(currentTimeAtom);

  // 确保 data 和 data.list 存在
  if (!data || !data.list) {
    return null;
  }

  // 计算已选中的数据项列表
  const checkedList = useMemo(() => {
    return checkedIds
      .filter((item) => data.list.find((listItem) => listItem.id === item.id))
      .map((item) => item.id);
  }, [checkedIds, data.list]);

  // 计算全选和半选状态
  const checkAll = data.list.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < data.list.length;

  const getCheckedList = (
    list: CheckboxValueType[],
    timeScaleData?: TimeScaleType,
  ) => {
    if (list.length) {
      Promise.all(
        list.map((item) => getDataById({ id: item as string, timeScaleData })),
      ).then((res) => {
        // 保留上传的数据（假设上传的数据的 id 是 "upload"）
        const uploadedData = checkedIds.filter((item) => item.id === "upload");

        const currentAllShowIds = [
          ...uploadedData,
          ...checkedIds.filter(
            (item) =>
              !(
                data.list.map((dlItem) => dlItem.id).includes(item.id) &&
                !list.includes(item.id)
              ) && item.id !== "upload",
          ),
        ];
        res.forEach((item) => {
          if (
            item &&
            currentAllShowIds.findIndex((showId) => showId.id === item.id) ===
              -1
          ) {
            currentAllShowIds.push(item);
          }
        });
        checkedIdsChange(currentAllShowIds);
      });
    } else {
      checkedIdsChange(
        checkedIds.filter(
          (item) =>
            item.id === "upload" || // 保留上传的数据
            data.list.findIndex((listItem) => listItem.id.includes(item.id)) ===
              -1,
        ),
      );
    }
  };

  // 处理复选框状态变化
  const onChange = (list: CheckboxValueType[]) => {
    const time = checkedIds.length ? currentTime : undefined;
    getCheckedList(list, time);
    restoreChart(); // 恢复图表到初始状态
  };

  // 处理全选框状态变化
  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const list = e.target.checked ? data.list.map((item) => item.id) : [];
    onChange(list);
  };

  return (
    <div className={styles.dataBox}>
      <div className={styles.header}>
        <span className={styles.title}>{data.label}</span>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
          className={styles.checkall}
        >
          {t("checkall")}
        </Checkbox>
      </div>

      <Divider style={{ margin: 0 }} />
      <CheckboxGroup
        style={{ width: "100%" }}
        value={checkedList}
        onChange={onChange}
      >
        <Row>
          {data.list.map((item) => (
            <Col span={24} key={item.id} className={styles.dataItem}>
              <Checkbox value={item.id}>
                <div className={styles.dataItemLabel} title={item.label}>
                  {item.label}
                </div>
              </Checkbox>
              <div className={styles.link} title={item.reference}>
                <Icon type="link" onClick={() => window.open(item.reference)} />
              </div>
            </Col>
          ))}
        </Row>
      </CheckboxGroup>
    </div>
  );
}
