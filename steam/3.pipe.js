let fs = require('fs');
let path = require('path');

let myReadStram = require('./myReadStream')
let myWriteStream = require('./myWriteStream');
let rs =new myReadStram(path.join(__dirname,'../plan.md'),{
    flags:'r',
    encoding:null,
    autoClose:true,
    start:0,
    highWaterMark:3
})

let ws =new myWriteStream(path.join(__dirname,'3.text'),{
    flags:'w',
    encoding:'utf8',
    autoClose:true,
    start:0,
    highWaterMark:3
})
rs.pipe(ws)