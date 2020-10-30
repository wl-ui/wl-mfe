/**
 *  auth: weilan
 *  读取文件夹并打包项目
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { log } = require('./utils/utils'); // 用于美化控制点打印
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^subapp|master/.test(i));

const argv = process.argv;

if (argv.length == 4 && argv[2] == 'no') {
  sub_apps = sub_apps.filter(i => i != argv[3])
}

let theSource = argv[2] === 'y' ? 'yarn build' : 'npm run build';

log.green(`即将进入所有模块并打包项目：${JSON.stringify(sub_apps)} ing...`)

const exec = util.promisify(require('child_process').exec);
function build() {
  sub_apps.forEach(async i => {
    log.blue(`${i} 开始打包,耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec(theSource, { cwd: path.resolve(i) });
    log.cyan(i, 'success', stdout)
    log.red(i, 'error', stderr)
  });
};
build();

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
