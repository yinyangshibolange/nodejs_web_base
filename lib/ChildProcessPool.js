const ChildProcess = require("./ChildProcess")
const throttle = require("lodash/throttle")

class ChildProcessPool {
    poolList = []
    constructor() {

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