
const path = require("path")
const multiparty = require('multiparty');
const urlencode = require('urlencode')
const fs = require("fs")
const fs_promise = fs.promises
const { createOss } = require("./oss-tools")

function openDefaultBrowser(url) {
    var exec = require('child_process').exec;
    switch (process.platform) {
        case "darwin":
            exec('open ' + url);
            break;
        case "win32":
            exec('start ' + url);
            break;
        default:
            exec('xdg-open', [url]);
    }
}

function getQueryString(name, url) {
    if (!url || !name) return null
    var reg = new RegExp("([\?&])" + name + "=([^&]*)(&|$)", "i");
    var r = url.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

function getQueryParams(url) {
    if (!url) return {}
    let tempurl = url.replace(/.*\?/, '')
    let query = {}
    tempurl.split("&").forEach(item => {
        const mapArray = item.split("=")
        query[unescape(mapArray[0])] = unescape(mapArray[1])
    })
    return query
}

function tranRequestParams(config, req, controller_disableoss) {
    return new Promise((resolve, reject) => {
        if(!req.headers['content-type']) {
            try {
                const params = getQueryParams(urlencode.decode(req.url, 'utf8'))
                resolve(params)
            } catch(err) {
                reject(err)
            }
        } else {
            if (req.headers['content-type'].indexOf("application/x-www-form-urlencoded") > -1) {
                try {
                    const params = getQueryParams(urlencode.decode(req.url, 'utf8'))
                    resolve(params)
                } catch(err) {
                    reject(err)
                }
            } else if (req.headers['content-type'].indexOf("application/json") > -1) {
                let body = ''
                req.on('data', (chunk) => {
                    body += chunk;
                });
                req.on('end', () => {
                    try {
                        const params = JSON.parse(body)
                        resolve(params)
                    } catch (err) {
                        reject(err)
                    }
                });
                req.on("error", (err) => {
                    reject(err)
                })
            } else if (req.headers['content-type'].indexOf("multipart/form-data") > -1) {
                const banner_dir = path.resolve(process.cwd() , config.uploads_dir_path, config.uploadType)
                try {
                    fs.mkdirSync(banner_dir, { recursive: true })
                } catch (err) {
                    console.error(err)
                }
                const form = new multiparty.Form({uploadDir: banner_dir,maxFilesSize : config.maxFilesSize,});
                const uploadBasePath = banner_dir.replace(path.resolve(process.cwd(), config.static_fold), "")
                form.parse(req, async function (err, fields, files) {
                    if (err) {
                        reject(err)
                    } else {
                        let params = {}
                        for(let key in fields) {
                            params[key] = fields[key][0]
                        }
                        let uploads = {}
                        for(let key in files) {
                            if (files[key] && files[key][0] && files[key][0].size > 0) {
                                const filenamebase = path.parse(files[key][0].path).base
                                uploads[key] = filenamebase ? ( uploadBasePath + '/' + filenamebase) : ""


                                if(!controller_disableoss && config.useoss) {
                                    const filePath = path.resolve(process.cwd(), config.static_fold, '.' + uploads[key])
                                    const bannerParse = path.parse(filePath)
                                    try {
                                        const {osstype} = config
                                        const ossInstance = createOss(osstype, config)
                                        const res = await ossInstance.upload(bannerParse.base, filePath)
                                        uploads[key] = res.url
                                        fs.unlink(filePath,function(){})
                                    } catch (err) {
                                        console.error(err)
                                    }
                                }
                            }
                        }
                        params.uploads = uploads
                        resolve(params)
                    }
                });
            } else {

            }
        }

    })

}






function getRange(range) {
    var match = /bytes=([0-9]*)-([0-9]*)/.exec(range);
    const requestRange = {};
    if (match) {
        if (match[1]) requestRange.start = Number(match[1]);
        if (match[2]) requestRange.end = Number(match[2]);
    }
    return requestRange;
}
async function file_part_download(filepath, req, res) {
    // console.log(req)
    const method = req.method;
    const { size } = await fs_promise.stat(filepath);
    // 2、响应head请求，返回文件大小
    if ('HEAD' === method) {
        return res.setHeader('Content-Length', size);
    }
    const range = req.headers['range'];

    let file;
    // 3、通知浏览器可以进行分部分请求
    if (!range) {
         res.setHeader('Accept-Ranges', 'bytes');
        file = fs.createReadStream(filepath)
    } else {
        const { start, end } = getRange(range);
        // 4、检查请求范围
        if (start >= size || end >= size) {
            res.statusCode = 416;
            return res.setHeader('Content-Range', `bytes */${size}`);
        }
        // 5、206分部分响应
        res.statusCode = 206;
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Range', `bytes ${start}-${end ? end : size - 1}/${size}`);
        file = fs.createReadStream(filepath, {start,end})
    }
    return file.pipe(res)
}

module.exports = {
    openDefaultBrowser,
    getQueryString,
    getQueryParams,
    tranRequestParams,


    file_part_download,
}
