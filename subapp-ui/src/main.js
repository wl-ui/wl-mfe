import Vue from "vue";
import "./public-path";
import render from './render'

Vue.config.productionTip = false;

let router = null;
let instance = null;
const __qiankun__ = window.__POWERED_BY_QIANKUN__;

export async function bootstrap(props) {
  props.emits.forEach(i => {
    Vue.prototype[`$${i.name}`] = i
  });
}

export async function mount(props) {
  render(props)
}

export async function unmount() {
  instance.$destroy();
  instance = null;
  router = null;
}

// 单独开发环境
__qiankun__ || mount();
