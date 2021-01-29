/**
 * @author weilan
 * @time 2020.05.20
 * @name 无需服务端获取的微应用
 */
const href = "http://" + location.hostname;

// 无需登录的应用
const noAuthApps = [
  {
    module: "subapp-login",
    defaultRegister: true,
    entry: href + ':2753',
    routerBase: "/login",
    useExternals: true,
    data: [
      {
        id: "1",
        title: "login",
        icon: "el-icon-monitor",
        children: [
          {
            id: "1-1",
            title: "home",
            url: "/login"
          }
        ]
      }
    ]
  },
]

// 需要登陆身份但是和模块菜单授权无关的子应用
const nextAuthApps = [

]

export { noAuthApps, nextAuthApps };