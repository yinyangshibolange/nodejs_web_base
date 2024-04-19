const { getAppInfo } = require("../config/ssr-md.config")


module.exports = [{
    title: "错误页",
    meta: "",
    index: ["/error", "/error.html"],
    path: "htmls/error.ejs",
    'Cache-Control': 'no-cache',
    renderData: {
        message: query => query.message
    }
}, {
    title: "密码认证",
    meta: "",
    index: ["/auth", "/auth.html"],
    path: "htmls/auth.ejs",
    'Cache-Control': 'no-cache',
}, {
    nav: true,
    title: "首页",
    meta: "",
    index: "/",
    path: "htmls/index.ejs",
    'Cache-Control': 'no-cache',
    renderData: {
        type: params => params.type,
    }
},
{
    title: "内容管理",
    meta: "",
    index: ["/manager", "/manager.html"],
    path: "htmls/manager.ejs",
    'Cache-Control': 'no-cache',
    renderData: {
        appInfo: () => {
            return getAppInfo()
        },
        sitePackageExist: async () => {
            try {
                const tmpPath = path.resolve(process.cwd(), '___tmp___')
                const site_output_zip = path.resolve(tmpPath, 'site_export_tmp.zip')
                const fileExist = await fs.promises.stat(site_output_zip)
                return fileExist.isFile()
            } catch (err) {
                return false
            }
        },
        siteConfig: async () => {
            const siteConfig = siteConfigDb.getAll().data[0]
            const { typeViewers, title, banner, custom_css } = siteConfig || {}
            const { mdTypes } = await getMdDatas()
            return {
                mdTypes: mdTypes.map(item => {
                    return {
                        ...item,
                        show: typeViewers.some(item1 => item1.type === item.type && item1.show === true)
                    }
                }),
                title, banner, custom_css,
            }
        }
    }
}
    // {
    //     genSite: true,
    //     title: '内容详情',
    //     meta: "",
    //     index: "/site/detail_[:id].html",
    //     path: "htmls/detail.ejs",
    //     'Cache-Control': 'no-cache',
    //     renderIndex: {
    //       id: async () => {
    //       },
    //     },
    //     renderData: {
    //     }
    // }
]
