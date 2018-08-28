let http = require('http');
let fs = require('fs');
let path = require('path');
let start = 0;
let pause = false;
let options = {
    host:'localhost',
    port:3000,
    headers:{}
}
process.stdin.on('data',(data)=>{
    if(data.toString().includes('p')){
        pause = true;
    }else{
        pause = false;
        download()
    }
})
function download(){
    options.headers.Range = `bytes=${start}-${start+3}`
    start += 4;
    let client = http.request(options,(res)=>{
        let total = res.headers['content-range'].split('/')[1];
        console.log(pause,start,total)
        res.on('data',(data)=>{
            fs.appendFileSync(path.join(__dirname,'2.txt'),data)
        })
        res.on('end',()=>{
            setTimeout(()=>{
                if(!pause && start < total){
                    download()
                }
            },1000)
        })
    })
    client.end();
}
download()
