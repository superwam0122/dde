//用于将 CSV 文件转换为数组形式
export async function csvToArray(url: string) {
  const response = await fetch(url);  //使用 fetch 函数从指定的 URL 获取 CSV 文件的响应
  const csvText = await response.text();  //将响应的文本内容使用 text() 方法获取，并存储在变量 csvText 中

  const rows = csvText.split("\n");  //将 CSV 文本内容按行拆分，每一行都是一个字符串，使用逗号 , 分隔各个数据项，存储在数组 rows 中
  const headers = rows[0].split(",");  //第一行通常是 CSV 文件的标题，被解析为头部（headers），使用逗号分隔后存储在数组 headers 中

  const data = rows.slice(1).map((rowString) => {  //从第二行开始，每一行都代表一个数据条目，也被解析为数组，并存储在 data 数组中
    return rowString.split(",").map((item) => +item);
  });

  return {  //最后，函数返回一个包含 headers 和 data 的对象，其中 headers 是头部数组，data 是数据数组
    headers,
    data,
  };
}
