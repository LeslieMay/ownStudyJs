let http = require('http');
let fs = require('fs');
let path = require('path');

let size = fs.statSync(path.join(__dirname,'1.txt')).size;

console.log(size);
// 断点续传
// 请求头 Range=0-3
// 响应头 Content-Range=bytes 0-3/240
let server = http.createServer((req,res)=>{
    let range = req.headers['range'];
    console.log(range)
    if(range){
        let [,start,end] = range.match(/(\d*)-(\d*)/);
        start = start ? Number(start):0;
        end = end ? Number(end) : size -1;
        res.setHeader('Content-Range',`bytes ${start}-${end}/${size-1}`);
        fs.createReadStream(path.join(__dirname,'1.txt'),{
            start,end
        }).pipe(res);
    }else{
        fs.createReadStream(path.join(__dirname,'1.txt')).pipe(res)
    }
    // res.end('over')
})

server.listen(3000)