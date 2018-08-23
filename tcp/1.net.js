let net = require('net');

let server = net.createServer();
server.on('connection',(socket)=>{
    socket.setEncoding('utf8');
    socket.on('data',(data)=>{
        console.log(data)
    })
    socket.write(`
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 2

ok
    `)
})

server.listen(3000);