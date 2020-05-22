const Router = require('koa-router');
const router = new Router()

const data = require("../../data/app-configs")

router.get('/Api/GetAppConfigs', async (ctx, next) => {
  await next();
  let _res = {
    message: '请求成功',
    code: 200,
    data: data
  }
  ctx.body = _res;
});

module.exports = router