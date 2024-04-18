const path = require("path");
const qiniu = require('qiniu');


function uptoken(config) {
    let mac = new qiniu.auth.digest.Mac(config.ACCESS_KEY_ID, config.ACCESS_KEY_SECRET);
    let options = {
        scope: config.BUCKET
    };
    let putPolicy = new qiniu.rs.PutPolicy(options);
    return putPolicy.uploadToken(mac);
}

function uploadFile(token, filename, localFile) {
    const cdn = '' ;
    let config = new qiniu.conf.Config();
// 空间对应的机房  华东
    config.zone = qiniu.zone.Zone_z0;
// 是否使用https域名
//config.useHttpsDomain = true;
// 上传是否使用cdn加速
//config.useCdnDomain = true;
    return new Promise((resolve, reject) => {
        let formUploader = new qiniu.form_up.FormUploader(config);
        let putExtra = new qiniu.form_up.PutExtra();
// 文件上传
        formUploader.putFile(token, filename, localFile, putExtra, function(respErr,
                                                                             respBody, respInfo) {
            if (respErr) {
                reject(respErr);
            } else {
                console.log( respBody, respInfo)
                // if (respInfo.statusCode == 200) {
                //     console.log(respBody);
                // } else {
                //     console.log(respInfo.statusCode);
                //     console.log(respBody);
                // }
                resolve(cdn + respBody.key)
            } // dasddawedawda.s3.cn-east-1.qiniucs.com/e9iQliqpxu1MM4eZ2MA4HCtf.jpg

        });
    })
}

function removeFile(bucket, filename) {
    return new Promise((resolve, reject) => {
        //构建bucketmanager对象
        const client = new qiniu.rs.Client();

        client.remove(bucket, filename, function(err, ret) {
            if (!err) {
                resolve(true)
            } else {
                reject(err);
            }
        });
    })
}
class QiniuOss {
    config = {}
    constructor(config) {
        this.config = config
    }

    async  upload (filename, localFilePath) {
        const token = uptoken(this.config)
        try {
            // 填写OSS文件完整路径和本地文件的完整路径。OSS文件完整路径中不能包含Bucket名称。
            // 如果本地文件的完整路径中未指定本地路径，则默认从示例程序所属项目对应本地路径中上传文件。
            return await uploadFile(token, filename, path.normalize(localFilePath))
        } catch (err) {
            return Promise.reject(err)
        }
    }

    async  delete (filename) {
        setClientConfig(this.config)
        try {
            // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
            return  await removeFile(this.config.BUCKET,filename);
        } catch (err) {
            return Promise.reject(err)
        }
    }
}

module.exports = {
    QiniuOss
}
