import http from "./__http__"

// 1获取bing壁纸接口
const getBingHpImageApi = (params) => http.get({
  url: '/Bing/HPImageArchive.aspx',
  params
})

export {
  getBingHpImageApi, // 1获取菜单数据接口
}