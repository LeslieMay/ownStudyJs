let fs = require('fs');
let path = require('path');
let util = require('util');
// 同步创建
function mkpSync(p){
    let paths = p.split('/');
    for(let i = 0;i<paths.length;i++){
        let file = paths.slice(0,i+1).join('/');
        let flag = fs.existsSync(path.join(__dirname,file));
        if(!flag){
            fs.mkdirSync(path.join(__dirname,file));
        }
    }
}
// mkpSync('a/b/c/d')

// 异步创建
function mkp(p){
    let paths = p.split('/');
    let index = 0 ;
    function next(){
        if(index === paths.length) return console.log("创建成功")
        let file =path.join(__dirname,paths.slice(0,++index).join('/'));
        console.log(file)
            fs.access(file,(err,data)=>{
                if(err){
                    fs.mkdir(file,(err,data)=>{
                        next()
                    })
                    return
                }
                next()
            })
    }
    next();
}
let mkdir = util.promisify(fs.mkdir);
let access = util.promisify(fs.access);
// async await 
async function mkp1(p){
    let paths = p.split('/');
    for(let i = 0 ; i < paths.length ; i++){
        let file = paths.slice(0,i+1).join('/');
        console.log(file)
        try {
            await access(path.join(__dirname,file))
        } catch (error) {
            await mkdir(path.join(__dirname,file))
        }
    }
    console.log('done')
}
mkp1('a/b/c/d/e/f')