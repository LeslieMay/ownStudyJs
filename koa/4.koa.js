let Koa = require('koa');

let app = new Koa();

let Router = require('koa-router');

let router = new Router();

router.get('/',(ctx,next)=>{
    console.log(1);
    ctx.body = 'world'
})
router.get('/a',(ctx,next)=>{
    ctx.body = 'hello'
})

app.use(router.routes())
app.use((ctx,next)=>{
    ctx.body = 'welcome'
})
app.listen(3000);