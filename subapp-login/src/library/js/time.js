import moment from "moment"

/**
 * 1时间格式化函数
 * @param {*} date 要格式化的时间
 * @param {*} time 是否使用完整时间
 * @param {*} format 格式
 */
function format(date, time, format) {
  if (!date) return "";
  let _format = format ? format : time ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD"
  return moment(date).format(_format);
}

/**
 * date1是否在date2之后
 * @param {*} date1 
 * @param {*} date2 
 * @param {*} unit 比较的单位
 */
function isAfter(date1, date2, unit = "second") {
  return moment(date1).isAfter(date2, unit); // false
}

export {
  format, // 1时间格式化函数
  isAfter // 2date1是否在date2之后
}