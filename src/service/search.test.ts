//使用vitest库来测试getDataList函数。如果测试通过，则说明getDataList函数按预期工作，
import { expect, test } from "vitest";//导入测试框架

import { getDataList } from "./search";//导入被测试的函数

test("search data", async () => {    //test函数定义了一个测试用例，描述为"search data"
  const data = await getDataList({ keyword: "氧同位素" });//在测试函数中，首先调用getDataList函数，并传入关键字"氧同位素"
  expect(data[0].label.includes("氧同位素")).toBeTruthy();//使用expect断言来验证返回的数据列表中的第一项的标签是否包含了"氧同位素"关键字，如果包含则测试通过，否则测试失败
});
