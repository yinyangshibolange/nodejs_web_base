const { getAppInfo } = require("../config/ssr-md.config")

const useFileDb = require("../db/useFileDb")

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

,]
