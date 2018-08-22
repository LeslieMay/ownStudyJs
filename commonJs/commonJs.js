/**
 * 手写简版commonjs
 * @author leslie
 * @description 在node中 每个包都是一个模块
 */
// 第一步 要解析出一个绝对路径 
// 第二步 如果文件不存在 添加 .js .json .node
// 第三步 上缓存里通过名字查找一下有没有加载过
// 第四步 创建一个模块 模块里有有个this.exports的对象
// 第五步 把模块放到缓存中
// 第六步 记载这个模块 根据文件后缀加载

// let path = require('path');
// let fs = require('fs');
// let vm = require('vm')
//  /**
//   * 模块的构造函数
//   */
// function MyRequire(id){
//     this.id = id;
//     this.exports = {};
// }
// MyRequire._cache = {

// }
// MyRequire.code = [
//     "(function(exports,module,require){",
//     "\n})"
// ]
// MyRequire.wrap = function(script){
//     return MyRequire.code[0]+script+MyRequire.code[1]
// }
// MyRequire.extentions = {
//     '.js':function(module){
//         let content = fs.readFileSync(module.id,'utf8');
//         let fnStr = MyRequire.wrap(content);
//         let fn = vm.runInThisContext(fnStr);
//         fn.call(module.exports,module.exports,module,req)
//     },
//     '.json':function(module){
//         let file = fs.readFileSync(module.id,'utf8');
//         module.exports = JSON.parse(file);
//     }
// }
// MyRequire.prototype.load = function(resolvePath){
//     let ext = path.extname(resolvePath)
//     console.log(ext)
//     MyRequire.extentions[ext](this);
// }
// MyRequire._resolvePath = function(relativePaeh){
//     let p = path.join(__dirname,relativePaeh);
//     if(fs.existsSync(p)) return p;
//     let flag = false;
//     for(let i in MyRequire.extentions){
//         let resultsPath = p + i;
//         if(fs.existsSync(resultsPath)) {
//             flag = true;
//             return resultsPath
//         }
//     }
//     if(!flag){
//         throw new Error("文件不存在")
//     }
// }
// /**
//  * 引入函数类似require
//  * @param {string} path 
//  */
// function req(path){
//     try {
//         let resolvePath = MyRequire._resolvePath(path);
//         if(MyRequire._cache[resolvePath]){
//             // 有缓存
//             return MyRequire._cache[resolvePath].exports
//         }
//         let module = new MyRequire(resolvePath);// 初始化一个模块
//         module.load(resolvePath);// 加载
//         MyRequire._cache[resolvePath] = module;
//         return module.exports
//     } catch (error) {
//         console.log(error)
//     }
// }





let fs = require('fs');
let path = require('path');
let vm = require('vm');

function Module(id){
    this.id = id;
    this.exports = {}
}
Module.code = ["(function(exports,module,require){","\n})"]
Module.wrap = function(script){
    return Module.code[0]+script+Module.code[1]
}
Module._cache = {}
Module.extentions = {
    '.js':function(module){
        let data  = fs.readFileSync(module.id,'utf8');
        let fnStr = Module.wrap(data);
        let fn = vm.runInThisContext(fnStr);
        fn.call(module.exports,module.exports,module,req);
    },
    '.json':function(module){
        let data  = fs.readFileSync(module.id,'utf8');
        module.exports =JSON.parse(data);
    }
}
Module.prototype.load = function(realPath){
    let ext = path.extname(realPath);
    Module.extentions[ext](this);
}
Module._resolvePath = function(relativePath){
    let p = path.join(__dirname,relativePath);
    if(fs.existsSync(p)) return p;
    for(let value in Module.extentions){
        let tmpP = p + value;
        if(fs.existsSync(tmpP)) return tmpP;
    }
    throw new Error('文件不存在')
}
function req(relativePath){
    let realPath = Module._resolvePath(relativePath);
    if(Module._cache[realPath]){
        return Module._cache[realPath].exports
    }
    let module = new Module(realPath);
    module.load(realPath);
    Module._cache[realPath] = module;
    return module.exports
}


let a = req("./a.json");
console.log(a)