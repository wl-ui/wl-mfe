/**
 * @author weilan
 * @time 2020.04.23
 * @description 二次确认弹窗装饰器
 */
import { MessageBox } from "element-ui"

/**
 * 确认删除
 * @param {*} message 
 */
function confirm(message = "是否确认删除所选数据？") {
  return function (target, name, descriptor) {
    let oldValue = descriptor.value;
    descriptor.value = function (...args) {
      MessageBox.confirm(message, '提示')
        .then(oldValue.bind(this, ...args))
        .catch(() => { });
    };

    return descriptor;
  }
}
export default [confirm]