import Http from "wl-http"

// 配置项
const options = {
  axiosOptions: { baseURL: '/nginx' },
  requestInterceptorSuccessCb: config => config,
  responseInterceptorSuccessCb: res => res,
  responseInterceptorErrorCb: err => err,
}

// 实例化http
const http = new Http(options);

export default http;