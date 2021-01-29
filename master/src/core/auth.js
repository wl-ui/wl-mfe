/**
 * @name 处理登陆身份鉴权
 * @author weilan
 * @time 2020.05.20
 */

import store from "../store";
import { DataType } from "wl-core"
/**
* @name 导入获取本地身份token函数
*/
import { getStorageToken } from "@/utils/user-vali"
/**
 * @name 导入接口获取子应用注册表接口
 */
import { getAppConfigsApi } from "@/api/app-configs"
/**
 * @name 导入消息组件
 */
import { wlMessage } from '@/plugins/element';
/**
 * @name 导入qiankun注册微应用方法
 */
import qianKunStart from "./app-register"
/**
 * @name 导入无需服务端获取的微应用
 */
import { noAuthApps, nextAuthApps } from "./app-config"

/**
 * @name 请求获取服务端子应用注册表
 */
const getAppConfigs = () => {
  getAppConfigsApi().then(({ data }) => {
    // 验证请求错误
    if (data.code !== 200) {
      wlMessage({
        type: 'error',
        message: "请求错误"
      })
      return;
    }
    // 验证数据有效性
    let _res = data.data || [];
    if (_res.length === 0) {
      wlMessage({
        type: 'error',
        message: "没有可以注册的子应用数据"
      })
      return;
    }

    // 处理菜单状态共享
    let _menu = [];
    _res.forEach(i => {
      if (DataType.isArray(i.data)) _menu.push(...i.data)
    })
    store.dispatch('menu/setMenu', _menu);
    /**
     * @name 启用qiankun微前端应用，已启动过用手动加载，未启动过正常注册
     */
    qianKunStart([..._res, ...nextAuthApps]);
  })
}

/**
 * @name 验证用户身份并注册微应用
 */
const microAppStart = () => {
  const token = getStorageToken();
  /**
   * @name 已登录状态获取服务端微应用注册表
   */
  if (token) {
    // 处理token状态共享
    store.dispatch('app/setToken', token);
    getAppConfigs();
    return;
  }
  /**
   * @name 默认加载未登录时无需服务端获取的微应用
   */
  qianKunStart(noAuthApps)
}

export default microAppStart