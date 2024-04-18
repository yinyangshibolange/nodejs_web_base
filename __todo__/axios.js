// 首先，发送请求以确保服务器开始发送SSE
axios.get('/api/sse-stream', {
 responseType: 'stream' // 设置响应类型为流
})
.then(response => {
 // 使用原生的EventSource API处理SSE流
 const eventSource = new EventSource(response.request.responseURL);

 eventSource.onopen = function(event) {
   // 连接打开时的处理
   console.log("Connection opened...");
 };

 eventSource.onmessage = function(event) {
   // 接收到新的消息时的处理
   console.log("Message received:", event.data);
 };

 eventSource.onerror = function(event) {
   // 发生错误时的处理
   console.error("EventSource failed.");
 };
})
.catch(error => {
 console.error("Error creating SSE stream:", error);
});