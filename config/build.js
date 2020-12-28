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
const inquirer = require('inquirer'); // 用于命令行交互

/**
 * @name 命令行交互配置项，选择要打包的模块
 */
const question = [
  {
    type: 'checkbox',
    name: 'apps',
    message: '请选择要打包的模块（按a全选，按回车直接打包全部）',
    choices: sub_apps,
  },
]

/**
 * @name 选择指定模块并打包，如未选择全部打包
 */
inquirer.prompt(question).then(async (answer) => {
  let sub_apps_ = answer.apps.length ? answer.apps : sub_apps
  build(sub_apps_)
});

const exec = util.promisify(require('child_process').exec);

function build() {
  log.green(`即将进入模块并打包：${JSON.stringify(sub_apps)} ing...`)
  sub_apps.forEach(async i => {
    log.blue(`${i} 开始打包,耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec('yarn build', { cwd: path.resolve(i) });
    log.cyan(i, 'success', stdout)
    log.red(i, 'error', stderr)
  });
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
