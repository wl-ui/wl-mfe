/**
 * @name 子应用注册表数据
 */

const subApps = [
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

module.exports = subApps