let Koa = require('koa')
let app = new Koa();
let Router = require('koa-router');
let router = new Router();

router.get('/article/:id',(ctx,next)=>{
    ctx.body = ctx.params.id
})
app.use(router.routes())
app.listen(3000)