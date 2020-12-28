/**
 *  auth: weilan
 *  读取文件夹并运行服务
 */
/* let port = 8080;
try {
  const masterConfig = require('../master/vue.config');
  port = masterConfig.devServer.port
} catch (err) {
  port = 8080;
} */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { log } = require('./utils/utils'); // 用于美化控制点打印
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^_server|master|subapp/.test(i));
const inquirer = require('inquirer'); // 用于命令行交互
const exec = util.promisify(require('child_process').exec);
const maxBufferLength = 2000 * 1024;

/**
 * @name 命令行交互配置项，选择要启动的模块
 */
const question = [
  {
    type: 'checkbox',
    name: 'apps',
    message: '请选择要启动的模块（按a全选，按回车直接运行全部）',
    choices: sub_apps,
  }
]

/**
 * @name 选择指定模块并启动，如未选择全部运行
 */
inquirer.prompt(question).then(async (answer) => {
  let sub_apps_ = answer.apps.length ? answer.apps : sub_apps
  start(sub_apps_)
});

function start(sub_apps_) {
  log.green(`即将进入模块并启动服务：${JSON.stringify(sub_apps_)} ing...`)

  sub_apps_.forEach(async i => {
    if (!fs.existsSync(`${i}/package.json`)) {
      log.red(`${i} 应用缺少package.json文件，将跳过此应用`)
      return false;
    }
    if (!fs.existsSync(`${i}/node_modules`)) {
      log.red(`${i} 应用未检测到node_modules目录，将跳过此应用`)
      return;
    }
    let packageJson = fs.readFileSync(`${i}/package.json`).toString();
    let packageData = JSON.parse(packageJson);
    log.cyan(`${i} 开始启动... 端口：${packageData.port} 全部启动需要时间，请稍加等候，或刷新浏览器即可`)
    await exec('npm run serve', { cwd: path.resolve(i), maxBuffer: maxBufferLength });
  });
  const packageJson = fs.readFileSync('master/package.json').toString();
  const packageData = JSON.parse(packageJson);
  exec('start http://localhost:' + packageData.port);
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
