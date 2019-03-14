

function Promise(excutor){
    let self = this;
    self.status = 'pending'; // 初始pengding状态 fulfilled rejected
    self.value = undefined;
    self.reason = undefined;

    self.onfulfilledCallbacks = [];// 异步时收集的成功回调
    self.onrejectedCallbacks = [];// 异步时收集的失败回调

    function resolve(value){
        if(self.status === 'pending'){
            self.status = 'fulfilled';
            self.value = value;
            self.onfulfilledCallbacks.forEach(element => {
                element()
            });
        }
    }

    function reject(reason){
        if(self.status === 'pending'){
            self.status = 'rejected';
            self.reason = reason;
            self.onrejectedCallbacks.forEach(element => {
                element()
            })
        }
    }

    try {
        excutor(resolve,reject)
    } catch (error) {
        reject(error)
    }
 
}
function resolvePromise(promise2,x,resolve,reject){
    if(promise2 === x) return reject(new TypeError('循环引用'))
    let called;
    if(x !== null && (typeof x === 'object' || typeof x === 'function')){
        try {
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x,y=>{
                    if(called) return;
                    called = true;
                    resolvePromise(promise2,y,resolve,reject)
                },error => {
                    if(called) return;
                    called = true;
                    reject(error)
                })
            }else{
                resolve(x)
            }
        } catch (error) {
            if(called) return;
            called = true;
            reject(error)
        }
    }else{
        resolve(x)
    }
}
Promise.prototype.then = function(onfulfilled,onrejected){
    let self = this;
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : val => val;
    onrejected = typeof onrejected === 'function' ? onrejected : err=>{throw err};
    let promise2 = new Promise((resolve,reject)=>{
        if(self.status === 'fulfilled'){
            setTimeout(() => {
                try {
                    let x = onfulfilled(self.value);
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            }, 0);
        }
        if(self.status === 'rejected'){
            setTimeout(()=>{
                try {
                    let x = onrejected(self.reason)
                    resolvePromise(promise2,x,resolve,reject)
                } catch (error) {
                    reject(error)
                }
            },0)
        }
        if(self.status === 'pending'){
            self.onfulfilledCallbacks.push(()=>{
                setTimeout(()=>{
                    try {
                        let x = onfulfilled(self.value)
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                },0)
            })
            self.onrejectedCallbacks.push(()=>{
                setTimeout(()=>{
                    try {
                        let x = onrejected(self.reason)
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
        resolve(value);
    })
}

Promise.reject = reason => {
    return new Promise((resolve,reject)=>{
        reject(reason)
    })
}
Promise.prototype.catch = function(callback){
    return this.then(null,callback)
}
Promise.prototype.all = function(promises){
    return new Promise((resolve,reject)=>{
        let results = [];
        let i = 0;
        function processData(index,data){
            results[index]= data;
            if(++i == promises.length){
                resolve(results)
            }
        }
        promises.forEach((value,index)=>{
            value.then(data=>{
                processData(index,data)
            },reject)
        })
    })
}
Promise.prototype.race = function(promises){
    return new Promise((resolve,reject)=>{
        promises.forEach((value,index)=>{
            value.then(resolve,reject)
        })
    })
}
Promise.defer = Promise.deferred = function(){
    let dfd = {};
    dfd.promise = new Promise((resolve,reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    })
    return dfd
}
module.exports = Promise;