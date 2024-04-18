const zlib = require("zlib")
const mime = require("mime")
const crypto = require("crypto")
const path = require("path")
const fs = require("fs")
const fs_promises = fs.promises
const logger = require("./logger")
const {exec} = require("child_process");

module.exports = function (config) {
    function gzipFile(req, res) {
        const acceptEncoding = req.headers['accept-encoding']; // 获取文件支持的压缩格式
        if (acceptEncoding) {
            if (acceptEncoding.includes('gzip')) {
                res.setHeader('Content-Encoding', 'gzip');
                return zlib.createGzip();  // 返回gzip压缩流
            } else if (acceptEncoding.includes('deflate')) {
                res.setHeader('Content-Encoding', 'deflate');
                return zlib.createDeflate();  // 返回deflate压缩流
            }
        }
        return false; // 如果不支持就返回false
    }


    async function readLastBytes(filePath, bytes) {
        return new Promise((resolve, reject) => {
            const fd = fs.openSync(filePath, 'r');
            const stat = fs.fstatSync(fd);
            const buffer = Buffer.alloc(bytes);
            fs.read(fd, buffer, 0, bytes, stat.size - bytes, (err, bytesRead, buffer) => {
                fs.closeSync(fd);
                if (err) {
                    reject(err);
                } else {
                    console.log(filePath, buffer)
                    resolve(buffer);
                }
            });
        });
    }

    function readPartFile(src, length) {
        return new Promise((resolve, reject) => {
            let buff = Buffer.alloc(length);
            fs.stat(src, (err, stat) => {
                if (err) {
                    throw err;
                }
                if (stat.isFile()) {
                    fs.open(src, 'r+', (err, fd) => {
                        // const stat = fs.fstatSync(fd);
                        // const buffer = Buffer.alloc(bytes);
                        // 读取末尾 length 字节
                        fs.read(fd, buff, 0, length, stat.size > length ? (stat.size - length) : null, (err, bytesRead, buffer) => {
                            fs.close(fd, (err) => {})
                            if (err) {
                                reject(err);
                            } else {
                                resolve(buffer);
                            }
                        });
                    });
                }
            });
        })

    }


    async function cacheFile(req, res, filePath, fileStat) {
        res.setHeader('Cache-Control', 'max-age=10'); // 设定强制缓存，时间为10秒
        res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toUTCString())
        res.setHeader('Content-Type', mime.getType(filePath) + ';charset=utf-8'); // 用mime模块为不同文件类型设置对应的响应头
        const lastModifyed = fileStat.ctime.toGMTString(); // 获取文件最后修改时间

        // 读取部分文件作为etag
        const fileBuffer = await readPartFile(filePath, 1024 * 2)
        const etag = crypto.createHash('md5').update(fileBuffer).digest('base64');
        res.setHeader('Last-Modified', lastModifyed); // 设定最后修改时间的响应头
        res.setHeader('Etag', etag); // 设置Etag响应头
        const ifModifiedSince = req.headers['if-modified-since']; // 获取上一次修改时间
        const ifNoneMatch = req.headers['if-none-match']; // 与Etag搭配使用的请求头，对比Etag值，如果相同则表示文件没变化，可走缓存，否则重新加载
        if (ifModifiedSince !== lastModifyed) { // 判断文件的最后修改时间和请求头里最后的修改时间是否相同
            return false;
        }
        if (etag !== ifNoneMatch) { // 判断 Etag和ifNoneMatch值是否相同
            return false;
        }
        return true;
    }

    function isFileExist(filepath) {
        return new Promise((resolve, reject) => {
            fs.stat(filepath, function (err, stats) {
                if (!err && stats.isFile()) {
                    resolve(stats)
                } else {
                    reject(err)
                }
            })
        })
    }

    function write404(response) {
        response.writeHead(404);
        response.end('404 Not Found');
    }

    async function fileReadStream(request, response, filepath, stats) {
        const isCache = await cacheFile(request, response, filepath, stats)
        if (isCache) { // 如果文件符合缓存策略就使用缓存，返回状态码304
            response.statusCode = 304;
            response.end();
        } else {

            let createCompress; // 定义压缩流
            if (createCompress = gzipFile(request, response)) {  // 如果文件符合压缩策略就创建压缩流
                fs.createReadStream(filepath).pipe(createCompress).pipe(response);  // 以流管道的形式将文件模板压缩后再输出到页面显示
            } else {
                fs.createReadStream(filepath).pipe(response);  // 以流管道的形式将文件模板输出到页面显示
            }
        }
    }

    async function readStaticFiles(request, response) {
        if (!request.url.startsWith("/")) {
            response.writeHead(416);
            response.end('416 页面无法提供请求的范围。');
            return
        }
        const filepath = path.resolve(__dirname, "../static", "." + request.url.replace(/\?.*/, ''))

        if (config.static_fold.startsWith("..") || config.static_fold === "/") {
            logger.error("静态资源配置存在安全漏洞，请尽快检查并更正")
        }

        async function write_your_path() {
            const yourPath = path.resolve(process.cwd(), config.static_fold, "." + request.url.replace(/\?.*/, ''))
            try {
                const stats = await isFileExist(yourPath)
                await fileReadStream(request, response, yourPath, stats)
            } catch (err) {
                try {
                    const stats = await isFileExist(filepath)
                    await fileReadStream(request, response, filepath, stats)
                } catch (err) {
                    write404(response)
                }
            }
        }

        if (!config.static_fold) {
            try {
                const stats = await isFileExist(filepath)
                await fileReadStream(request, response, filepath, stats)
            } catch (err) {
                await write_your_path()
            }
        } else {
            await write_your_path()
        }
    }




    return readStaticFiles
}

