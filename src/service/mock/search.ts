//定义了两个数组，dataItems和datalist
export const dataItems: (Omit<API.DataItem, "data"> & {  //dataItem包含了不同类型的的数据项
  url: string;
})[] = [
  {
    label: "氧同位素浓度",
    parentLabel: "氧同位素",
    id: "氧同位素0",
    version:
      "Song, H., Wignall, P.B., Song, H. et al. Seawater Temperature and Dissolved Oxygen over the Past 500 Million Years. J. Earth Sci. 30, 236–243 (2019).",
    reference: "https://doi.org/10.1007/s12583-018-1002-2",
    url: "/csv/氧同位素.csv",
    symbol: "circle_1",
    unit: "‰ VSMOW",
    type: "scatter",
    color: "#2668E8",
  },
  {
    label: "海平面",
    parentLabel: "海平面高度",
    id: "海平面1",
    version: "Baranskaya et al., 2018",
    reference: "https://doi.org/10.1016/j.quascirev.2018.07.033",
    url: "/csv/海平面2.csv",
    symbol: "line",
    unit: "m",
    type: "line",
    color: "#1E90FF",
  },
  {
    label: "海平面",
    parentLabel: "海平面高度",
    id: "海平面0",
    version: "van der Meer et al., 2017",
    reference: "https://doi.org/10.1016/j.gr.2016.11.002",
    url: "/csv/海平面.csv",
    symbol: "line",
    unit: "m",
    type: "line",
    color: "#FC3E28",
  },
  {
    label: "二氧化碳浓度",
    parentLabel: "CO2浓度",
    id: "二氧化碳浓度0",
    version: "CENCO2PIP 2023, Science",
    reference: "https://doi.org/10.1126/science.adi5177",
    url: "/csv/二氧化碳浓度.csv",
    symbol: "circle_1",
    unit: "ppm",
    type: "scatter",
    color: "#FC3E28",
  },
  {
    label: "碳十三同位素浓度",
    parentLabel: "碳同位素",
    id: "碳十三同位素浓度0",
    version: "GTS2020",
    url: "/csv/碳十三同位素浓度.csv",
    reference: "https://doi.org/10.1016/B978-0-12-824360-2.00011-5",
    symbol: "line",
    unit: "per-mile VPDB",
    type: "line",
    color: "#FC3E28",
  },
];

export const datalist: API.SearchItem[] = [  //datalist包含一组搜索项，每个搜索项具有label和list属性
  {
    label: "氧同位素",  //label是搜索项的标签，描述了搜索项的类别或名称
    list: [            //list包含一个数据项的数组，表示该列别下的所有数据项
      {
        id: "氧同位素0",
      },
    ],
  },
  {
    label: "碳同位素",
    list: [
      {
        id: "碳十三同位素浓度0",
      },
    ],
  },
  {
    label: "CO2浓度",
    list: [
      {
        id: "二氧化碳浓度0",
      },
    ],
  },
  {
    label: "海平面高度",
    list: [
      {
        id: "海平面0",
      },
      {
        id: "海平面1",
      },
    ],
  },
  {
    label: "海表温度",
    list: [],
  },
  {
    label: "冰芯氧同位素",
    list: [],
  },
  {
    label: "Na+",
    list: [],
  },
  {
    label: "K+",
    list: [],
  },
  {
    label: "10Be 浓度",
    list: [],
  },
  {
    label: "HSG",
    list: [],
  },
  {
    label: "甲烷浓度",
    list: [],
  },
  {
    label: "纹泥厚度",
    list: [],
  },
  {
    label: "孢粉比率",
    list: [],
  },
  {
    label: "CaC03 比率",
    list: [],
  },
  {
    label: "硅藻比率",
    list: [],
  },
  {
    label: "树轮残差",
    list: [],
  },
].map((item) => {    //通过 map 方法进行处理（map不需要参数，返回所有数据项的version和reference
  item.list.forEach((li: any) => {   //遍历 list 中的每个数据项
    const dataItem = dataItems.find((i) => i.id === li.id);  //通过数据项的 id 在 dataItems 数组中找到一一对应的 dataItem
    li.label = dataItem?.version; //将找到的 dataItem 的 version 和 reference 属性赋值给搜索项的 list 中对应的数据项
    li.reference = dataItem?.reference;
  });
  return item;  //这个过程会为 datalist 数组中的每个搜索项添加version和reference
});
