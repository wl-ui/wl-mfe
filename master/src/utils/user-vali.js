/**
 * @author weilan
 * @time 2020.05.19
 * @description 用户身份校验
 */

// 导入核心库本地存储操作类
import { Storage } from "wl-core"
// 导入项目配置项
import SETTING from "@/setting"

/**
 * @name 浏览器本地存储是否有用户的登陆信息
 */
const getStorageToken = () => {
  return Storage.get(SETTING.tokenKey)
}

export {
  getStorageToken
}