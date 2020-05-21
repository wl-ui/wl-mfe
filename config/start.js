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
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^subapp|master/.test(i));

if (!fs.existsSync('master/package.json')) {
  console.log('缺少master目录package.json文件！')
  return false;
}

console.log(`即将进入所有模块并启动服务：${JSON.stringify(sub_apps)} ing...`)

const exec = util.promisify(require('child_process').exec);
const maxBufferLength = 2000 * 1024;

function start() {
  sub_apps.forEach(async i => {
    console.log(`${i} 开始启动... 全部启动需要时间，请稍加等候，或刷新浏览器即可`)
    await exec('npm run serve', { cwd: path.resolve(i), maxBuffer: maxBufferLength });
  });
  // 如果是本地node假设服务则开启本地serve服务
  if (fs.existsSync('_server/package.json')) {
    exec('npm run serve', { cwd: path.resolve('_server'), maxBuffer: maxBufferLength });
    console.log(`本地node服务已启动，默认端口3000`)
  }
  const data = fs.readFileSync('master/package.json').toString();
  const json = JSON.parse(data) || { port: 8080 };
  exec('start http://localhost:' + json.port);
};
start();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
