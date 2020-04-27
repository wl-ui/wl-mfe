import http from "./__http__"

const getAppConfigsApi = () => http.get({
  url: '/Api/GetAppConfigs',
})

export {
  getAppConfigsApi, // 1获取菜单数据接口
}