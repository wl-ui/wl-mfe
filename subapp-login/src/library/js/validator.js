
const isDataComplete = function (array, require = []) {
    /*
     * require = [{key:"被验证的键名", message:"被验证的键名对应的值不存在时的提示信息"}]
    */
    let flag = true;
    out: for (let i = 0, len = array.length; i < len; i++) {
        for (let j = 0, length = require.length; j < length; j++) {
            let v = array[i][require[j].key];
            if (v === undefined || v === null) {
                flag = false;
                this.$message({
                    type: "warning",
                    message: `第${i + 1}行${require[j].message}`
                })
                break out;
            }
        }
    }
    return flag;
}

const calculateSurplus = function (maxNum, usedNum, currentNum) {
    if (maxNum - usedNum < currentNum) {
        this.$message({
            type: "warning",
            message: "请不要输入超出剩余量的数值"
        })
        return currentNum = maxNum - usedNum;
    }else{
        return currentNum;
    }
}

export {
    isDataComplete,
    calculateSurplus
}