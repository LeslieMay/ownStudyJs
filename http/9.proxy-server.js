let http = require('http');

http.createServer((req,res)=>{
    if(req.headers['key']!=='hello'){
        res.statusCode = 403;
        res.end('not allow')
    }else{
        res.statusCode = 200;
        res.end('yes')
    }
}).listen(3001)