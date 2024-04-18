const logger = require("./logger")
const path = require("path")
const pkg = require('../package.json');
const fs = require("fs")

require("./plugins")

function isDirExists (path) {
 return new Promise((resolve, reject) => {
  fs.stat(path, function (err, stats) {
   if (!err && stats.isDirectory()) {
    resolve(stats)
   } else {
    reject(err)
   }
  })
 })
}

function isFileExists (path) {
 return new Promise((resolve, reject) => {
  fs.stat(path, function (err, stats) {
   if (!err && stats.isFile()) {
    resolve(stats)
   } else {
    reject(err)
   }
  })
 })
}

// userpath
async function startServe () {
 let filepath = ''
 const userspace_path = process.cwd()
 logger.info(`当前运行于：${userspace_path}`)
 try {
  filepath = path.resolve(userspace_path, "config/ssr-md.config.js")
  await isFileExists(filepath)
 } catch (err) {
  logger.error(`配置文件【ssr-md.config.js】不存在`)
  throw Error(`配置文件【ssr-md.config.js】不存在`)
 }
 let {ssrConfig} = require(filepath)
 logger.primary("-配置文件如下：")
 logger.dict(ssrConfig)
 logger.primary("-")


 await require(path.resolve(__dirname, "./index"))(ssrConfig)
}


async function build() {

}



module.exports = {
 startServe,
 build,
}
