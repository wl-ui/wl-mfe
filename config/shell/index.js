const fs = require('fs');
const path = require('path');
const SftpClient = require('ssh2-sftp-client'); // 用于连接服务器
const inquirer = require('inquirer'); // 用于命令行交互
const ProgressBar = require('progress'); // 用于显示进度条
const { config } = require('./config'); // 用于连接服务器配置项
const servers = Object.keys(config); // 用于选择要发布到的服务器
const file_path = '../nginx-1.18.0/html/'; // 打包文件所在路径
const sub_app_ath = path.resolve(file_path);
const sub_apps = fs.readdirSync(sub_app_ath).filter(i => /^master|subapp|3d|app/.test(i));  // 用于读取所有微应用
const FileSystem = require('../utils/filesys');
const fileSys = new FileSystem(); // 用于统一文件数量
const { log } = require('../utils/utils'); // 用于美化控制点打印

/**
 * @name 命令行交互配置项，选择要发布的模块
 */
const question = [
    {
        type: 'list',
        name: 'server',
        message: '请选择要发布到目标服务器',
        choices: servers,
    },
    {
        type: 'checkbox',
        name: 'apps',
        message: '请选择要发布的模块',
        choices: sub_apps,
    }
]

/**
 * @name 选择指定模块并发布
 */
inquirer.prompt(question).then(async (answer) => {
    // 整理所选目标服务器配置项
    const active_server = config[answer.server];
    // 未选择要发布的应用警告
    if (!answer.apps.length) {
        log.red('未选择应用！按空格键选择应用')
    }
    // 整理所选要发布的微应用

    answer.apps.forEach(i => {
        const from = path.join(__dirname, file_path + i);
        const to = active_server.path;
        sftpSend(i, from, to, active_server)
    })
});

/**
 * @name sftp上传
 * @param {String} appName 应用模块名
 * @param {String} from 本地模块路径
 * @param {String} to 要部署的模块路径
 * @param {Object} active_server 目标服务器配置项
 */
function sftpSend(appName, from, to, active_server) {
    let client = new SftpClient();
    client.on('keyboard-interactive',
        (name, instructions, instructionsLang, prompts, finish) => { finish([active_server.password]); });
    client.connect(active_server).then(() => {
        let completed = 0; // 已上传数量
        let filesLength = fileSys.totalFilesByDir(from); // 待上传文件总数
        // 创建 node-progress 进度条工具
        let progressBar = new ProgressBar(appName + ' 开始部署，总计:total个文件，已上传:completed个 [:bar]',
            { total: filesLength, completed: completed, complete: '#', incomplete: ' ', width: 50 });
        // 监听文件上传成功事件，以更新上传进度
        client.on('upload', function (info) {
            completed++;
            progressBar.tick(1, { total: filesLength, completed: completed });
        });
        return client.uploadDir(from, to);
    }).then((data) => {
        log.cyan(appName + '模块部署成功 (￣▽￣)ノ');
    }).catch((err) => {
        log.red(appName + '模块部署失败，错误如下：')
        console.error(log.red(err));
    }).finally(() => {
        client.end();
    });
}
