const favicon = "favicon.ico"
const static_fold = 'static'

// 可配置的参数
// admin_password,maxFilesSize,useoss
// 环境变量参数
// SERVER_PORT,APP_SCRECT,ADMIN_PASSWORD

let ssrConfig = {
    app_port: process.env.SERVER_PORT || 3001, // 服务监听的端口号 ，需要重启才能生效

    // 密码验证
    need_password: false, // 是否需要密码，才能访问
    password_index: "/auth", // 登录页面index
    app_screct: process.env.APP_SCRECT || '_app_sercrect1_', // cookie生成码
    admin_password: process.env.ADMIN_PASSWORD || '123321', // 管理员密码，可以进行密码管理，通过修改.passwords文件,必须有管理员cookie
    pass_expire: 'day', // 'day','hour','30days','12hours', 设置cookie过期时间
    whitelist: ["/pass", "/auth", "/auth.html", "/api/public/*"], // 密码验证白名单


    // 静态目录
    static_fold, // 你的静态文件资源站,不要将项目根目录作为静态资源站，会很危险哦
    // upload
    maxFilesSize: 2 * 1024 * 1024,
    uploads_dir_path: static_fold + '/uploads',
    uploadType: 'files',
    useoss: false,

    osstype: 'alioss',
    ossparams: {},
    
    heads: [
        `      <meta charSet="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
                <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
`,
        `<link rel="shortcut icon" href="/${favicon}">`,
        '<script src="/js/jquery.min.js"></script>',
        '<script src="/js/common.js"></script>',
        '<link rel="stylesheet" href="/css/common.css">',
        '<link rel="stylesheet" href="/vnocss/vno.css">'
    ],


}
const useFileDb = require("../db/useFileDb")
const appDb = useFileDb("app.json")
ssrConfig = {
    ...ssrConfig,
    ...appDb.getAll().data[0],
}

// console.log(ssrConfig)

let changed = false
function setAppInfo (info) {
    const { osstype, useoss, ACCESS_KEY_ID, ACCESS_KEY_SECRET, REGION, BUCKET,admin_password, need_password, backEveryDay,  backTime } = info
    const res = appDb.replaceAll([{
        ...ssrConfig,
        ...appDb.getAll().data[0],
        osstype, useoss, ACCESS_KEY_ID, ACCESS_KEY_SECRET, REGION, BUCKET,admin_password, need_password, backEveryDay,  backTime
    }])
    if(res.success === 1) changed = true
    return res
}
function getAppInfo() {
    if(changed) {
        ssrConfig = {
            ...ssrConfig,
            ...appDb.getAll().data[0], // 自定义设置优先
            // heads: ssrConfig.heads, // 本地设置优先，
        }
    }
    return ssrConfig
}

module.exports = { ssrConfig, setAppInfo, getAppInfo }
