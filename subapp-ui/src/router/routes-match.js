/**
 * 根据路由匹配地址
 * @param {*} data 路由数据
 * @param {*} base 路由前缀
 * @param {*} options 粗略的配置项
 */
function routeMatch(data, base, options = { url: 'url', name: 'name', id: "id", permissions: 'permissions' }) {
  if (!Array.isArray(data)) return [];
  // 创建路由盒子
  let routerBox = [];
  // 遍历处理路由 
  data.forEach(item => {
    if (!item[options.url]) return;
    let _url = item[options.url].replace(base, '');
    try {
      let routerItem = {
        path: _url, // 路由路径名
        component: () => import(`@/views${_url}/index.vue`) // 路由映射真实视图路径
      };
      routerBox.push(routerItem);
    } catch (err) {
      console.log(err)
    }
  });

  let errorBox = {
    path: "*",
    redirect: "/err-404"
  };
  routerBox.push(errorBox)
  return routerBox;
}

export default routeMatch
