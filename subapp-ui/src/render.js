import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import store from "./store";
import selfRoutes from "./router/routes";
import routeMatch from "./router/routes-match"; // 导入路由匹配文件路径函数
const __qiankun__ = window.__POWERED_BY_QIANKUN__;

const render = ({ routes, routerBase, container } = {}) => {
  let router = new VueRouter({
    base: __qiankun__ ? routerBase : "/",
    mode: "history",
    routes: __qiankun__ ? routeMatch(routes, routerBase) : selfRoutes
  });
  let instance = new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount(container ? container.querySelector('#app') : '#app');
  return {
    router,
    instance
  }
}

export default render