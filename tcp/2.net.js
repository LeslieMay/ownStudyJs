let net = require('net');

let server = net.createServer();
server.on('connection',(socket)=>{
    socket.setEncoding('utf8');
    socket.on('data',(data)=>{
        socket.write('hello')
    })
})
server.listen(3000)