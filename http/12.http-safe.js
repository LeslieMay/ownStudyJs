let http = require('http');
let fs = require('fs');
let url = require('url');
let path = require('path');

let whiteList = ['www.zf1.cn:3000'];

let server = http.createServer((req,res)=>{
    let {pathname} = url.parse(req.url);
    let realPath = path.join(__dirname,pathname);
    try {
        let statObj = fs.statSync(realPath);
        let referer = req.headers['referer'] || req.headers['referred'];
        console.log(referer)
        if(referer){
            let current = req.headers['host'];
            referer = url.parse(referer).host
            console.log(current,referer)
        }
    } catch (error) {
        res.statusCode = 404;
        res.end('not found')
    }
}).listen(3000)