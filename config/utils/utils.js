const chalk = require('chalk');

/**
 * 工具包
 */
module.exports = {

    log: {
        /**
         * 红色输出
         *
         * @param {*} lines 内容行
         */
        red(...lines) {
            lines.forEach((line) => {
                this._log(chalk.red(line));
            });
        },

        /**
         * 蓝色输出
         *
         * @param {*} lines 内容行
         */
        blue(...lines) {
            lines.forEach((line) => {
                this._log(chalk.blue(line));
            });
        },

        /**
         * 绿色输出
         *
         * @param {*} lines 内容行
         */
        green(...lines) {
            lines.forEach((line) => {
                this._log(chalk.green(line));
            });
        },

        /**
         * 蓝绿色输出
         */
        cyan(...lines) {
            lines.forEach((line) => {
                this._log(chalk.cyan(line));
            });
        },

        /**
         * 打印调试内容
         *
         * @param {*} line
         * @private
         */
        _log(line) {
            if (line instanceof Object) {
                line = JSON.stringify(line);
            }

            console.log(line + '\n');
        }
    },
}