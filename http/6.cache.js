let http = require('http');
let path = require('path');
let fs = require('fs');
let url = require('url');
let server = http.createServer();
// 协商缓存方式1 根据上次修改时间来判断 
// 服务端设置响应头Last-Modified 最后修改时间
// 客户端请求时带上If-Modified-Since 然后判断这两个值是否相等 不想等说明文件有变动 返回新内容 相等返回304 缓存
server.on('request',(req,res)=>{
    let {pathname,query} = url.parse(req.url,true);
    let readPath = path.join(__dirname, 'public',pathname);
    try {
        let statObj = fs.statSync(readPath);
        res.setHeader('Cache-Control','no-cache');
        if(statObj.isDirectory()){
            let p = path.join(readPath,'index.html');
            let statObj = fs.statSync(p);
            res.setHeader('Last-Modified',statObj.ctime.toGMTString());
            if(req.headers['if-modified-since'] === statObj.ctime.toGMTString()){
                res.statusCode = 304;
                res.end();
                return
            }
            fs.createReadStream(p).pipe(res)
        }else{
            res.setHeader('Last-Modified',statObj.ctime.toGMTString());
            if(req.headers['if-modified-since'] === statObj.ctime.toGMTString()){
                res.statusCode = 304;
                res.end();
                return
            }
            fs.createReadStream(readPath).pipe(res)
        }
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','text/html;charset=utf8')
        res.statusCode = 404;
        res.end(`未发现文件`)
    }
})

server.listen(3000)