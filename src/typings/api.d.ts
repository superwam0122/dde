declare module "dom-to-image";
declare module "papaparse";
declare namespace API {
  interface SearchDataParams {  //搜索数据的参数，包括关键字
    keyword?: string;
  }

  interface SearchItem {  //搜索结果项，包括标签和数据列表
    label: string;
    list: DataVersionItem[];
  }

  interface DataItem {  //数据项的描述，包括 ID、标签、版本、颜色、符号、类型、单位、数据和父标签等信息。
    symbolSize?: number;
    opacity?: number;
    id: string;
    label: string;
    version: string;
    color: string;
    symbol: string;
    type: ChartType;
    unit: string;
    data: Data;
    parentLabel: string;
    reference?: string;
  }

  type ChartType = "line" | "scatter";  //图表类型，可以是线图或散点图

  interface DataVersionItem {  //数据版本项，用于描述数据的不同版本
    id: string;
    label?: string;
    reference?: string;
  }

  interface Data {  //数据接口，包括单位和数据内容
    units: string[];
    data: number[][];
  }

  interface Template<T = any> {  //模板接口，用于描述 API 返回的通用模板，包括数据、代码和消息
    data: T;
    code: number;
    message: string;
  }
}
