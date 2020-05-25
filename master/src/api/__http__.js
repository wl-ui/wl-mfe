import Http from "wl-http"

// 配置项
const options = {
  axiosOptions: { baseURL: 'http://localhost:3700/' },
  requestInterceptorSuccessCb: config => config,
  responseInterceptorSuccessCb: res => res,
  responseInterceptorErrorCb: err => err,
}

// 实例化http
const http = new Http(options);

export default http;