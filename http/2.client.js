let http = require('http');
let query = require('querystring');
let data = query.stringify({"a":123})
let options = {
    host:'localhost',
    port:3000,
    path:'/api/test',
    headers:{
        'a':1,
        "Content-Type":'x-www-form-urlencoded',
        'Content-Length':3
    }
}

let optionsPost = {
    host:'localhost',
    port:3000,
    path:'/api/test',
    method:'POST',
    headers:{
        'b':2,
        "Content-Type":'application/x-www-form-urlencoded',
        "Content-Length":Buffer.byteLength(data)
    }
}
let client = http.request(optionsPost,(res)=>{
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`响应主体: ${chunk}`);
    });
    res.on('end', () => {
        console.log('响应中已无数据。');
    });
    res.on("error",(err)=>{
        console.log(err)
    })
})
client.write(data)
client.end()