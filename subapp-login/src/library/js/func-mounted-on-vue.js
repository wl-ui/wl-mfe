/**
 * auth: weilan
 * time: 2020/03/01
 * des: 挂在vue上的函数
 * @param {*} layout 
 * @param {*} opend 
 */

import { format } from "./time"; // 导入时间格式化函数
import { validate } from "./validate"; // 导入整体校验函数

/**
 * 关闭视图函数
 * @param {*} layout 所要关闭的管理视图的对象
 * @param {*} opend 对象中保留打开的一个，关闭其他的
 */
function closeLayout(layout, opend) {
  for (let i in layout) {
    layout[i] = false;
  }
  opend && (layout[opend] = true)
}

const flat = (array, deep = false) => {
  let res = [];
  if (!deep) {
    array.forEach(arr => {
      res.push(...arr)
    });
  }
  return res;
}

const removeEmptyObject = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let obj = array[i];
    let isDel = false;
    for (let key in obj) {
      if (obj[key] !== undefined || obj[key] !== null || obj[key] !== '""') {
        isDel = true;
      }
    }
    if (!isDel) array.splice(i, 1)

  }
  return array;
}
const removeEmptyProperty = (object) => {
  for (let key in object) {
    if (object[key] === undefined || object[key] === null || object[key] === "") {
      delete object[key]
    }
  }
  return object;
}

const deepForEach = (array, fn) => {
  array.forEach(item => {
    if (isArray(item)) {
      deepForEach(item, fn);
    } else if (isObject(item)) {
      objectRecursion(item, fn, array)
    }
    fn(item, array)

  })
}

const objectRecursion = (obj, fn) => {
  for (let key in obj) {
    if (isArray(obj[key])) {
      deepForEach(obj[key], fn)
    } else if (isObject(obj[key])) {
      objectRecursion(obj[key], fn);
    }
  }
}

const isObject = (it) => {
  return Object.prototype.toString.call(it) === "[object Object]"
}

const isArray = (it) => {
  return Object.prototype.toString.call(it) === "[object Array]"
}

const flowStatusFormatter = (row) => {
  let flowStatus = row.status ? row.status : row.flowStatus
  if (flowStatus === "2") {
    return "审批中"

  } else if (flowStatus === "3") {
    return "已审批"
  } else {
    return "未审批"
  }
}

const numTransform = (num) => {
  num = Number(num);
  if (Number.isNaN(num)) {
    return 0;
  } else {
    return num;
  }
}

export {
  closeLayout, // 关闭视图函数
  flat,
  removeEmptyObject,
  removeEmptyProperty,
  format, // 时间格式化函数
  deepForEach,
  isArray,
  isObject,
  flowStatusFormatter,
  numTransform,
  validate, // 整体校验函数
}