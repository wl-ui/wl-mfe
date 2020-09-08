const fs = require('fs');
const path = require('path');

/**
 * 文件系统定义
 */
class FileSystem {
    /**
     * 统计指定文件夹内的所有文件数量
     *
     * @param {String} dir 文件夹路径
     * @return {Number}
     */
    totalFilesByDir(dir) {
        let count = 0;
        let files = fs.readdirSync(dir, {withFileTypes: true});
        files.forEach((file) => {
            let filePath = path.join(dir, file.name);
            let stat = fs.lstatSync(filePath);
            if (stat.isDirectory()) {
                count += this.totalFilesByDir(filePath);
            } else {
                count++;
            }
        });
        
        return count;
    }
}

module.exports = FileSystem;