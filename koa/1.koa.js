let Koa = require('koa');
let fs = require('fs');
let app = new Koa();
app.use((ctx,next)=>{
    console.log(ctx)
    ctx.body = 'hello';
    next()
})
app.use((ctx,next)=>{
    ctx.body = '你好'
})
app.listen(3000)
