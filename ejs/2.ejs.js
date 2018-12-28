let Koa = require('koa');

let app = new Koa();
let path = require('path');
let fs = require('fs')
let util = require('util')
let readFile = util.promisify(fs.readFile)
function views(dir,{extension}){
    return async (ctx,next)=>{
        ctx.render = async function(p,obj){
            let realPath = path.join(dir,p)+'.'+extension;
            let str = await readFile(realPath,'utf8');
            ctx.body = require(extension).render(str,obj)
        }
        await next()
    }
}

app.use(views(path.join(__dirname,'views'),{
    extension: 'ejs'
}))
app.use(async (ctx,next)=>{
    await ctx.render('index',{name: 'hahaha'})
})
app.listen(3000)