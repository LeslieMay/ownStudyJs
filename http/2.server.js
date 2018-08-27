let http = require('http');
let query = require('querystring');
let server = http.createServer((req,res)=>{
    console.log(req.method);// 方法
    console.log(req.headers);// 头
    console.log(req.url);//请求的url

    let arr = [];//data


    req.on('data',(data)=>{
        arr.push(data)
    })
    req.on("end",()=>{
        let r = Buffer.concat(arr).toString();
        if(req.headers['content-type']==='x-www-form-urlencoded'){
            r = query.parse(r);
            console.log(r)
        }else if(req.headers['content-type']==='application/json'){
            console.log(JSON.parse(r))
        }else{
            console.log(r)
        }
    })
    res.end('end...')

})
server.listen(3000)