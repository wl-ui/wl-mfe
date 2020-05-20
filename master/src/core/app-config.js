/**
 * @author weilan
 * @time 2020.05.20
 * @name 无需服务端获取的微应用
 */

const noAuthApps = [
  {
    id: "1",
    title: "login",
    icon: "el-icon-monitor",
    module: "subapp-login",
    defaultRegister: true,
    devEntry: "//localhost:6753",
    depEntry: "http://login.mfe.wlui.com.cn/",
    routerBase: "/login",
    children: [
      {
        id: "1-1",
        title: "home",
        url: "/login"
      }
    ]
  },
]

export default noAuthApps;