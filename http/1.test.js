let http = require('https');
let fs = require('fs');
let path = require('path');
let query = require('querystring');

let results = []
function next(page){
    let params = query.stringify({
        "mod":"issue",
        "ajax":1,
        "action":"getPage",
        "page":page
    })
    let options = {
        hostname:'www.p2peye.com',
        port:443,
        path:`/platformData.php`,
        method:'POST',
        headers:{
            "Content-Type":'application/x-www-form-urlencoded',
            "Content-Length":Buffer.byteLength(params)
        }
    }
    let client = http.request(options,(res)=>{
        res.setEncoding('utf8');
        let buf = []
        res.on('data',(data)=>{
            buf.push(data)
        })
        res.on('end', () => {
            let r = buf.join('');
            if(JSON.parse(r).code!='0'){
                write(r)
            }else{
                results.push(r);
                next(page+1)
            }
        });
        res.on("error",(err)=>{
            console.log(err)
        })
    })
    client.write(params)
    client.end()
}
next(1)

function write(arr){
    let r = [];
    console.log(arr)
    arr.forEach(element => {
        r = [...r , ...element]
    });
    console.log('write')
    // fs.writeFile(path.join(__dirname,'result.json'),JSON.stringify(r),(err,data)=>{
    //     if(err) return console.log(err)
    //     console.log('done')
    // })
}


// let fs = require('fs');
// let path = require('path');
// let r = fs.readFileSync(path.join(__dirname,'results.json'),'utf8');

// r = JSON.parse(r);
// r = r.map(one=>one.name).join('\r\n');

// fs.writeFile(path.join(__dirname,'results1.json'),r,()=>{
//     console.log('done')
// })