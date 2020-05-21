# wl-http

通信层封装

### 1. 实例化http：__http__.js

```js
import Http from "wl-http"

const options = {
  axios: null, // 是否使用外部axios实例，无特殊情况禁止使用
  axiosOptions: {
    retry: 2, //Number 请求失败自动重连次数 默认2
    retryDelay: 1000, // 请求失败自动重连时间间隔 默认1000ms
    withCredentials: true, // Boolean 开启请求跨域 默认true
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }, // Object 请求头配置 默认"Content-Type": "application/json;charset=UTF-8"
    timeout: 5000, // Number 请求超时时间 默认5000
    baseURL: '' // String 请求地址前缀 默认''
    expand: {} // 其他需要扩展的配置项 other axios 支持的config字段
  }, // 以上字段均有默认值，正常情况下 此options 无需提供
  requestInterceptorSuccessCb:()=>{}, // 非必填 请求拦截器成功回调，必须返回一个config对象
  responseInterceptorSuccessCb:()=>{}, // 非必填 响应拦截器成功回调，必须返回一个response对象
  responseInterceptorErrorCb:()=>{}, // 非必填 响应拦截器失败回调，必须返回一个response对象
}, // 实例化http可选配置项 均为非必填项

const http = new Http(options);

export default http;
```

### 2. 在具体的api文件中使用：user.js
```js
import http from "__http__.js"

const getMenuApi = (params) => http.get({
  url:'',
  params
})

const addUserApi = (data) => http.post({
  url:'',
  data
})

export {
  getMenuApi,
  addUserApi
}
```

### 3. 在vue文件中最终调用
```js
import {addUserApi} from "@/api/user.js"

methods: {
  addUser(){
    const _data = {
      name: 'weilan',
      des: '前端架构师'
    }
    addUserApi(_data).then( ({data})=>{
      ...
    })
  }
}
```

### 4. Http类提供 get，post，all，del，put，patch 共6中方法