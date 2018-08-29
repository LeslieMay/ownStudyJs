let http = require('http');
let httpProxy = require('http-proxy');

let proxyServer = httpProxy.createProxy();
let map = {
    'www.zf1.cn':'http://localhost:3001',
    'www.zf2.cn':'http://localhost:3002'
}
http.createServer((req,res)=>{
    let target = req.headers['host'].split(':')[0];
    proxyServer.web(req,res,{
        target:map[target]
    })
}).listen(3000)