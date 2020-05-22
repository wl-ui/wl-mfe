const Koa = require('koa');
const app = new Koa()
const cors = require('koa2-cors');
const routes = require('./api')
const bodyParser = require('koa-bodyparser');
/* const jwtKoa = require('koa-jwt')
const tokenKey = 'wl-mfe-jwt';
 */
/* const util = require('util')
const verify = util.promisify(jwt.verify) // 解密 */

// 设置开启跨域
app.use(cors({
  origin: function (ctx) {
    return ctx.header.origin
  }, // 允许发来请求的域名
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // 设置所允许的 HTTP请求方法
  credentials: true, // 标示该响应是合法的
}));

// 引入post中间件
app.use(bodyParser());

// 设置不验证jwt的路径
/* app.use(jwtKoa({ tokenKey }).unless({
  path: [/^\/Api\/Login/] //数组中的路径不需要通过jwt验证
})) */

app.use(routes.routes(), routes.allowedMethods());
app.listen(3000)