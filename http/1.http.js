let http = require('http');

let server = http.createServer();

server.on('request',(req,res)=>{
    console.log(req.method);
    console.log(req.url);
    console.log(req.httpVersion)
    console.log(req.headers)
    req.on('data',(data)=>{
        // data 是接受post请求 的请求体
        console.log(data)
    })
    req.on('end',()=>{
        console.log('end');
        res.statusCode = 200;
        res.end('ok')
    })
})

server.listen(3000,()=>{
    console.log('start')
})