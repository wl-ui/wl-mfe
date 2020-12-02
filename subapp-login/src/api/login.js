import http from "./__http__"

// 1获取bing壁纸接口
const getBingHpImageApi = (params) => http.get({
  baseURL: '/Bing',
  url: '/HPImageArchive.aspx',
  params
})

// 2登录接口
const loginApi = (params) => http.get({
  url: '/Api/Login',
  params
})

export {
  getBingHpImageApi, // 1获取菜单数据接口
  loginApi, // 2登录接口
}