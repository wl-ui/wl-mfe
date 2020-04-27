
const appConfig = [
  {
    id: "1",
    title: "wl-ui",
    icon: "el-icon-monitor",
    module: "subapp-ui",
    defaultRegister: true,
    devEntry: "//localhost:6751",
    depEntry: "http://ui.mfe.wlui.com.cn/",
    routerBase: "/ui",
    children: [
      {
        id: "1-1",
        title: "home",
        url: "/ui"
      },
      {
        id: "1-2",
        title: "about",
        url: "/ui/about"
      }
    ]
  },
  {
    id: "2",
    title: "博客",
    icon: "el-icon-date",
    module: "subapp-blog",
    defaultRegister: false,
    devEntry: "//localhost:6752",
    depEntry: "http://blog.mfe.wlui.com.cn",
    routerBase: "/blog",
    children: [
      {
        id: "2-1",
        title: "报表",
        url: "/blog"
      },
      {
        id: "2-2",
        title: "穿梭框",
        url: "/blog/about"
      }
    ]
  }
]

export default [
  {
    url: '/Api/GetAppConfigs',
    response: () => {
      return {
        code: 200,
        data: appConfig
      }
    }
  },
]
