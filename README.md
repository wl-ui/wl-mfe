# wl-mfe 

基于 vue3.0-beta 及 qiankun2.0 极速尝鲜！微前端进阶实战项目。   
项目地址：[wl-mfe](https://github.com/wl-ui/wl-mfe)

微前端实战详细入门教程及解放方案请转至我另一篇文章：[微前端实战看这篇就够了 - Vue项目篇](https://juejin.im/post/5e1824296fb9a02fde20fec9)。   
项目地址：[wl-micro-frontends [wl-qiankun]](https://github.com/hql7/wl-micro-frontends)  &&  [在线访问](http://mfe.wlui.com.cn/)

### 最终效果
![wl-mfe](http://wlsy.oss-cn-hangzhou.aliyuncs.com/QQ%E5%9B%BE%E7%89%8720200428174450.png)

## 项目启动
```js
npm run yinit    // 使用yarn下载依赖，推荐
npm run cinit    // 使用cnpm下载依赖
npm run init     // 或 使用npm下载依赖

npm run serve    // 运行全部项目
yarn serve y     // yarn运行全部项目

npm run build     // 打包全部项目
yarn build y      // 打包全部项目

npm run publish   // 执行发布脚本
```
注意：如果下载报错，报 bin/sh 找不到start命令，那你可能是mac or linux，那就进入目录一个一个下载运行吧。   
另：执行批量服务耗时较久，请耐心等待，init与build成功会在控制台提示，serve稍加等待或刷新浏览器即可。

## 实战详解todo

- [x] 主应用基座构建
- [x] 子应用构建
- [x] 微应用间通信
- [x] 跨应用通信与vuex结合
- [x] 发布上线

## 主应用基座构建
主应用需要用到elementui，暂时使用vue2.0+qiankun2.0版本。vue3.0beta体验在下面【子应用构建】章节

主应用项目主要在5个文件：`utils`文件夹，`app.vue`，`appRegister.js`，`main.js`，`render.js`

### 前提条件
```js
cnpm i qiankun -S
```
在主应用下载qiankun，注意使用2.0以上版本

### 改造主应用app.vue
```js
<template>
  <div class="main-container-view">
    <el-scrollbar class="wl-scroll">
      <!-- qiankun2.0  container 模式-->
      <div id="subapp-viewport" class="app-view-box"></div>
      <!-- qiankun1.0  render 模式-->
      <div v-html="appContent" class="app-view-box"></div>
      <div v-if="loading" class="subapp-loading"></div>
    </el-scrollbar>
  </div>
</template>

<script>
  export default {
    name: "rootView",
    props: {
      loading: Boolean,
      appContent: String
    }
  };
</script>
```
注意这里，qiankun2.0是根据 `container`字段对应的dom id来注册子应用盒子的，因此只用qiankun2.0的话不需要考虑render注测子应用盒子的情况，下面那两个dom和script里的`props`都可以不要！只留一个`<div id="subapp-viewport"></div>`即可！    
另外：注册子应用时每个子应用都可以指定一个不同的`container`，因此如果想做每个子应用的keep-alive，则可能需要每个子应用对应一个`<div id="subapp-viewport-ui"></div>`，`<div id="subapp-viewport-blog"></div>`盒子

### 将实例化vue方法提取至render.js
```js
import Vue from "vue"
import router from './router'
import store from './store'
import App from './App.vue'

/**
 * @name 提取vue示例化方法
 */
export function vueRender() {
  Vue.config.productionTip = false
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount("#main-container");  
}
```
为什么要仅仅将这段代码从`main.js`摘出呢？一方面是尽量清洁main.js；另一方面，就是为了兼容qiankun1.0的render方法。    
因为qiankun1.0需要在注册vue实例时显式的将`appContent`传入app.vue，如果你不用qiankun1.0版本,则完全不需要以下代码：
```js
/**
 * @description 实例化vue，并提供子应用 render函数模式的装载能力
 * @description 如果使用qiankun2.0 版本，只需正常实例化vue即可 不需要存在此render函数
 * @param {Object} param0 
 * @description {String} appContent 子应用内容
 * @description {Boolean} loading 是否显示加载动画（需手动实现loading效果）
 * @param {Boolean} notCompatible true则不兼容qiankun1.0 【此参数为示例添加，实际应用自酌】
 */
export function vueRender({ appContent, loading }, notCompatible) {
  Vue.config.productionTip = false

  // 实际上本实例只用到此if内的代码
  // 本文件其他代码只为做兼容qiankun1.0 render挂载子应用的参考
  if (notCompatible) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount("#main-container");
    return;
  }

  return new Vue({
    router,
    store,
    data() {
      return {
        appContent,
        loading,
      };
    },
    render(h) {
      return h(App, {
        props: {
          appContent: this.content,
          loading: this.loading
        }
      });
    }
  }).$mount('#main-container');
}

let app = null;

/**
 * @name 提供render装载子应用方法
 * @param {Object} param0 
 * @description {String} appContent 子应用内容
 * @description {Boolean} loading 是否显示加载动画（需手动实现loading效果）
 */
export default function render({ appContent, loading }) {
  if (!app) {
    app = vueRender({ appContent, loading });
  } else {
    app.appContent = appContent;
    app.loading = loading;
  }
}
```
此处是给兼容qiankun1.0 registerMicroApps方法render字段一种方案，事实上升级到2.0完全无压力，因此建议不需要留下臃肿的render方法。

### 将注册子应用的逻辑抽离到appRegister.js
下面用了一个方法将qiankun需要用到的方法全部包装起来，以便后续将注册子应用放到获取后端注册表数据后执行。
```js
/**
 * @name 启用qiankun微前端应用
 * @param {*} list 
 * @param {*} defaultApp 
 */
const useQianKun = (list, defaultApp) => {
  /**
  * @name 注册子应用
  * @param {Array} list subApps
  */
  registerMicroApps(
    [
       {
        name: 'subapp-ui', // 子应用app name 推荐与子应用的package的name一致
        entry: '//localhost:6751', // 子应用的入口地址，就是你子应用运行起来的地址
        container: '#yourContainer', // 挂载子应用内容的dom节点 `# + dom id`【见上面app.vue】
        activeRule: '/ui', // 子应用的路由前缀
      },
    ],
    {
      beforeLoad: [
        app => {
          console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
        },
      ],
      beforeMount: [
        app => {
          console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
        },
      ],
      afterUnmount: [
        app => {
          console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
        },
      ],
    },
  )

  /**
   * @name 设置默认进入的子应用
   * @param {String} 需要进入的子应用路由前缀
   */
  setDefaultMountApp('ui');
  /**
   * @name 启动微前端
   */
  start();
  /**
   * @name 微前端启动进入第一个子应用后回调函数
   */
  runAfterFirstMounted(() => {
    console.log('[MainApp] first app mounted');
  });
}
```

结合请求后端注册表，并给子应用分发路由及数据改造后的完整代码：

```js
import { registerMicroApps, runAfterFirstMounted, setDefaultMountApp, start, initGlobalState } from "qiankun";
import store from "./store";
/**
 * @name 导入render函数兼容qiakun1.0装载子应用方法，如果使用2.0container装载则不需要此方法,此处留着注释代码提供兼容qiankun1.0的示例
 * @description 此处留下注释代码仅为提供兼容qiankun1.0示例
 */
// import render from './render';
/**
 * @name 导入接口获取子应用注册表
 */
import { getAppConfigsApi } from "./api/app-configs"
/**
 * @name 导入消息组件
 */
import { wlMessage } from './plugins/element';
/**
 * @name 导入想传递给子应用的方法，其他类型的数据皆可按此方式传递
 * @description emit建议主要为提供子应用调用主应用方法的途径
 */
import emits from "./utils/emit"
/**
 * @name 导入qiankun应用间通信机制appStore
 */
import appStore from './utils/app-store'
/**
 * @name 声明子应用挂载dom，如果不需要做keep-alive，则只需要一个dom即可；
 */
const appContainer = "#subapp-viewport";
/**
 * @name 声明要传递给子应用的信息
 * @param data 主应要传递给子应用的数据类信息
 * @param emits 主应要传递给子应用的方法类信息
 * @param utils 主应要传递给子应用的工具类信息（只是一种方案）
 * @param components 主应要传递给子应用的组件类信息（只是一种方案）
 */
let props = {
  data: store.getters,
  emits
}

/**
 * @name 请求获取子应用注册表并注册启动微前端
 */
getAppConfigsApi().then(({ data }) => {
  // 验证请求错误
  if (data.code !== 200) {
    wlMessage({
      type: 'error',
      message: "请求错误"
    })
    return;
  }
  // 验证数据有效性
  let _res = data.data || [];
  if (_res.length === 0) {
    wlMessage({
      type: 'error',
      message: "没有可以注册的子应用数据"
    })
    return;
  }
  // 处理菜单并存入主应用Store
  store.dispatch('menu/setMenu', _res);
  // 处理子应用注册表数据。详细数据见 master mock
  let apps = []; // 子应用数组盒子
  let defaultApp = null; // 默认注册应用
  let isDev = process.env.NODE_ENV === 'development'; // 根据开发环境|线上环境加载不同entry
  _res.forEach(i => {
    apps.push({
      name: i.module, // 子应用名
      entry: isDev ? i.devEntry : i.depEntry, // 根据环境注册生产环境or开发环境地址
      container: appContainer,  // 绑定dom
      activeRule: i.routerBase, // 绑定子应用路由前缀
      props: { ...props, routes: i.children, routerBase: i.routerBase } // 将props及子应用路由，路由前缀由主应用下发
    })
    if (i.defaultRegister) defaultApp = i.routerBase; // 记录默认启动子应用
  });
  // 启用qiankun微前端应用
  useQianKun(apps, defaultApp);
})

/**
 * @name 启用qiankun微前端应用
 * @param {*} list 
 * @param {*} defaultApp 
 */
const useQianKun = (list, defaultApp) => {
  /**
  * @name 注册子应用
  * @param {Array} list subApps
  */
  registerMicroApps(
    list,
    {
      beforeLoad: [
        app => {
          console.log('[LifeCycle] before load %c%s', 'color: green;', app.name);
        },
      ],
      beforeMount: [
        app => {
          console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
        },
      ],
      afterUnmount: [
        app => {
          console.log('[LifeCycle] after unmount %c%s', 'color: green;', app.name);
        },
      ],
    },
  )

  /**
   * @name 设置默认进入的子应用
   * @param {String} 需要进入的子应用路由前缀
   */
  setDefaultMountApp(defaultApp);

  /**
   * @name 启动微前端
   */
  start();

  /**
   * @name 微前端启动进入第一个子应用后回调函数
   */
  runAfterFirstMounted(() => {
    console.log('[MainApp] first app mounted');
  });
}

/**
 * @name 启动qiankun应用间通信机制
 */
appStore(initGlobalState);
```
### 注册应用间通信机制 utils文件夹
> 上面注册子应用时，我们看到代码里有传给子应用的`props`和一个`appStore`通信函数。
1. 关于`props`，看过我上个文章的朋友都知道我将props分为那几个模块，实际上，我真正用到的可能就是主应用请求获取下来的`routes`和`routerbase`下发给子应用。
2. 关于`appStore`方法，我是将官方通信机制提取至utils文件夹下的`app-store.js`文件，并和vuex相结合。代码如下：
```js
import store from "@/store";

/**
 * @name 启动qiankun应用间通信机制
 * @param {Function} initGlobalState 官方通信函数
 * @description 注意：主应用是从qiankun中导出的initGlobalState方法，
 * @description 注意：子应用是附加在props上的onGlobalStateChange, setGlobalState方法（只用主应用注册了通信才会有）
 */
const appStore = (initGlobalState) => {
  /**
   * @name 初始化数据内容
   */
  const { onGlobalStateChange, setGlobalState } = initGlobalState({
    msg: '来自master初始化的消息',
  });

  /**
   * @name 监听数据变动
   * @param {Function} 监听到数据发生改变后的回调函数
   * @des 将监听到的数据存入vuex
   */
  onGlobalStateChange((value, prev) => { 
    console.log('[onGlobalStateChange - master]:', value, prev);
    store.dispatch('appstore/setMsg', value.msg)
  });

  /**
   * @name 改变数据并向所有应用广播
   */
  setGlobalState({
    ignore: 'master',
    msg: '来自master动态设定的消息',
  });
}

export default appStore;
```
【注意：如未在主应用注册通信，则在子应用也获取不到通信方法】

### 改造main.js
终于我们来到了最后一步，主应用一切改造完成之后，我们将其引入到main.js并执行：
```js
/**
 * @name 统一注册外部插件、样式、服务等
 */
import './install'

/**
 * @name 微前端基座主应用vue实例化
 * @description 为了兼容 qiankun1.0 的render函数装载子应用能力
 * @description 2.0版本正常实例化vue即可，不需要此render函数
 * @description qiankun registerMicroApps方法 render用到，如果使用container装载子应用，无需此render函数
 * @deprecated 本示例只针对 qiankun2.0 因此只留下注释后的代码在此提醒各位读者如何兼容qiankun1.0
 */
/* import render from './render';
render({ loading: true }) */
import { vueRender } from './render'
vueRender({}, true)

/**
 * @name 注册微应用并启动微前端
 */
import './appRegister'
```

## 子应用构建

子应用使用vue3.0beta尝鲜，大部分时间都用在找3.0的api上，还有许多未解决的问题，比如往vue实例上挂载方法，手动注销vue是啥api，怎么注册插件比如elementUI等，后续会慢慢补充。    
这里使用vue3.0beta实现demo效果已经没问题！

### vuecli初始化项目并升级至vue3.0beta
默认你已经装了vuecli3.0以上版本
```js
vue crate subapp-ui

cd subapp-ui

// 在此之前都是正常创建项目，到这里执行下面命令会以插件的形式将项目升级至3.0
vue add vue-next 
```
在这里不单独赘述vue3.0beta的特性，对此网上有许多文章。我们在实践我们微前端的需求实际应用中取逐渐解开它的神秘面纱！

### 改造子应用vue.config.js文件
注意设置publicPath、端口号与注册子应用时一致    
注意开发时开启headers跨域头信息   
注意output按照规定格式打包    
```js
const { name } = require("./package");
const port = 6751; // dev port
const dev = process.env.NODE_ENV === "development";

module.exports = {
  publicPath: dev ? `//localhost:${port}` : "/",
  filenameHashing: true,
  devServer: {
    hot: true,
    disableHostCheck: true,
    port,
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: "umd",
      jsonpFunction: `webpackJsonp_${name}`
    }
  }
};

```
### 在main.js同级添加 public-path.js
```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```
### 在main.js同级添加 life-cycle.js 统一设置子应用生命周期逻辑
我在这里区分微前端环境和单独运行的加载机制，并引入官方通信方法    
> 注意：3.0beta的实例化方法为 createApp,并且注册路由是通过连续use的方法，详见下放代码：    
> 注意：3.0的router实例化方法为 createRouter, 注意history模式通过createWebHistory方法实现，并且此方法接受一个参数表示路由前缀   
> 注意：3.0的vuex倒是变化不大，但暂未弄明白3.0的mapGetters，mapActions的使用方法
```js
import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import store from "./store";
import selfRoutes from "./router/routes";

/**
 * @name 导入自定义路由匹配方法
 */
import routeMatch from "./router/routes-match";
/**
 * @name 导入官方通信方法
 */
import appStore from "./utils/app-store";

const __qiankun__ = window.__POWERED_BY_QIANKUN__;
let router = null;
let instance = null;

/**
 * @name 导出生命周期函数
 */
const lifeCycle = () => {
  return {
    /**
     * @name 微应用初始化
     * @param {Object} props 主应用下发的props
     * @description  bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发
     * @description 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等
     */
    async bootstrap(props) {
      console.log('props:', props)
      /* props.emits.forEach(i => {
        Vue.prototype[`$${i.name}`] = i;
      }); */
    },
    /**
     * @name 实例化微应用
     * @param {Object} props 主应用下发的props
     * @description 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
     */
    async mount(props) {
      // 注册应用间通信
      appStore(props);
      // 注册微应用实例化函数
      render(props);
    },
    /**
     * @name 微应用卸载/切出
     */
    async unmount() {
      instance.$destroy?.();
      instance = null;
      router = null;
    },
    /**
     * @name 手动加载微应用触发的生命周期
     * @param {Object} props 主应用下发的props
     * @description 可选生命周期钩子，仅使用 loadMicroApp 方式手动加载微应用时生效
     */
    async update(props) {
      console.log("update props", props);
    }
  };
};

/**
 * @name 子应用实例化函数
 * @param {Object} props param0 qiankun将用户添加信息和自带信息整合，通过props传给子应用
 * @description {Array} routes 主应用请求获取注册表后，从服务端拿到路由数据
 * @description {String} 子应用路由前缀 主应用请求获取注册表后，从服务端拿到路由数据
 */
const render = ({ routes, routerBase, container } = {}) => {
  router = createRouter({
    history: createWebHistory(__qiankun__ ? routerBase : "/"),
    routes: __qiankun__ ? routeMatch(routes, routerBase) : selfRoutes
  });
  instance = createApp(App).use(router).use(store).mount(container ? container.querySelector("#app") : "#app");
};

export { lifeCycle, render };
```

### 在 utils/app-store.js 编写应用间的通信逻辑处理
```js
import store from "@/store";
import { DataType } from "wl-core"

/**
 * @name 声明一个常量准备将props内的部分内容储存起来
 */
const STORE = {};

/**
 * @name 启动qiankun应用间通信机制
 * @param {Object} props 官方通信函数
 * @description 注意：主应用是从qiankun中导出的initGlobalState方法，
 * @description 注意：子应用是附加在props上的onGlobalStateChange, setGlobalState方法（只用主应用注册了通信才会有）
 */
const appStore = props => {
  /**
   * @name 监听应用间通信，并存入store
   */
  props?.onGlobalStateChange?.(
    (value, prev) => {
      console.log(`[onGlobalStateChange - ${props.name}]:`, value, prev)
      store.dispatch('appstore/setMsg', value.msg)
    },
    true
  );
  /**
   * @name 改变并全局广播新消息
   */
  props?.setGlobalState?.({
    ignore: props.name,
    msg: `来自${props.name}动态设定的消息`,
  });

  /**
   * @name 将你需要的数据存起来，供下面setState方法使用
   */
  STORE.setGlobalState = props?.setGlobalState;
  STORE.name = props.name;
};

/**
 * @name 全局setState方法，修改的内容将通知所有微应用
 * @param {Object} data 按照你设定的内容格式数据 
 */
const setState = (data) => {
  if (!DataType.isObject(data)) {
    throw Error('data必须是对象格式');
  }
  STORE.setGlobalState?.({
    ignore: STORE.name,
    ...data
  })
}

export {
  setState
}
export default appStore;
```
这里分别导出了`setState`，`appStore`两个方法，`appStore`在上面`life-cycle.js`生命周期文件中注册全局通信使用，那么`setState`我们又要在哪里使用呢？我们继续往下看

### 改造子应用的main.js
将生命周期函数导出，并提供单独运行逻辑
```js
import "./public-path";
import { lifeCycle, render } from "./life-cycle";

/**
 * @name 导出微应用生命周期
 */
const { bootstrap, mount, unmount } = lifeCycle();
export { bootstrap, mount, unmount };

/**
 * @name 单独环境直接实例化vue
 */
const __qiankun__ = window.__POWERED_BY_QIANKUN__;
__qiankun__ || render();

```
### 在子应用的某个.vue文件中实践一下吧
这里在`views/index.vue`做实战演练
要求：
1. 能使用 Vue 3.0 beta 基本特性体验
2. 接收全局消息，并能向其他微应用发布消息
直接上代码：
```js
<template>
  <div class="home">
    <div class="msg-box">
      <div class="msg-title">这里是子应用：</div>
      <div class="msg-context">{{selfMsg}}</div>
    </div>
    <div class="msg-box">
      <div class="msg-title">来自其他微应用的消息：</div>
      <div class="msg-context">{{vuexMsg}}</div>
    </div>
    <div class="msg-box">
      <div class="msg-ipt-box">
        <input class="msg-ipt" type="text" v-model="formMsg" placeholder="请输入你想广播的话" />
      </div>
      <div class="msg-btn-box">
        <button class="msg-btn" @click="handleVuexMsgChange">发送广播</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, getCurrentInstance } from "vue";
import { setState } from "@/utils/app-store";

export default {
  name: "Home",
  setup() {
    /**
     * @name 通过getCurrentInstance方法得到当前上下文
     */
    const { ctx } = getCurrentInstance();
    /**
     * @name 定义一个初始数据
     */
    const selfMsg = ref("subapp-ui");
    /**
     * @name 定义一个计算属性，返回vuex中的数据
     */
    const vuexMsg = computed(() => ctx.$store.getters.msg);
    /**
     * @name 定义一个表单元素v-model绑定的变量
     */
    const formMsg = ref("");

    /**
     * @name 定义一个广播事件
     */
    const handleVuexMsgChange = () => {
      /**
       * @name 注意：在setup内部使用定义的变量，需要用**.value取值！
       */
      setState({
        msg: formMsg.value
      });
    };

    // 注意变量和事件都要return出来
    return {
      selfMsg,
      vuexMsg,
      formMsg,
      handleVuexMsgChange
    };
  }
};
</script>
```
## 发布上线

### 使用脚本文件提高发布效率
在根目录执行`npm run publish`会执行发布脚本，根据提示选择要发布到的服务器和要发布的应用，按指示选择后回车执行即可。
注意为保持发布脚本的精简，默认你要发布的应用已经打包出了dist目录。

### 常规多端口nginx配置
根据`qiankun`的子应用注册规则，给每个子应用分配一个端口，nginx正常配置监听多个端口即可。
详细配置见`_nginx`目录下`general-port.conf`

### 双端口nginx配置（git切换到dual-port分支）
有些项目应用场景及客户要求限制，无法根据子应用的数量无节制的开放端口，因此尝试将主应用独立一个端口，子应用共用一个端口的nginx配置。
详细配置见`_nginx`目录下`dual-port.conf`

> 使用双端口nginx配置需要对前面教程里的配置做部分改动
#### 修改主应用中registerMicroApps注册子应用的数据
```js
 registerMicroApps(
    [
       {
        name: 'subapp-ui', // 子应用app name 推荐与子应用的package的name一致
        entry: 'http://192.168.1.100:2751/ui', // 子应用的入口地址
        container: '#yourContainer', // 挂载子应用内容的dom节点 `# + dom id`【见上面app.vue】
        activeRule: '/ui', // 子应用的路由前缀
      },
    ],
 )
```
>注意: entry由端口地址变成了端口地址+此子应用的路径（//localhost:2751/ui）。且注意这个/ui路径后面要讲到

#### 修改子应用
1. 取消public-path.js，不再使用这个打包路径，下面这段代码删除
```js
if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}
```
2. 修改vue.config.js文件publicPath字段,并和注册时的entry保持一致
```js
module.exports = {
  publicPath: 'http://192.168.1.100:2751/ui'
  ...
}
```
3. 子应用的路由前缀应为‘/ui’，和前面两个保持一致
```js
const render = ({ routerBase } = {}) => {
  router = new VueRouter({
    base: __qiankun__ ? routerBase : "/",
    mode: "history",
    routes: []
  });
```

4. 配置nginx（见：_nginx/dual-port.conf）

#### 此项目部署阿里云练手教程
1. 将全部微应用和config、_server应用install
2. 打包所有微应用
3. 将config/deploy.js的服务器ip账号密码端口路径改为你的
4. 在根目录执行npm run publish选择服务器和子应用，后点击回车部署到服务器
5. 登陆服务器，将_nginx/wl-mfe.conf inclouds到你的nginx.conf重启nginx使其生效
6. 将_server复制到服务器中并使用pm2运行
7. 检查服务器防火墙和安全组有没有开放2750,2751,3000端口
> 至此即可通过nginx的配置实现一个端口下对所有子应用资源进行匹配转发。

[双端口部署微前端线上预览](http://47.98.136.80:2750/)

到这里已经完成了一个简单使用的 vue3.0 + qiankun2.0 微前端应用实践，快来上手试试吧！
项目地址：[Github](https://github.com/wl-ui/wl-mfe);

### 单端口nginx配置
需求场景承接双端口配置，更近一步，有些极端发布环境只给开放一个端口，或者禁止开放跨域要求主应用和所有子应用做成同域！
详细配置见`_nginx`目录下`single-port.conf`. （单端口思路大致如此，暂未进行测试）

#### 修改主应用中registerMicroApps注册子应用的数据
```js
 registerMicroApps(
    [
       {
        name: 'subapp-ui', // 子应用app name 推荐与子应用的package的name一致
        entry: 'http://192.168.1.100:2750/ui', // 子应用的入口地
        container: '#yourContainer', // 挂载子应用内容的dom节点 `# + dom id`【见上面app.vue】
        activeRule: '/ui', // 子应用的路由前缀
      },
    ],
 )
```
>注意: entry由端口地址变成了主应用端口地址+此子应用的路径（//localhost:2750/ui）。注意和双端口差别

#### 修改子应用
基本和双端口一直，唯一的区别是publicPath变成了主应用端口+子应用路径
```js
module.exports = {
  publicPath: 'http://192.168.1.100:2750/ui'
  ...
}
```
> 至此即可通过nginx的配置实现主子应用同端口。（见：_nginx/single-port.conf）

#### 单端口配置虽未测试但可预见的问题
1. 可能造成qiankun检查不到子应用导出的生命周期
2. 可能造成在子应用路由中刷新变成独立运行子应用
3. 可能进入子应用却未进入主应用造成白屏
> 这些问题如果发生，可通过调整nginx配置等来实现单端口运行主+子应用。因为这是被理论和实践皆已证明的。

## 注意事项
1. 在主应用中使用window.history.pushState();跳转，在vue子应用中，使用router-link跳转会报错；使用router.push()会造成刷新；使用router.replace无异常

## 友情链接

### 微前端 & qiankun
[可能是你见过最完善的微前端解决方案](https://juejin.im/post/5d560292e51d4561a60d9dd9)   
[微前端的核心价值](https://juejin.im/post/5de7a80ef265da33d451e183)   
[目标是最完善的微前端解决方案 - qiankun 2.0](https://juejin.im/post/5e97ddc76fb9a03c90379b8d)   
[qiankun](https://github.com/umijs/qiankun)

### vue3.0beta
[Vue 3.0 全家桶抢先体验](https://juejin.im/post/5e99c21b6fb9a03c590dfea8#heading-11)

### 打赏咖啡
如果你有心，可以请作者喝杯咖啡，或者推荐一份好工作

<div>
  <img src="http://wlsy.oss-cn-hangzhou.aliyuncs.com/apply.jpg" height="330" width="220" />
  <img src="http://wlsy.oss-cn-hangzhou.aliyuncs.com/wx.jpg" height="330" width="220" />
</div>
