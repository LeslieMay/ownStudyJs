let zlib = require('zlib');
let fs = require('fs');
let path = require('path');

function gzip(path){
    let transform = zlib.createGzip();// 压缩是一个转换流
    fs.createReadStream(path).pipe(transform).pipe(fs.createWriteStream(path+'.gz'))
}

// gzip(path.join(__dirname,'2.txt'))


function unGzip(p){
    console.log(path.basename(p,'.gz'))
    let transform = zlib.createGunzip();// 解压
    fs.createReadStream(p).pipe(transform).pipe(fs.createWriteStream(path.join(__dirname,path.basename(p,'.gz'))))
}
unGzip(path.join(__dirname,'2.txt.gz'))