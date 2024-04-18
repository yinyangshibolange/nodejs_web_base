module.exports.indexInWhiteList = function (whitelist, index) {
    let result = false
    whitelist.forEach(item => {
        if (item === index || (Array.isArray(item) && item.includes(index))) {
            result = true
        }
        // 如果item中存在通配符
        if (item.indexOf("*") > -1) {
            const reg = new RegExp(item.replace("*", ".*"))
            if (reg.test(index)) {
                result = true
            }
        }
    })
    return result
}
