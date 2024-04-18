
async function routerGen(str, renderFuns) {
    if(renderFuns) {
        const _ms = [...str.matchAll(/\[:(\w+)\]/g)]
        const funList = []
        _ms.forEach(item => {
            const key = item[1]
            if(typeof renderFuns[key] === 'function') {
                funList.push({
                    key,
                    fun: renderFuns[key]
                })
            }
        })
        // instanceof Promise
        let genedList = []
        function genParamList(funList, index =0) {
            return new Promise((resolve, reject) => {
                if(index >= funList.length) {
                    resolve(genedList)
                } else {
                    const res = funList[index]()
                    if(res instanceof Promise) {
                        res.then((res) => {
                            // console.log(res)
                            genedList = [...genedList, res]
                            genParamList(funList, index + 1)
                                .then(resolve)
                        })
                    } else {
                        genedList = [...genedList, res]
                        genParamList(funList, index + 1)
                            .then(resolve)
                    }
                }
            })
        }
        const dataList = await genParamList(funList.map(item => item.fun))
        const keys = funList.map(item => item.key)
        // [ [m] ,  [n] ...] 的数组交叉 生成 [m*n*...]的数组
        function crossArr(arr) {
            if(arr.length === 1) {
                return arr[0]
            } else {
                const _arr = arr[0]
                const _arr1 = arr[1]
                const res = []
                for(let i=0;i<_arr.length;i++) {
                    for(let j=0;j<_arr1.length;j++) {
                        if(Array.isArray(_arr[i])) {
                            res.push([..._arr[i], _arr1[j]])
                        } else {
                            res.push([_arr[i], _arr1[j]])
                        }
                    }
                }
                return crossArr([res, ...arr.slice(2)])
            }
        }
        let resList = []
        if(dataList.length === 0 ) {
            return str
        } else if(dataList.length > 1) {
            resList = crossArr(dataList)
        } else if(dataList.length === 1) {
            resList = dataList[0].map(item => [item])
        }
        return resList.map(item => {
            let url =str
            item.forEach((item1, index) => {
                url = url.replace(`[:${keys[index]}]`, item1)
            })
            return url
        })
    } else {
        return str
    }

}

async function genHtmlsByRouters(routers) {
    const htmls =  []

    // renderIndex
    for(let k=0;k<routers.length;k++) {
        const item = routers[k]
        if (Array.isArray(item.index)) {
            for(let j=0;j<item.index.length;j++) {
                const item1 = item.index[j]
                const res = await routerGen(item1, item.renderIndex)

                if(Array.isArray(res)) {
                    res.forEach(item2 => {
                        htmls.push({
                            ...item,
                            origin_index: item1,
                            index: item2
                        })
                    })
                } else {
                    htmls.push({
                        ...item,
                        origin_index: item1,
                        index: res
                    })
                }
            }
        } else if (typeof item.index === 'string') {
            const res = await routerGen(item.index, item.renderIndex)
            if(Array.isArray(res)) {
                res.forEach(item2 => {
                    htmls.push({
                        ...item,
                        origin_index: item.index,
                        index: item2
                    })
                })
            } else {
                htmls.push({
                    ...item,
                    origin_index: item.index,
                    index: res
                })
            }

        }
    }

    return htmls
}

module.exports = {
    genHtmlsByRouters
}
