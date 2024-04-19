const {FSDB} = require("file-system-db");
const path = require("path")
const {v4: uuidv4} = require('uuid');



function reduceSame(arr, keys) {
    if (!Array.isArray(keys) || keys.length === 0) {
        return arr
    }
    let temp = []
    for (let k = 0; k < arr.length; k++) {
        const arr_item = arr[k]
        const finded = temp.find(item => {
            let flag = true
            for (let key of keys) {
                if (arr_item[key] !== item[key]) {
                    flag = false
                    break
                }
            }
            return flag
        })
        if (!finded) {
            temp.push(arr_item)
        }
    }
    return temp
}

module.exports = function (jsonName,) {
    function newDb(jsonName,) {
        const db = new FSDB(path.resolve(process.cwd(), "datas", jsonName), true);
        if (!Array.isArray(db.get("datalist"))) db.set("datalist", [])
        return db
    }
    

    const db = newDb(jsonName,);

    

    function addItem(jsondata, uquines = []) {
        if (!jsondata) {
            return {
                success: 0,
                message: '参数错误'
            }
        }
        const originDatalist = db.get("datalist")
        try {
            jsondata.id = uuidv4()
            const date = new Date()
            if (Array.isArray(uquines) && uquines.length > 0) {
                const findedSame = originDatalist.find(item => {
                    let flag = true
                    for (let key of uquines) {
                        if (item[key] !== jsondata[key]) {
                            flag = false
                            break
                        }
                    }
                    return flag
                })
                if (!findedSame) {
                    db.push("datalist", {...jsondata, create_time: date.Format("yyyy-MM-dd hh:mm:ss"),})
                } else {
                    return {
                        success: 0,
                        message: '存在相同名称的文件！'
                    }
                }
            } else {
                db.push("datalist", {...jsondata, create_time: date.Format("yyyy-MM-dd hh:mm:ss"),})
            }
            return {
                success: 1,
                data: {
                    id: jsondata.id,
                },
                message: "添加成功",
            }
        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }
    }

    function addItems(jsondatas, uquines = []) {
        if (!Array.isArray(jsondatas) || jsondatas.length === 0) {
            return {
                success: 0,
                message: '参数错误'
            }
        }
        const tempjsondatas = reduceSame(jsondatas, uquines)
        const originDatalist = db.get("datalist")
        for (let k = 0; k < tempjsondatas.length; k++) {
            const jsondata = tempjsondatas[k]
            try {
                jsondata.id = uuidv4()
                const date = new Date()
                if (Array.isArray(uquines) && uquines.length > 0) {
                    const findedSame = originDatalist.find(item => {
                        let flag = true
                        for (let key of uquines) {
                            if (item[key] !== jsondata[key]) {
                                flag = false
                                break
                            }
                        }
                        return flag
                    })
                    if (!findedSame) {
                        db.push("datalist", {...jsondata, create_time: date.Format("yyyy-MM-dd hh:mm:ss"),})
                    }
                } else {
                    db.push("datalist", {...jsondata, create_time: date.Format("yyyy-MM-dd hh:mm:ss"),})
                }
            } catch (err) {
                return {
                    success: 0,
                    message: err,
                }
            }
        }
        return {
            success: 1,
            message: "添加成功",
        }
    }

    function deleteItem(data) {
        if (!data || Object.keys(data).length === 0) {
            return {
                success: 0,
                message: '参数错误'
            }
        }
        try {
            const comments = db.get("datalist")
            let temp = []
            comments.forEach(item => {
                let flag = true
                for (let key in data) {
                    if (item[key] !== data[key]) {
                        flag = false
                        break
                    }
                }
                if (flag === false) {
                    temp.push(item)
                }
            })
            db.set("datalist", temp)
            return {
                success: 1,
                message: "删除完成"
            }
        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }
    }

    function getItems(data) {
        if (!data || Object.keys(data).length === 0) {
            return {
                success: 0,
                message: '参数错误'
            }
        }
        try {
            const datalist = db.get("datalist")
            let temp = []
            datalist.forEach(item => {
                let flag = true
                for (let key in data) {
                    if (item[key] !== data[key]) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    temp.push(item)
                }
            })
            return {
                success: 1,
                data: temp
            }

        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }
    }

    function getOne(data) {
        const res = getItems(data)
        if (res.success === 1) {
            if(res.data[0]) {
                return {
                    success: 1,
                    data: res.data[0]
                }
            } else {
                return {
                    success: 0,
                    message: '数据不存在'
                }
            }


        } else {
            return res
        }
    }

    function getAll() {
        try {
            return {
                success: 1,
                data: db.get("datalist")
            }
        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }
    }

    function get(params = {}) {
        try {
            let list = db.get("datalist") || []
            for (let key in params) {
                if (params[key]) {
                    list = list.filter(item => item[key] === params[key] || ((item[key] || item[key] === 0) && (params[key] || params[key] === 0) && params[key] == item[key]))
                }
                return {
                    success: 1,
                    data: list,
                }
            }
        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }
    }

    function updateItem(src) {
        if (!src) {
            return {
                success: 0,
                message: '参数错误'
            }
        }
        try {
            const datalist = db.get("datalist")
            let flag = false
            for (let k = 0; k < datalist.length; k++) {
                const item = datalist[k]
                if (item.id === src.id) {
                    const date = new Date()
                    datalist[k] = {
                        ...item,
                        ...src,
                        update_time: date.Format("yyyy-MM-dd hh:mm:ss")
                    }
                    flag = true
                    break
                }
            }
            db.set("datalist", datalist)
            return {
                success: flag ? 1 : 0,
                data: {
                    id: src.id,
                },
                message: flag ? "修改成功" : '修改失败,id不存在',
            }
        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }

    }

    function updateItems(src, params = {}) {
        if (!src) {
            return {
                success: 0,
                message: '参数错误'
            }
        }
        try {
            const datalist = db.get("datalist")
            for (let k = 0; k < datalist.length; k++) {
                const item = datalist[k]
                let flag = true
                for (let key of Object.keys(params)) {
                    if (item[key] !== params[key]) {
                        flag = false
                        break
                    }
                }
                if (flag) {
                    const date = new Date()
                    datalist[k] = {
                        ...item,
                        // ...src,
                        update_time: date.Format("yyyy-MM-dd hh:mm:ss")
                    }
                    for(let skey of Object.keys(src)) {
                        if(typeof src[skey] === 'function') {
                            datalist[k][skey] = src[skey](item)
                        } else {
                            datalist[k][skey] = src[skey]
                        }
                    }
                }
            }
            db.set("datalist", datalist)
            return {
                success: 1,
                message: "操作完成",
            }
        } catch (err) {
            return {
                success: 0,
                message: err,
            }
        }

    }

    function replaceAll(list) {
        db.set("datalist", list)
        return {
            success: 1,
            message: '操作成功'
        }
    }


    return {addItem, addItems, deleteItem, getItems, getAll, get, updateItem, updateItems, db, getOne, replaceAll}
}
