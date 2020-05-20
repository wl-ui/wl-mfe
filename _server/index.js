const Koa = require('koa');
const app = new Koa()
const cors = require('koa2-cors');
const routes = require('./api')
// const httpProxy = require('http-proxy-middleware');

// 设置开启跨域
app.use(cors({
  origin: function (ctx) {
    return ctx.header.origin
  }, // 允许发来请求的域名
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 设置所允许的 HTTP请求方法
  credentials: true, // 标示该响应是合法的
}));

// 代理第三方网站跨域
/* app.use('/', httpProxy({
  // 代理跨域目标接口
  target: 'https://cn.bing.com/',
  changeOrigin: true,
})); */

app.use(routes.routes(), routes.allowedMethods());
app.listen(3000)