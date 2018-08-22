// let Promise = require('./test.js');
import Promise from './test'

let test = new Promise((resolve, reject) => {
    reject(123)
})

test.then(null,err=>{
    console.log('err:'+err)
}).then(data=>{
    console.log('1:'+data)
    return 1234
},err=>{
    console.log('err1:'+err)
}).then(data=>{
    console.log('2:'+data)
    return new Promise((resolve,reject)=>{throw new Error('test')})
},err=>{
    console.log('err2:'+err)
}).then().catch(err=>{
    console.log('err3xx:'+err)
}).then(data=>{
    console.log('5:'+data)
},err=>{
    console.log('err5:'+err)
})