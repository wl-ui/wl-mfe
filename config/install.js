/**
 *  auth: weilan
 *  读取文件夹并运行下载依赖
 */

const fs = require('fs');
const path = require('path');
const util = require('util');
const { log } = require('./utils/utils'); // 用于美化控制点打印
const sub_app_ath = path.resolve();
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^_server|config|master|subapp/.test(i));
const inquirer = require('inquirer'); // 用于命令行交互

const exec = util.promisify(require('child_process').exec);

/**
 * @name 命令行交互配置项，选择要启动的模块
 */
const question = [
  {
    type: 'list',
    name: 'npm',
    message: '请选择要使用的包管理器',
    choices: ['yarn', 'npm', 'cnpm'],
  },
  {
    type: 'checkbox',
    name: 'apps',
    message: '请选择要install的模块（按a全选，按回车直接install全部）',
    choices: sub_apps,
  },
  {
    type: 'list',
    name: 'skip',
    message: '是否跳过已经存在node_modules的应用',
    choices: ['yes', 'no'],
  },
]

/**
 * @name 选择指定模块并install，如未选择全部install
 */
inquirer.prompt(question).then(async (answer) => {
  let sub_apps_ = answer.apps.length ? answer.apps : sub_apps
  let npm = answer.npm + ' install';
  let skip = answer.skip;
  install(sub_apps_, npm, skip)
});

function install(sub_apps_, npm, skip) {
  log.blue(`即将进入模块并下载依赖：${JSON.stringify(sub_apps_)} ing... `)
  sub_apps_.forEach(async i => {
    if (!fs.existsSync(`${i}/package.json`)) {
      log.error(`${i} 应用缺少package.json文件，将跳过此应用`)
      return false;
    }
    if (fs.existsSync(`${i}/node_modules`) && skip) {
      log.green(`${i} 应用已检测到node_modules目录，将跳过此应用`)
      return false;
    }
    log.blue(`${i} 开始下载，耗时较久请耐心等待...`)
    const { stdout, stderr } = await exec(npm, { cwd: path.resolve(i) });
    log.cyan(i, 'success', stdout)
    log.red(i, 'error', stderr)
  });
};

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});
