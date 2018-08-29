let http = require('http');
let proxy = require('http-proxy');
let proxyServer = proxy.createProxyServer();

http.createServer((req,res)=>{
    proxyServer.on('proxyReq',(proxyReq,req,res,options)=>{
        proxyReq.setHeader('key','hello')
    })
    proxyServer.web(req,res,{
        target:"http://localhost:3001"
    })
}).listen(3000)