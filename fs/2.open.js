let fs = require('fs');
let path = require('path');

// fs.open(path.join(__dirname,'2.text'),'r',(err,fd)=>{
//     let buf = Buffer.alloc(1000);
//     fs.read(fd,buf,0,1000,3,(err,bytesRead)=>{
//         console.log(bytesRead)
//     })
// })

// fs.open(path.join(__dirname,'3.text'),'w',(err,fd)=>{
//     let buf = Buffer.from('祝福');
//     fs.write(fd,buf,0,6,3,(err,writeBytes)=>{
//         console.log('写入成功')
//     })
// })

// 拷贝
let SIZE = 6;
let rpos = 0;
let wpos = 0;
fs.open(path.join(__dirname,'2.text'),'r',(err,rfd)=>{
    fs.open(path.join(__dirname,'3.text'),'w',(err,wfd)=>{
        function next(){
            let buf = Buffer.alloc(SIZE);
            fs.read(rfd,buf,0,SIZE,rpos,(err,readBytes)=>{
                rpos += readBytes
                if(readBytes>0){
                    fs.write(wfd,buf,0,readBytes,wpos,(err,writeBytes)=>{
                        wpos += writeBytes;
                        next()
                    })
                }else{
                    fs.close(rfd,()=>{
                    })
                    fs.fsync(wfd,()=>{
                        fs.close(wfd,()=>{
                            console.log('写入成功')
                        })
                    })
                }
            })
        }
        next()
    })
})