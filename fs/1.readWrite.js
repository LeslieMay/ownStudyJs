let fs = require('fs');
let path = require('path');
let data = fs.readFileSync('plan.md',{encoding:'utf8',flag:'r'});
console.log(data)

fs.appendFile(path.join(__dirname,'2.text'),'hahahahha',function(){
    console.log("success")
})

// 拷贝

fs.readFile(path.join(__dirname,'../plan.md'),'utf8',function(err,data){
    fs.writeFile(path.join(__dirname,'2.text'),data,function(){
        console.log("success")
    })
})