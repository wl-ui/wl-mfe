/**
 * auth: weilan
 * time: 2020-03-11
 * des: el自定义表单验证及正则验证
 * rule：el校验以va开头 vaPhone；正则验证以reg开头 
 */

// el手机格式校验
function vaPhone(rule, value, callback) {
  if (!value || regPhone(value)) { callback(); } else { callback(new Error('请输入正确的手机号!')); }
}

// 正则手机格式校验
function regPhone(value) {
  return /^1[3-9][0-9]{9}/.test(value)
}

/**
 * 验证数字
 * @param {*} value 要验证的值
 * @param {*} integer 整数
 */
function isNum(value, integer) {
  if (integer) return /^[0-9]*$/.test(value);
  return /(^[0-9]*$|^[0-9]+.[0-9]{1,6}$)/.test(value);
}

/**
 * 需要校验的表格验证
 * @param {*} columns 表头
 * @param {*} length 长度
 */
function validate(columns, length) {
  let _va_columns = columns.filter(i => i.validate);
  for (let i of _va_columns) {
    for (let t = 0; t < length; t++) {
      let _va_result = this.$refs[i.prop + t].validate()
      if (!_va_result) return false;
    }
  }
  return true;
}

export {
  vaPhone, // el手机格式校验
  regPhone, // 正则手机格式校验
  isNum, // 验证数字
  validate, // 整体表单验证
}