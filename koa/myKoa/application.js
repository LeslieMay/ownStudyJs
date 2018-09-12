let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
let EventEmitter = require('events');
let Stream = require('stream')
class Koa extends EventEmitter{
    constructor(){
        super();
        this.middlewares = []; // 存储中间件
        this.context = Object.create(context);
        this.request = Object.create(request);
        this.response = Object.create(response);
    }
    use(fn){
        this.middlewares.push(fn);
    }
    createContext(req,res){
        let ctx = this.context;

        ctx.request = this.request;
        ctx.response = this.response;

        ctx.req = ctx.request.req = req;
        ctx.res = ctx.response.res = res;
        return ctx
    }
    compose(ctx,middlewares){
        function dispatch(index){
            if(index === middlewares.length) return Promise.resolve()
            let fn = middlewares[index];
            return Promise.resolve(fn(ctx,()=>dispatch(index+1)))
        }
        return dispatch(0);
    }
    handleRequest(req,res){
        let ctx = this.createContext(req,res);
        let p = this.compose(ctx,this.middlewares);
        p.then(()=>{
            let body = ctx.body;
            if(body instanceof Stream){
                body.pipe(res)
            }else if(Buffer.isBuffer(body) || typeof body === 'string'){
                res.end(body)
            }else if(typeof body === 'object'){
                res.end(JSON.stringify(body))
            }else{
                res.end(body)
            }
        }).catch(err=>{
            this.emit('error',err)
        })
    }
    listen(...args){
        let server = http.createServer(this.handleRequest.bind(this));
        server.listen(...args);
    }
}

module.exports = Koa;