
const subApps = [
  {
    id: "1",
    title: "wl-ui",
    icon: "el-icon-monitor",
    module: "subapp-ui",
    defaultRegister: true,
    devEntry: "//localhost:6751",
    depEntry: "http://47.98.136.80:2751/ui",
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
    depEntry: "http://47.98.136.80:2751/blog",
    routerBase: "/blog",
    children: [
      {
        id: "2-1",
        title: "思否",
        url: "/blog"
      },
      {
        id: "2-2",
        title: "掘金",
        url: "/blog/juejin"
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
        data: subApps
      }
    }
  },
]
