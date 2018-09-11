let http = require('http');
let fs = require('fs');
let path = require('path');
let zlib = require('zlib');
// 如果要实现下载文件 服务端返回一个响应头 Content-Disposition attachment

// 实现gzip压缩 客户端指定可接受的accept-encoding，服务端根据这个值决定用哪个方法压缩 并且在响应头中指定Content-Encoding 压缩类型 客户端就会自行判断进行解压
http.createServer((req,res)=>{
    if(req.url === '/download'){
        res.setHeader('Content-Disposition','attachment');
        return fs.createReadStream(path.join(__dirname,'2.txt')).pipe(res)
    }
    let rule = req.headers['accept-encoding'];
    if(rule){
        if(rule.match(/\bgzip\b/)){
            res.setHeader('Content-Encoding','gzip');
            fs.createReadStream(path.join(__dirname,'2.txt')).pipe(zlib.createGzip()).pipe(res)
        }else if(rule.match(/\bdeflate\b/)){
            res.setHeader('Content-Encoding','deflate');
            fs.createReadStream(path.join(__dirname,'2.txt')).pipe(zlib.createDeflate()).pipe(res)
        }else{
            res.createReadStream(path.join(__dirname,'2.txt')).pipe(res)
        }
    }else{
        res.createReadStream(path.join(__dirname,'2.txt')).pipe(res)
    }
}).listen(3000)