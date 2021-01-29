/**
 * @name 子应用注册表数据
 */

const subApps = [
  {
    module: "subapp-ui",
    defaultRegister: true,
    entry: "//localhost:2751",
    routerBase: "/ui",
    data: [
      {
        id: "1",
        title: "wl-ui",
        icon: "el-icon-monitor",
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
      }
    ]
  },
  {
    module: "subapp-blog",
    defaultRegister: false,
    entry: "//localhost:2752",
    routerBase: "/blog",
    data: [
      {
        id: "2",
        title: "博客",
        icon: "el-icon-date",
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
  }
]

module.exports = subApps