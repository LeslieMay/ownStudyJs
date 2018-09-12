let fs = require('fs');

let path = require('path');

let r = fs.readFileSync(path.join(__dirname,'./1.ejs.html'),'utf8');

let school = {name:'hahaha'}
function render(r,obj){
    return r.replace(/<%=([\s\S]*?)%>/g,function(){
        return obj[arguments[1]]
    })
}
console.log(render(r,school))