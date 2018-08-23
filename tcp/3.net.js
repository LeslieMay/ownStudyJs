let net = require('net');

let server = net.createServer();
let client = []
server.on('connection',(socket)=>{
    client.push(socket);
    socket.setEncoding('utf8');
    // 获取当前连接数
    server.getConnections((err,data)=>{
        socket.write(`当前聊天室可以容纳${server.maxConnections},你是当前第${data}人\r\n`);
        server.unref();
    })
    socket.on('data',(data)=>{
        client.forEach(s=>{
            if(s!==socket){
                s.write(data)
            }
        })
    })
    socket.on('end',()=>{
        client = client.filter(s=>s!==socket)
    })
})
server.on('close',function () {
    console.log('close');
})
server.maxConnections = 3;
server.listen(3000)