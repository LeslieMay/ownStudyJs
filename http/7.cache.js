let http = require('http');
let path = require('path');
let fs = require('fs');
let url = require('url');
let crypto = require('crypto');
let server = http.createServer();
// 协商缓存2 利用Etag和if-none-match进行比对
// 服务端将客户端请求的数据 文件 进行可写流读出来，将内容进行md5加密生成base64hash串 将hash值通过Etag设置给客户端
// 客户端将上一次传来的hash值通过If-None-Match进行传给服务端 服务端比较当前文件生成的hash值和上一次值 如果相等说明文件没变 就返回304 变化了 说明文件改变了 就返回新的内容给客户端
server.on('request',(req,res)=>{
    let {pathname,query} = url.parse(req.url,true);
    let readPath = path.join(__dirname, 'public',pathname);
    try {
        let statObj = fs.statSync(readPath);
        res.setHeader('Cache-Control','no-cache');
        if(statObj.isDirectory()){
            let p = path.join(readPath,'index.html');
            let statObj = fs.statSync(p);
            let rs = fs.createReadStream(p);
            let md5 = crypto.createHash('md5');
            let arr = [];
            rs.on('data',(data)=>{
                arr.push(data);
                md5.update(data);
            })
            rs.on('end',(data)=>{
                let r = md5.digest('base64');
                res.setHeader('Etag',r);
                if(req.headers['if-none-match']===r){
                    res.statusCode=304;
                    res.end();
                    return;
                }
                res.end(Buffer.concat(arr))
            })
        }else{
            let rs = fs.createReadStream(readPath);
            let md5 = crypto.createHash('md5');
            let arr = [];
            rs.on('data',(data)=>{
                arr.push(data);
                md5.update(data);
            })
            rs.on('end',(data)=>{
                let r = md5.digest('base64');
                res.setHeader('Etag',r);
                if(req.headers['if-none-match']===r){
                    res.statusCode=304;
                    res.end();
                    return;
                }
                res.end(Buffer.concat(arr))
            })
        }
    } catch (error) {
        console.log(error)
        res.setHeader('Content-Type','text/html;charset=utf8')
        res.statusCode = 404;
        res.end(`未发现文件`)
    }
})

server.listen(3000)