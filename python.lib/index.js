const { spawn } = require('child_process');
 const path = require("path")
// 启动一个子进程运行web服务器，例如使用开发服务器如http-server
const webServerProcess = spawn('python', [path.resolve(process.cwd(), 'python.lib/index.py')], {
  stdio: ['pipe', 'pipe', 'pipe']
});
 
// 监听子进程的stdout
webServerProcess.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});
 
// 监听子进程的stderr
webServerProcess.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});
 
// 当子进程退出时执行
webServerProcess.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});
 
// 当遇到错误时
webServerProcess.on('error', (err) => {
  console.error(`发生错误: ${err}`);
});