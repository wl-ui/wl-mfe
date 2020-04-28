import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from "qiankun";
import store from "./store";
/**
 * @name 导入render函数兼容qiakun1.0装载子应用方法，如果使用2.0container装载则不需要此方法,此处留着注释代码提供兼容qiankun1.0的示例
 * @description 此处留下注释代码仅为提供兼容qiankun1.0示例
 */
// import render from './render';
/**
 * @name 导入接口获取子应用注册表
 */
import { getAppConfigsApi } from "./api/app-configs"
/**
 * @name 导入消息组件
 */
import { wlMessage } from './plugins/element';
/**
 * @name 导入想传递给子应用的方法，其他类型的数据皆可按此方式传递
 * @description emit建议主要为提供子应用调用主应用方法的途径
 */
import emits from "./utils/emit"
/**
 * @name 导入qiankun应用间通信机制appStore
 */
import appStore from './utils/app-store'
/**
 * @name 声明子应用挂载dom，如果不需要做keep-alive，则只需要一个dom即可；
 */
const appContainer = "#subapp-viewport";
/**
 * @name 声明要传递给子应用的信息
 * @param data 主应要传递给子应用的数据类信息
 * @param emits 主应要传递给子应用的方法类信息
 * @param utils 主应要传递给子应用的工具类信息（只是一种方案）
 * @param components 主应要传递给子应用的组件类信息（只是一种方案）
 */
let props = {
  data: store.getters,
  emits
}

/**
 * @name 请求获取子应用注册表并注册启动微前端
 */
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
  // 处理菜单
  store.dispatch('menu/setMenu', _res);
  // 处理子应用注册表数据
  let apps = []; // 子应用数组盒子
  let defaultApp = null; // 默认注册应用
  let isDev = process.env.NODE_ENV === 'development'; // 根据开发环境|线上环境加载不同entry
  _res.forEach(i => {
    apps.push({
      name: i.module,
      entry: isDev ? i.devEntry : i.depEntry,
      container: appContainer,
      activeRule: i.routerBase,
      props: { ...props, routes: i.children, routerBase: i.routerBase }
    })
    if (i.defaultRegister) defaultApp = i.routerBase;
  });
  // 启用qiankun微前端应用
  useQianKun(apps, defaultApp);
})

/**
 * @name 启用qiankun微前端应用
 * @param {*} list 
 * @param {*} defaultApp 
 */
const useQianKun = (list, defaultApp) => {
  /**
  * @name 注册子应用
  * @param {Array} list subApps
  */
  registerMicroApps(
    list,
    {
      beforeLoad: [
        app => {
          console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
        },
      ],
      beforeMount: [
        app => {
          console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
        },
      ],
      afterUnmount: [
        app => {
          console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
        },
      ],
    },
  )

  /**
   * @name 设置默认进入的子应用
   * @param {String} 需要进入的子应用路由前缀
   */
  setDefaultMountApp(defaultApp);

  /**
   * @name 启动微前端
   */
  start();

  /**
   * @name 微前端启动进入第一个子应用后回调函数
   */
  runAfterFirstMounted(() => {
    console.log('[MainApp] first app mounted');
  });
}

/**
 * @name 启动qiankun应用间通信机制
 */
appStore(initGlobalState);