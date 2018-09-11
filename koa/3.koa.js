let Koa = require('koa');

let app = new Koa();

let log = () => {
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log('log');
            resolve();
        },1000)
    })
}
app.use(async (ctx,next)=>{
    console.log(1);
    await next();
    console.log(2)
})
app.use(async (ctx,next)=>{
    console.log(3)
    await log();
    console.log(4)
})
app.listen(3000)