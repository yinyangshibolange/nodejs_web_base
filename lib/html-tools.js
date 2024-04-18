const path = require('path')
const fs = require('fs')
const {getAppInfo} = require("../config/ssr-md.config");
const {decode} = require("urlencode");
const {getQueryParams} = require("./server-tools");

const renderEjs = require("./ejsRender")
/**
 * 读取html文件
 */
function readEjs(html_path) {
    if (!html_path) return ""
    const htmlpath = path.resolve(process.cwd(), html_path)

    let htmlString = ''
    try {
        htmlString = fs.readFileSync(htmlpath, 'utf-8').toString()
    } catch (err) {
        htmlString = ""
    }
    return htmlString || "<html><head></head><body>系统出错啦！</body></html>"
}


function replaceHeader(html, header, ispre) {
    const head_match = html.match(/<head>([\s\S]*)<\/head>/)
    if (!head_match) {
        const html_match = html.match(/<html>([\s\S]*)<\/html>/)
        if (html_match) return html.replace(head_match[0], `<html><head>${header}</head>${head_match[1]}</html>`)
        return `<html><head>${header}</head>${html}</html>`
    } else {
        if(ispre) {
            return html.replace(head_match[0], `<head>${header}${head_match[1]}</head>`)
        } else {
            return html.replace(head_match[0], `<head>${head_match[1]}${header}</head>`)
        }
    }
}

function replaceTitle(html, title) {
    const title_match = html.match(/<title>([\s\S]*)<\/title>/)
    if (!title_match) {
        const head_match = html.match(/<head>([\s\S]*)<\/head>/)
        if (!head_match) {
            const html_match = html.match(/<html>([\s\S]*)<\/html>/)
            if (html_match) return html.replace(head_match[0], `<html><head><title>${title}</title></head>${head_match[1]}</html>`)
            return `<html><head><title>${title}</title></head>${html}</html>`
        } else {
            return html.replace(head_match[0], `<head>${head_match[1]}<title>${title}</title></head>`)
        }
    } else {
        return html.replace(title_match[0], `<title>${title}</title>`)
    }
}

function replaceMeta(html, meta) {
    const head_match = html.match(/<head>([\s\S]*)<\/head>/)
    if (!head_match) {
        const html_match = html.match(/<html>([\s\S]*)<\/html>/)
        if (html_match) return html.replace(head_match[0], `<html><head>${meta}</head>${head_match[1]}</html>`)
        return `<html><head>${meta}</head>${html}</html>`
    } else {
        return html.replace(head_match[0], `<head>${head_match[1]}${meta}</head>`)
    }
}

function replaceBody(html, content, istop) {
    const body_match = html.match(/<body>([\s\S]*)<\/body>/)
    if (body_match) {
        if (istop) {
            return html.replace(body_match[0], `<body>${content}${body_match[1]}</body>`)
        } else {
            return html.replace(body_match[0], `<body>${body_match[1]}${content}</body>`)
        }
    } else {
        if (istop) {
            return content + html
        } else {
            return html + content
        }
    }
}
/* ------------------------------------      通用html拼接方法      ------------------------------------------------------ */
function replaceHtml (html_string, html) {
    let config = getAppInfo()
    let tempstr = html_string

    // 通用头部添加
    if (Array.isArray(config.heads) && config.heads.length > 0) {
        tempstr = replaceHeader(tempstr, config.heads.join('\r\n'), true)
    }

    // 通用body添加
    const body_match = tempstr.match(/<body>([\s\S]*)<\/body>/)
    if (body_match) {
        tempstr = tempstr.replace(body_match[0], `<body><div id="app">${body_match[1]}</div></body>`)
    }
    return tempstr
}

/**
 * 生成html内容
 * @param html htmlInstance
 * @param url 全url, request.url
 * @param url_index 剔除?后的url参数
 * @returns {Promise<void>} html内容
 */
async function renderCommonHtml(html, url, url_index) {
// start html
    url = decode(url, 'utf8')
    const params = getQueryParams(url)
    const matchParams = [...html.origin_index.matchAll(/(\[:\w+\])/g)]
    let pathParams = {}
    if (matchParams.length > 0) {
        // 说明匹配了页面参数
        const reg = new RegExp(`^${html.origin_index.replace(/\[:\w+\]/g, '(.*)')}$`)

        // console.log(url_index.match(reg))
        matchParams.forEach((item, index) => {
            pathParams[item[0].replace(/\[:|]/g, '')] = url_index.match(reg)[index + 1]
        })
    }
    // console.log(pathParams)
    let html_string = readEjs(html.path)
    let renderData = {
        ...params,
        ...pathParams,
    }
    if (html.renderData) {
        for (let key in html.renderData) {
            if (typeof html.renderData[key] === 'function') {
                renderData[key] = html.renderData[key](params, pathParams)
                if (renderData[key] instanceof Promise) {
                    renderData[key] = await renderData[key]
                }
            } else {
                renderData[key] = html.renderData[key]
            }
        }
    }
    // ejs 渲染

    html_string = renderEjs(html_string, html, url_index, renderData)
    if (html.title) {
        html_string = replaceTitle(html_string, html.title)
    }
    if (html.meta) {
        html_string = replaceMeta(html_string, html.meta)
    }
    html_string = replaceHtml(html_string, html)

    return html_string
    // end html
}
module.exports = {
    readEjs,
    replaceHeader,
    replaceTitle,
    replaceMeta,
    replaceBody,
    renderCommonHtml

}
