
/**
 * @name 导入插件
 */
import FtUi from "./ui/index"; // 导入ui
import VueClipboard from 'vue-clipboard2';
/**
 * @name 导入方法
 */
import * as FUNCONVUE from "./js/func-mounted-on-vue" // 导入需要挂载在vue上的方法
import * as TOOL from "./js/tool.js"
import * as STORAGE from "./js/storage.js"
import * as VALIDATOR from "./js/validator.js"
import directives from "./js/directives"; // 添加全局指令
/**
 * @name 导入样式
 */
import './css/install.scss'

/**
 * library挂载vue实例函数
 * @param {*} vue vue实例
 * @param {*} store vuex实例
 */
const libraryInstall = (vue, store) => {
  vue.use(FtUi);
  vue.use(VueClipboard);

  // 注册需要挂载在vue上的工具类
  let object = { ...FUNCONVUE, ...TOOL, ...STORAGE, ...VALIDATOR };
  for (let key in object) {
    vue.prototype[key] = object[key];
  }

  directives.map(i => vue.directive(i.name, i.rule(store)))
}

export default libraryInstall;