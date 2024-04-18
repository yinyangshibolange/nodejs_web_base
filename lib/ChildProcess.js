const { spawn } = require('child_process');
const path = require("path")
const { v4: uuid } = require("uuid")

class ChildProcess {
    id = null
    name = ''
    process_spawn = null
    isFinish = false
    isError = false
    history = []

    constructor(shell, options = {}) {
        this.id = uuid()
        // 启动一个子进程运行web服务器，例如使用开发服务器如http-server
        this.process_spawn = spawn('python', [path.resolve(process.cwd(), 'python.lib/index.py')], {
            stdio: ['pipe', 'pipe', 'pipe']
        });

        const { name,  onMessage } = options
        this.name = name || shell

        // 监听子进程的stdout
        process_spawn.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            const message = {
                type: 'print',
                msg: data
            }
            this.history.push(message) 
            if(typeof onMessage === 'function') {
                onMessage(message)
            }
        });

        // 监听子进程的stderr
        process_spawn.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            const  message = {
                type: 'printError',
                msg: data
            }
            this.history.push(message) 
            if(typeof onMessage === 'function') {
                onMessage(message)
            }
        });

        // 当子进程退出时执行
        process_spawn.on('close', (code) => {
            console.log(`子进程退出，退出码 ${code}`);
            const message = {
                type: 'close',
               msg: `子进程退出，退出码 ${code}`
            }
            this.history.push(message) 
            this.isFinish = true
            if(typeof onMessage === 'function') {
                onMessage(message)
            }
        });

        // 当遇到错误时
        process_spawn.on('error', (err) => {
            console.error(`发生错误: ${err}`);
            const message = {
                type: 'error',
                msg: `发生错误: ${err}`
            }
            this.history.push(message) 
            this.isError= true
            if(typeof onMessage === 'function') {
                onMessage(message)
            }
        });
    }

}

module.exports = ChildProcess