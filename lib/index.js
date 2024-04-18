const http = require('http')
const server = http.createServer()
const logger = require("./logger")
const chalk = require('chalk')
const urlencode = require('urlencode');
const os = require('os');
var interfaces = os.networkInterfaces();
let {getAppInfo} = require("../config/ssr-md.config")
var netip = ""
for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
        var alias = iface[i];
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
            netip = alias.address;
        }
    }
}
const {
    openDefaultBrowser,
    renderCommonHtml,
} = require("./html-tools")
const { tranRequestParams} = require("./server-tools")
const {indexInWhiteList} = require("./utils");
const {genHtmlsByRouters} = require("./router-tools")


module.exports = async function (_config) {
    // 密码验证

    // 获取页面配置
    let config_indexs = []

    const routers = require("../routers/router") || []
    const htmls = await genHtmlsByRouters(routers)
    config_indexs = htmls.map(item => item.index)
// console.log(config_indexs)
    server.on('request', async function (request, response) {
        // response.statusCode
        let config = getAppInfo()
        const {validate_password} = require("./usePass")(config)
        let url = request.url
        const url_index = urlencode.decode(url.replace(/\?.*/, ""), 'utf8')

        const controllers   = require("../controllers/controller")
        const controller =  controllers.find(item => item.index.includes(url_index))

        response.__proto__.endJson = function (jsonData) {
            this.setHeader("Content-Type", "application/json")
            this.end(JSON.stringify(jsonData))
        }

        if (controller) {
            // -----------------------------------------------------                controller               ----------------------------------
            if (config.need_password && !indexInWhiteList(config.whitelist, url_index)) {
                // 验证cookie中的密码
                if (!validate_password(request.headers.cookie)) {
                    // 失败
                    response.writeHead(301, {'Location': config.password_index || "/auth"});
                    return response.end()
                }
            }

            function controllSend(controller, response, params, result, config) {
                if (typeof controller.send === 'string') {
                    response.end(controller.send)
                } else if (typeof controller.send === 'function') {
                    controller.send(response, params, result, config)
                } else {
                    response.setHeader("Content-Type", "application/json")
                    response.endJson(result)
                }
            }

            if(!controller.cache) {
                response.setHeader('Cache-Control', 'no-cache');
            }

            tranRequestParams(config, request, controller.disableoss)
                .then(params => {
                    try {
                        const result = controller.service(params, config)
                        if (result instanceof Promise) {
                            result.then(result => {
                                controllSend(controller, response, params, result, config)
                            })
                        } else {
                            controllSend(controller, response, params, result, config)
                        }

                    } catch (err) {
                        controllSend(controller, response, params, {
                            success: 0,
                            message: err.message
                        }, config)
                    }
                })
                .catch(err => {
                    controllSend(controller, response, {}, {
                        success: 0,
                        message: err.message
                    }, config)
                })
        } else if (config_indexs.includes(url_index)) { // 页面渲染
            let html;
            htmls.forEach(item => {
                if (item.index === url_index || (Array.isArray(item.index) && item.index.includes(url_index))) {
                    html = item
                }
            })
            // -----------------------------------------------------                views               ----------------------------------
            if (config.need_password && !indexInWhiteList(config.whitelist, url_index)) {
                response.setHeader('Cache-Control', "no-store"); // 密码验证不使用任何缓存
                // 验证cookie中的密码
                if (!validate_password(request.headers.cookie)) {
                    response.writeHead(301, {'Location': config.password_index || "/auth"});
                    return response.end()
                }
            } else {
                response.setHeader('Cache-Control', html['Cache-Control']);
            }
            response.setHeader('Content-Type', 'text/html;charset=utf8');
            try {
                const html_string = await renderCommonHtml(html, url, url_index)
                response.end(html_string)
            } catch (err) {
                return response.end(err.message)
            }
        } else { // 静态资源加载
            response.setHeader('Cache-Control', 'max-age=600');
            require("./useStatic")(config)(request, response)
        }
    })

    server.listen(_config.app_port, function () {
        logger.log(`本机运行地址：${chalk.blue(`http://127.0.0.1:${_config.app_port}`)}`)
        logger.log(`局域网运行地址：${chalk.blue(`http://${netip}:${_config.app_port}`)}`)
        if (_config.debug) {
            openDefaultBrowser(`http://127.0.0.1:${_config.app_port}`)
        }
    })
}
