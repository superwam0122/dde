function replaceValues(str: string, values?: Record<string, any>): any {
  if (!values) {
    return str;
  }

  if (/\{.+?\}/g.test(str)) {
    const regex = /\{(.+?)\}/g; // 匹配所有的 {}
    return str.replace(regex, (match, p1) => values[p1] ?? match);
  } else return str;
}

export function translateFunc(
  messages: any,
  id: string,
  values?: Record<string, any>,
) {
  const keys = id.split("."); // 拆分字符串
  let value = messages;
  for (const key of keys) {
    value = (value ?? {})[key];
  }
  return replaceValues(value, values);
}
