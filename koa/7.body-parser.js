let Koa = require('koa');

let app = new Koa();
let fs = require('fs');
let path = require('path');
let Router = require('koa-router');
let bodyParser = require('koa-bodyparser')

let router = new Router();

app.use(bodyParser());

router.get('/',(ctx,next)=>{
    ctx.set('Content-Type','text/html;charset=utf8');
    ctx.body = fs.createReadStream(path.join(__dirname,'index.html'))
})
router.post('/submit',(ctx,next)=>{
    ctx.body = ctx.request.body
})

app.use(router.routes())
app.use(router.allowedMethods());
app.listen(3000)