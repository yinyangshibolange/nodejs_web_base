const path = require("path");
const OSS = require('ali-oss');

function createAliOssClient(config) {
    let client = new OSS({
        // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
        region:process.env.OSS_REGION,
        // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
        accessKeyId: process.env.OSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
        bucket: process.env.OSS_BUCKET,
        // endpoint: 'oss-cn-hangzhou.aliyuncs.com',
        // cname: '',
        // secure: true,
        ...config,
    });
    const headers = {
        // 指定Object的存储类型。
        'x-oss-storage-class': 'Standard',
        // 指定Object的访问权限。
        'x-oss-object-acl': 'private',
        // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.jpg。
        // 'Content-Disposition': 'attachment; filename="example.jpg"'
        // 设置Object的标签，可同时设置多个标签。
        'x-oss-tagging': 'Tag1=1&Tag2=2',
        // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
        'x-oss-forbid-overwrite': 'true',
    };
    return {client,headers}
}


class AliOss {
    config = {}
    constructor(config) {
        this.config = config
    }

    async  upload (filename, localFilePath) {
        const {client} = createAliOssClient(this.config)
        try {
            // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
            // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
            return await client.put(filename, path.normalize(localFilePath)
                // 自定义headers
                //,{headers}
            );
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async  delete (filename) {
        const {client} = createAliOssClient(this.config)
        try {
            // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
            return  await client.delete(filename);
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

module.exports = {
    AliOss
}
