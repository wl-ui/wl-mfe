/**
 *  auth: weilan
 *  读取文件夹并运行下载依赖
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { log } = require('./utils/log'); // 用于美化控制点打印
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^_server|config|master|subapp/.test(i));

log.blue(`即将进入所有模块并下载依赖：${JSON.stringify(sub_apps)} ing... 批量下载所有项目依赖推荐使用 npm run cinit 或 npm run yinit`)

const exec = util.promisify(require('child_process').exec);
// npm 源
const registry = process.argv[2];
let registry_script = registry === 'cnpm' ? 'cnpm install' : registry === 'yarn' ? 'yarn install' : 'npm install'

function install() {
  sub_apps.forEach(async i => {
    if (!fs.existsSync(`${i}/package.json`)) {
      log.error(`${i} 应用缺少package.json文件，将跳过此应用`)
      return false;
    }
    if (fs.existsSync(`${i}/node_modules`)) {
      log.green(`${i} 应用已检测到node_modules目录，将跳过此应用`)
      return false;
    }
    log.blue(`${i} 开始下载，耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec(registry_script, { cwd: path.resolve(i) });
    log.cyan(i, 'success', stdout)
    log.red(i, 'error', stderr)
  });
};
install()

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
