const Router = require('koa-router');

const appConfigs = require('./master/app-configs')
const login = require('./login/login')

const router = new Router()

router.use(appConfigs.routes(), appConfigs.allowedMethods());
router.use(login.routes(), login.allowedMethods());

module.exports = router;

