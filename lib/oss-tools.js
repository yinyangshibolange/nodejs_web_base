const {AliOss} = require("./oss/alioss")
const { QiniuOss} = require("./oss/qiniuoss")


function createOss (type, config) {
let ossInstance = null
    if(type === 'alioss') {
        ossInstance = new AliOss(config)
    } else if(type === 'qiniu') {
       ossInstance = new QiniuOss(config)
    }
    return ossInstance
}

module.exports = {
    createOss
}
