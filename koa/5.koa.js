let Koa = require('koa')
let app = new Koa();
let Router = require('koa-router');

let user = new Router();

user.get('/login',(ctx,next)=>{
    ctx.body = 'user-login'
})
user.get('/reg',(ctx,next)=>{
    ctx.body = 'user-reg'
})

let admin = new Router();
admin.get('/login',(ctx,next)=>{
    ctx.body = 'admin-login'
})
admin.get('/reg',(ctx,next)=>{
    ctx.body = 'admin-reg'
})

let router = new Router();
router.get('/',(ctx,next)=>{})
router.use('/user',user.routes())
router.use('/admin',admin.routes())
app.use(router.routes());
app.listen(3000)