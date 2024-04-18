
const http = require('http');
 
const server = http.createServer((req, res) => {
  // 发送SSE预备响应头
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  });
 
  // 定时发送数据到客户端
  setInterval(() => {
    const data = `data: ${new Date().toISOString()}\n\n`;
    res.write(data);
  }, 1000);
 
  // 处理客户端关闭连接
  req.on('close', () => {
    console.log('Connection closed');
  });
});
 
server.listen(3000, () => {
  console.log('Server is running on port 3000');
});