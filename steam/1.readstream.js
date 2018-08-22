let fs = require('fs');
let path = require('path');

let myReadStram = require('./myReadStream')

let rs =new myReadStram(path.join(__dirname,'../1.txt'),{
    flags:'r',
    encoding:null,
    autoClose:true,
    start:0,
    highWaterMark:3
})
// 先触发open  然后监听了data后 触发data 然后触发end  close
let buf = [];
// rs.on('data',(r)=>{
//     console.log(r)
//     // buf.push(r)
//     // rs.pause();
//     // setTimeout(() => {
//     //     rs.resume()
//     // }, 1000);
// })
rs.on('end',()=>{
    console.log('end')
})
rs.on('open',()=>{
    console.log('open')
})
rs.on('close',()=>{
    console.log('close')
})
rs.on('error',(err)=>{
    console.log(err)
})