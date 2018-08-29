let http = require('http');
let path = require('path');
let fs = require('fs');
let url = require('url');
// 强制缓存
// 服务端设置Cache-Control：max-age=xxx (以秒为单位)
// 然后在设置Expires 过期时间 
let server = http.createServer();
server.on('request',(req,res)=>{
    let {pathname,query} = url.parse(req.url,true);
    let readPath = path.join(__dirname, 'public',pathname);
    console.log(readPath)
    try {
        let statObj = fs.statSync(readPath);
        res.setHeader('Cache-Control','max-age=10');
        res.setHeader('Expires',new Date(Date.now()+10*1000).toGMTString());

        if(statObj.isDirectory()){
            let p = path.join(readPath,'index.html');
            console.log(p);
            fs.statSync(p);
            fs.createReadStream(p).pipe(res)
        }else{
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