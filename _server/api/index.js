const Router = require('koa-router');

const appConfigs = require('./master/app-configs')

const router = new Router()

router.use(appConfigs.routes(), appConfigs.allowedMethods())

module.exports = router;

