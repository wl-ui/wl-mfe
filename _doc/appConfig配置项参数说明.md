# appConfig配置参数说明

需要授权的apps在`_server/data/appConfigs`配置

无需授权的apps在`master/core/app-config`配置

```js
 {
    module: "subapp-device",                    // 模块名，和子应用目录名、package.js name 一致
    defaultRegister: false,                     // 是否默认显示子应用，只能存在一个true
    devEntry: "//localhost:6752",               // 开发环境子应用入口，为你运行时子应用ip+port
    depEntry: "http://",                        // 生产环境子应用入口，为线上地址
    routerBase: "/device",                      // 子应用routerBase，此子应用的路由都会挂上此前缀
    data: [                                     // 子应用模块及菜单、路由数据
      {
        id: "2",
        title: "设备管理",                       // 一级菜单
        icon: "el-icon-cpu",                    // 图标
        children: [                             // 二级菜单
          {
            id: "2-1",
            title: "设备类型",
            url: "/device/category"             // 子应用页面路由
          },
          {
            id: "2-2",
            title: "设备列表",
            url: "/device/device"
          },
          {
            id: "3-2",
            title: "网关配置",
            url: "/device/gateway"
          }
        ]
      }
    ]
  },
```