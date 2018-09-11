let http = require('http');
let util = require('util');
let url = require('url');
let zlib = require('zlib');
let fs = require('fs');
let path = require('path');

// 第三方
let ejs = require('ejs');
let template = fs.readFileSync(path.join(__dirname,'index.tmp.html'),'utf8')

let chalk = require('chalk');
let mime = require('mime');

let debug = require('debug')('dev');// dev 环境才打印日志
let stat = util.promisify(fs.stat);
let readdir = util.promisify(fs.readdir);

let config = require('./config')
class Server {
    constructor(command){
        this.config = {...config,...command}
        this.template = template;
    }
    async handleRequest(req,res){
        let {dir} = this.config;
        let {pathname} = url.parse(req.url);
        if(pathname === 'favicon.ico') return res.end()
        pathname = decodeURIComponent(pathname);
        let p = path.join(dir,pathname);
        try {
            res.setHeader('Content-Type','text/html;charset=utf8');
            let statObj = await stat(p);
            if(statObj.isDirectory()){
                let dirs = await readdir(p);
                dirs = dirs.map((item)=>({
                    name:item,
                    href:path.join(pathname,item)
                }))
                let str = ejs.render(this.template,{
                    name: `Index of ${pathname}`,
                    arr:dirs
                })
                res.end(str);
            }else{
                this.sendFile(req,res,statObj,p)
            }
        } catch (error) {
            debug(error); // 发送错误
            this.sendError(req, res);
        }
    }
    cache(req,res,statObj,p){
        res.setHeader('Cache-Control','no-cache');
        res.setHeader('Expires',new Date(Date.now()+10*1000).getTime())
        let etag = statObj.ctime.getTime()+'-'+statObj.size;
        let lastModified = statObj.ctime.getTime();
        res.setHeader('Etag',etag);
        res.setHeader('Last-Modified',lastModified);

        let ifNoneMatch = req.headers['if-none-match'];
        let ifModifiedSince = req.headers['if-modified-since'];

        if(etag !== ifNoneMatch && lastModified !== ifModifiedSince){
            return false
        }
        return true
    }
    gzip(req,res,statObj,p){
        let encoding = req.headers['accept-encoding'];
        if(encoding){
            if(encoding.match(/\bgzip\b/)){
                res.setHeader('Content-Encoding','gzip')
                return zlib.createGzip();
            }
            if(encoding.match(/\deflate\b/)){
                res.setHeader('Content-Encoding','deflate')
                return zlib.createDeflate();
            }
            return false
        }else{
            return false
        }
    }
    range(req,res,statObj,p){
        let range = req.headers['range'];
        if(range){
            let [,start,end] = range.match(/bytes=(\d*)-(\d*)/);
            start = start ? Number(start) : 0;
            end = end ? Number(end) : statObj.size - 1;
            res.statusCode = 206;
            res.setHeader('Content-Range',`bytes ${start}-${end}/${statObj.size - 1}`);
            fs.createReadStreamp(p,{start,end}).pipe(res)
        }else{
            return false
        }
    }
    sendFile(req,res,statObj,p){
        if(this.cache(req,res,statObj,p)){
            res.statusCode = 304;
            return res.end()
        }
        if(this.range(req,res,statObj,p))return res.setHeader('Content-Type',mime.getType(p)+';charset=utf8');
        let transform = this.gzip(req,res,statObj,p);
        if(transform){
            return fs.createReadStream(p).pipe(transform).pipe(res)
        }
        fs.createReadStream(p).pipe(res)
    }
    sendError(req,res){
        res.statusCode = 404;
        res.end('not found');
        this.start();
    }
    start(){
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(this.config.port,this.config.host,()=>{
            console.log(`server start http://${this.config.host}:${chalk.green(this.config.port)}`)
        })
    }
}

module.exports = Server;