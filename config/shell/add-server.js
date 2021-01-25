const inquirer = require('inquirer'); // 用于命令行交互
const fs = require('fs'); // 用于读写文件
const { log } = require('../utils/utils'); // 用于美化控制点打印
const path = "./config.js";

/**
 * @name 命令行交互配置项，选择要发布的模块
 */
const question = [
    {
        type: 'input',
        name: 'name',
        message: '请输入服务器名称：',
    },
    {
        type: 'input',
        name: 'host',
        message: '请输入服务器ip：',
    },
    {
        type: 'input',
        name: 'port',
        message: '请输入服务器端口号：',
    },
    {
        type: 'input',
        name: 'username',
        message: '请输入用户名：',
    },
    {
        type: 'input',
        name: 'password',
        message: '请输入密码：',
    },
    {
        type: 'input',
        name: 'path',
        message: '请输入发布路径,以‘/’开头，‘/’结尾：',
    },
]

/**
 * @name 选择指定模块并发布
 */
inquirer.prompt(question).then(async (answer) => {
    const new_server =
        `
    ,${answer.name}:{
        host: "${answer.host}",
        port: ${answer.port},
        username: "${answer.username}",
        password: "${answer.password}",
        path: "${answer.path}"
    }
    //-----***-----
    `
    readConfig(new_server)
});

/**
 * @name 读取config
 */
function readConfig(new_server) {
    fs.readFile(path, (err, data) => {
        if (err) {
            log.red('读取文件失败：', err)
        } else {
            let str = data.toString();
            // 更新文件内容
            let add_server_then = str.replace('//-----***-----', new_server);
            writeFile(add_server_then);
        }
    });
}

/***
 * @name 写入config
 */
function writeFile(context) {
    fs.writeFile(path, context, function (err) {
        if (err) {
            log.red('写入文件失败：', err)
        } else {
            log.cyan('添加server成功');
        }
    });
}