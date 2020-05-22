const Router = require('koa-router');
const router = new Router();
const jwt = require('jsonwebtoken')
const tokenKey = 'wl-mfe-jwt';

router.post('/Api/Login', async (ctx, next) => {
  await next();
  const userInfo = ctx.request.body;
  const vaSuccess = userInfo && userInfo.account && userInfo.password;
  if (vaSuccess) {
    const userToken = {
      account: userInfo.account
    }
    const token = jwt.sign(userToken, tokenKey, { expiresIn: '24h' })  //token签名 有效期为1小时
    ctx.set('authorization', token);
    ctx.set("Access-Control-Expose-Headers", "authorization");
    ctx.body = {
      message: '请求成功',
      code: 200
    }
  } else {
    ctx.body = {
      message: '参数错误',
      code: 300
    }
  }
});

module.exports = router