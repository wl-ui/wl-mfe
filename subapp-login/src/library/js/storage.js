/**
 * auth: weilan
 * time: 2017/02/29
 * des: 存储函数
 */

/**
 * 会话存储-存   -------------------------------------------------------会话存储------------------------------------
 * @param {*} key 键名
 * @param {*} value 值
 */
function sessionSet(key, value) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

/**
 * 会话存储-取
 * @param {*} key 键名
 */
function sessionGet(key) {
  let _data = sessionStorage.getItem(key);
  try {
    return JSON.parse(_data)
  } catch (e) {
    return _data;
  }
}

/**
 * 会话存储-删
 * @param {*} key 键名
 */
function sessionDel(key) {
  sessionStorage.removeItem(key)
}

/**
 * 会话存储-删处全部
 */
function sessionClear() {
  sessionStorage.clear();
}

/**
 * 永久存储-存  -------------------------------------------------------永久存储-----------------------------------
 * @param {*} key 键名
 * @param {*} value 值
 */
function localSet(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * 永久存储-取
 * @param {*} key 键名
 */
function localGet(key) {
  let _data = localStorage.getItem(key);
  try {
    return JSON.parse(_data)
  } catch (e) {
    return _data;
  }
}

/**
 * 永久存储-删
 * @param {*} key 键名
 */
function localDel(key) {
  localStorage.removeItem(key)
}

export {
  sessionSet,
  sessionGet,
  sessionDel,
  sessionClear,
  localSet,
  localGet,
  localDel
}