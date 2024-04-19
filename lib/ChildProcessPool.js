const ChildProcess = require("./ChildProcess")
const throttle = require("lodash/throttle")

class ChildProcessPool {
    poolList = []
    constructor() {
        // 初始化时可以先查询所有之前的线程任务，也可以不查询，只提供当前内存中的线程任务，如果要保存之前的就需要使用持久化
        // 不能再用文件存储了，得用数据库，
    }

    create(shell, option) {
        const childProcess = new ChildProcess(shell, {
            ...option,
            onMessage: (message) => {
                if (option && typeof option.onMessage === 'function') {
                    option.onMessage(message)
                }

                
            }
        })
        this.poolList.push(childProcess)
        return childProcess
    }

    getChildProcessList() {
        return this.poolList
    }

    getById(id) {
        return this.poolList.find(item => item.id === id)
    }

    closePool(id) {
        const index = this.poolList.findIndex(item.id === id)
        if (this.poolList[index].isFinish || this.poolList[index].isError) {
            this.poolList.splice(index, 1)
            return true
        } else {
            return false
        }
    }
}