//主要定义了两个函数：getDataList 和 getDataById。这两个函数用于从数据源中获取和筛选数据，并根据指定的参数进行过滤和转换。
import { csvToArray } from "@/utils/csv";

import { dataItems, datalist } from "./mock/search";

import type { TimeScaleType } from "@/components/TimeScale";
import type { StyleParamsType } from "@/components/chore";

/** 获取数据列表 */
export async function getDataList(params: API.SearchDataParams) { //getDataList 函数用于根据给定的搜索参数获取数据列表。
  const data = datalist.filter(
    (item) =>
      item.label.toLowerCase().includes((params.keyword ?? "").toLowerCase()) && //筛选条件为标签包含搜索关键字且列表长度大于零。最后返回符合条件的数据列表
      item.list.length,
  );
  return data;
}

/** 根据id获取数据 */
export async function getDataById(params: {  //getDataById 函数用于根据给定的数据项 ID 获取数据
  id: string;
  timeScaleData?: TimeScaleType;
  styleParams?: StyleParamsType;
}): Promise<API.DataItem | null> {
  const {
    id,
    timeScaleData = { start: 4000, end: 0 },
    styleParams = {},
  } = params;
  //item 是一个变量，用于存储在 dataItems 数组中找到的与传入的 id 匹配的数据项。
  const item = dataItems.find((d) => d.id === id);  //在 dataItems 中查找与 id 匹配的数据项。如果未找到，返回 null
  if (!item) return null;
  const data = await csvToArray(item.url);
  return {
    ...item,
    data: {
      units: data.headers,
      data: data.data.filter(  //过滤时间范围
        (item) =>
          item[0] <= timeScaleData.start && item[0] >= timeScaleData.end,
      ),
    },
    ...styleParams,
  };
}
