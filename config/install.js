/**
 *  auth: weilan
 *  读取文件夹并运行下载依赖
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^subapp|master/.test(i));

console.log(`即将进入所有模块并下载依赖：${JSON.stringify(sub_apps)} ing... 批量下载所有项目依赖推荐使用 npm run cinit`)

const exec = util.promisify(require('child_process').exec);
// npm 源
let registry = process.argv.length === 3 ? 'cnpm install' : 'npm install';

function install() {
  sub_apps.forEach(async i => {
    console.log(`${i} 开始下载，耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec(registry, { cwd: path.resolve(i) });
    console.log(i, 'success', stdout)
    console.error(i, 'error', stderr)
  });
  // 如果是本地node假设服务则下载本地serve服务依赖
  if (fs.existsSync('_server/package.json')) {
    console.log(`本地_server服务 开始下载，耗时较久请耐心等待...`)
    const { stdout, stderr } = exec(registry, { cwd: path.resolve('_server') });
    console.log('_server服务', 'success', stdout)
    console.error('_server服务', 'error', stderr)
  }
};
install()

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
