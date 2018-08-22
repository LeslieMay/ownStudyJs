let fs = require('fs');
let path = require('path');

let myWriteStream = require('./myWriteStream');
let ws =new myWriteStream(path.join(__dirname,'3.text'),{
    flags:'w',
    encoding:'utf8',
    mode:0o666,
    autoClose:true,
    start:0,
    highWaterMark:3
})
// 写流第一次 会直接写入文件 接下来都会存入到内存空间 内存空间的大小就是hightwatermark大 当内存空间清空之前满了 并且全部清空了之后 会emit('drain') 接着 重复这个步骤
let flag = ws.write('1','utf8',()=>{

})
console.log(flag)
flag = ws.write('1','utf8',()=>{

})
console.log(flag)
flag = ws.write('1','utf8',()=>{

})
console.log(flag)
setTimeout(()=>{
    flag = ws.write('1','utf8',()=>{

    })
    console.log(flag)
    flag = ws.write('1','utf8',()=>{
    
    })
    console.log(flag)
    // flag = ws.write('1','utf8',()=>{
    
    // })
    // console.log(flag)
},2000)

ws.on('drain',()=>{
    console.log('drain')
})