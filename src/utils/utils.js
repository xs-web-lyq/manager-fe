/**
 * 工具函数封装
 */

export default {
  formateDate(data, rule) {
    let fmt = rule || "yyyy-MM-dd hh:mm:ss";
    // 模板字符串匹配
    let match = /(y+)/.exec(fmt);
    if (match) {
      fmt = fmt.replace(match[1], data.getFullYear());
    }
    const o = {
      "M+": data.getMonth() + 1,
      "d+": data.getDate(),
      "h+": data.getHours(),
      "m+": data.getMinutes(),
      "s+": data.getSeconds(),
    };
    for (let k in o) {
      let match = new RegExp(`${k}`).exec(fmt);
      if (match) {
        const val = o[k] + "";
        fmt = fmt.replace(
          match[0],
          // 字符串补0，使用字符串截取方法获得想要的长度
          match[0].length == 1 ? val : ("00" + val).substring(val.length)
        );
      }
    }
    return fmt;
  },
};
