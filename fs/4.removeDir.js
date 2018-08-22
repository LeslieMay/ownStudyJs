// 删除 先序深度优先（串行 并行）  广度优先

let fs = require('fs');
let path = require('path');
let util = require('util');
let stat = util.promisify(fs.stat);
let readdir = util.promisify(fs.readdir);
let unlink = util.promisify(fs.unlink);
let rmdir = util.promisify(fs.rmdir)
// fs.rmdirSync(path.join(__dirname,'a/b/c/d/e/f'))
// fs.unlinkSync(path.join(__dirname,'a/1.js'))
// 广度优先 同步
function removeDirExtentSync(p){
    let arr = [p];
    let index = 0;
    let current;
    while(current = arr[index]){
        let statObj = fs.statSync(current);
        index++;
        if(statObj.isDirectory()){
            let files = fs.readdirSync(current).map(one=>path.join(current,one));
            arr = [...arr,...files];
        }
    }
    for(let i = arr.length-1;i>=0;i--){
        let statObj = fs.statSync(arr[i]);
        if(statObj.isDirectory()){
            fs.rmdirSync(arr[i])
        }else{
            fs.unlinkSync(arr[i])
        }
    }
    console.log('done')
}
// 广度优先异步
function removeDirExtent(p,callback){
    let arr = [p];
    let index = 0;
    let current;
    function next(){
        current = arr[index];
        if(!current) return done(arr.length-1);
        index++;
        fs.stat(current,(err,statObj)=>{
            if(statObj.isDirectory()){
                fs.readdir(current,(err,data)=>{
                    data = data.map(one=>path.join(current,one))
                    arr = [...arr,...data];
                    next();
                })
            }else{
                next();
            }
        })
    }
    next()
    function done(index){
        if(index < 0) return console.log('done')
        fs.stat(arr[index],(err,statObj)=>{
            if(statObj.isDirectory()){
                fs.rmdir(arr[index],(err,data)=>{
                    done(index-1)
                })
            }else{
                fs.unlink(arr[index],(err,data)=>{
                    done(index-1)
                })
            }
        })
        
    }
}
// 广度优先async await
async function removeDirAsync(p){
    let arr = [p];
    let index = 0;
    let current;
    while(current = arr[index]){
        index++;
        let statObj = await stat(current);
        if(statObj.isDirectory()){
            let files = await readdir(current);
            files = files.map(one=>path.join(current,one))
            arr = [...arr,...files];
        }
    }
    console.log(arr);
    for(let i = arr.length-1;i>=0;i--){
        let statObj = await stat(arr[i]);
        if(statObj.isDirectory()){
            await rmdir(arr[i])
        }else{
            await unlink(arr[i])
        }
    }
}
// removeDirAsync('a').then(()=>console.log('done'))



// 同步 删除 先序深度删除
function removeDirDepthSync (p) {
    let statObj = fs.statSync(p)
    if(statObj.isDirectory()){
        // 是个文件夹
        let files = fs.readdirSync(p).map(item=>path.join(p,item));
        files.forEach(item=>{
            removeDirDepthSync(item)
        })
        fs.rmdirSync(p)
    }else{
        // 是个文件
        fs.unlinkSync(p)
    }
}

// 异步 删除 先序深度删除 并行
function removeDirDepth(p,callback){
    fs.stat(p,(err,data)=>{
        if(data.isDirectory()){
            fs.readdir(p,(err,data)=>{
                let num = 0;
                if(data.length == 0) {
                    fs.rmdir(p,callback)
                }
                data = data.map(one=>path.join(p,one));
                data.forEach(item=>removeDirDepth(item,done))
                function done(){
                    num++
                    if(num == data.length){
                        fs.rmdir(p,callback)
                    }
                }
            })
        }else{
            fs.unlink(p,callback)
        }
    })
}
// 异步 删除 先序深度删除 串行
function removeDirDepthParalle(p,callback){
    fs.stat(p,(err,data)=>{
        if(data.isDirectory()){
            fs.readdir(p,(err,data)=>{
                // if(data.length == 0) {
                //     fs.rmdir(p,callback)
                // }
                data = data.map(one=>path.join(p,one));
                function next(index){
                    if(index === data.length){
                        return fs.rmdir(p,callback)
                    }
                    removeDirDepthParalle(data[index],()=>{next(index+1)});
                }
                next(0)
            })
        }else{
            fs.unlink(p,callback)
        }
    })
}

// async 先序深度删除 并行
async function removeDirDepthParalleAsync(p){
    let statObj = await stat(p);
    if(statObj.isDirectory()){
        let data = await readdir(p);
        let promises = data.map(one=>removeDirDepthParalleAsync(path.join(p,one)));
        await Promise.all(promises)
        await rmdir(p)
    }else{
        await unlink(p)
    }
}

// async 先序深度删除 串行
async function removeDirDepthSerialAsync(p){
    let statObj = await stat(p);
    if(statObj.isDirectory()){
        let data = await readdir(p);
        let promises = data.map(one=>removeDirDepthParalleAsync(path.join(p,one)));
        for(let i = 0 ; i<promises.length;i++){
            await promises[i]
        }    
        await rmdir(p)
    }else{
        await unlink(p)
    }
}

removeDirDepthSerialAsync('a').then(()=>console.log('done'))
