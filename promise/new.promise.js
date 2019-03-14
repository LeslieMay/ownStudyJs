import { promises } from "fs";

function Promise(excutor){
    let self = this;
    self.value = '';
    self.status = 'pending';
    self.reason = '';
    self.handleResolve = [];
    self.handleReject = [];
    function resolve(data){
        if(self.status === 'pending'){
            self.status = 'resolved'
            self.value = data;
            self.handleResolve.forEach(fun=>{
                fun()
            })
        }
    }
    function reject(reason){
        if(self.status === 'rejected'){
            self.status = 'rejected'
            self.reason = reason;
            self.handleReject.forEach(fun=>{
                fun()
            })
        }
    }
    try {
        excutor(resolve,reject)
    } catch (error) {
        reject(error)
    }
}
function resolvePromise(promise2 ,x ,resolve , reject){
    if(promise2 === x) return new TypeError('循环引用')
    let called;
    if(x!==null && (typeof x === 'object' && typeof x === 'function')){
        try {
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x,y=>{
                    if(called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                },err=>{
                    if(called) return
                    called = true
                    reject(err)
                })
            }else{
                resolve(x)
            }
        } catch (error) {
            if(called) return
            called = true
            reject(error)
        }
    }else{
        resolve(x)
    }
}
Promise.prototype.then = function(resolveFun,rejectFun){
    let that = this;
    resolveFun = typeof resolveFun == 'function' ? resolveFun : val=>val;
    rejectFun = typeof rejectFun == 'function' ? rejectFun : err=>{throw err}
    let promise2 = new Promise((resolve,reject)=>{
        if(that.status === 'resolved'){
            setTimeout(function(){
                try {
                    let x = resolveFun(that.data);
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            },0)
        }
        if(that.status === 'rejected'){
            setTimeout(function(){
                try {
                    let x = rejectFun(that.reason)
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            },0)
        }
        if(that.status === 'pending'){
            that.handleResolve.push(()=>{
                setTimeout(function(){
                    try {
                        let x = resolveFun(that.data)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                },0)
            })
            that.handleReject.push(()=>{
                setTimeout(function(){
                    try {
                        let x = rejectFun(that.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                },0)
            })
        }
    })
    return promise2
}

Promise.resolve = value => {
    return new Promise((resolve,reject)=>{
        resolve(value)
    })
}
Promise.reject = reason => {
    return new Promise((resolve,reject)=>{
        reject(reason)
    })
}
Promise.prototype.catch = function(cb){
    return this.then(null,cb)
}
Promise.prototype.all = function(Promises){
    return new Promise((resolve,reject)=>{
        let results = [];
        let index = 0;
        function set(data,i){
            results[i] = data;
            if(++i == promises.length){
                resolve(results)
            }
        }
        promises.forEach((one,i)=>{
            one.then(data=>{
                set(data,i)
            },reject)
        })
    })
}
Promise.prototype.race = function(promises){
    return new Promise((resolve,reject)=>{
        promises.forEach(one=>{
            one.then(resolve,reject)
        })
    })
}
Promise.dfd = Promise.deffered = function(){
    let dfd = {}
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}