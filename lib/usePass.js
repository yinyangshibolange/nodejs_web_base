const md5 = require("md5")




module.exports = function (config) {
 function getPassordMd (password) {
  return md5(password + config.app_screct + new Date().Format("yyyy-MM-dd")) // 一天输入一次密码
 }
 function validate_password (cookie) {
  if (cookie) {
   let passvalue = ''
   cookie.split(";").forEach(item => {
    if (item.split("=")[0].trim() === 'pass') {
     passvalue = item.split("=")[1].trim()
    }
   })
   let flag = false
   if(passvalue === getPassordMd(config.admin_password)) {
    flag = true
   }
   return flag
  }
  return false
 }


  // 获取cookie过期时间
  function getNextExpire () {
   const nowDateTime = new Date().getTime()
   if (config.pass_expire === 'day') {
     return 'expires=' + new Date(nowDateTime + 24 * 60 * 60 * 1000).toUTCString()
   } else if (config.pass_expire === 'hour') {
     return 'expires=' + new Date(nowDateTime + 60 * 60 * 1000).toUTCString()
   } else if (/[1-9][0-9]*hours/.test(config.pass_expire)) {
     const m = config.pass_expire.match(/([1-9][0-9]*)hours/)
     try {
       return 'expires=' + new Date(nowDateTime + (+m[1]) * 60 * 60 * 1000).toUTCString()
     } catch (err) {
       return 'a=1'
     }
   } else if (/[1-9][0-9]*days/.test(config.pass_expire)) {
     const m = config.pass_expire.match(/([1-9][0-9]*)days/)
     try {
       return 'expires=' + new Date(nowDateTime + (+m[1]) * 24 * 60 * 60 * 1000).toUTCString()
     } catch (err) {
       return 'a=1'
     }
   } else {
     return 'a=1'
   }
 }

 return {
  getPassordMd,
  validate_password,
  getNextExpire,
 }
}
