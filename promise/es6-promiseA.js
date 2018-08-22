const resolvePromise = (promise2,x,resolve,reject) => {
    if(promise2 === x) return reject(new TypeError("循环引用"));

    let called;

    if(x !== null && ( typeof x === 'object' || typeof x === 'function' )){
        try {
            let then = x.then;
            if(typeof then === 'function'){
                then.call(x,y=>{
                    if(called) return;
                    called = true;
                    resolvePromise(promise2,y,resolve,reject)
                },err=>{
                    if(called) return;
                    called = true;
                    reject(err)
                })
            }else{
                resolve(x);
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

class Promise {
    constructor(exector){
        this.status = 'pending'; // pending resolved rejected
        this.value = undefined;
        this.reason = undefined;
        this.resolveCallbacks = [];
        this.rejectCallbacks = [];
        const resolve = (value) => {
            if(this.status === 'pending'){
                this.value = value;
                this.status = 'resolved';
                this.resolveCallbacks.forEach(fn=>{
                    fn()
                })
            }
        }
        const reject = (reason) => {
            if(this.status === 'pending'){
                this.status = 'rejected';
                this.reason = reason;
                this.rejectCallbacks.forEach(fn=>{
                    fn();
                })
            }
        }
        try {
            exector(resolve,reject);
        } catch (error) {
            reject(error);
        }
    }
    then(onFulfilled,onRejected){
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value=>value;
        onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err};
        let self = this;
        let promise2;
        promise2 = new Promise((resolve,reject)=>{
            if(self.status === 'resolved'){
                setTimeout(()=>{
                    try {
                        let x = onFulfilled(self.value);
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                },0)
            }
    
            if(self.status === 'rejected'){
                setTimeout(()=>{
                    try {
                        let x = onRejected(self.reason);
                        resolvePromise(promise2,x,resolve,reject)
                    } catch (error) {
                        reject(error)
                    }
                },0)
            }
    
            if(self.status === 'pending'){
                self.resolveCallbacks.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onFulfilled(self.value);
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (error) {
                            reject(error)
                        }
                    },0)
                })
                self.rejectCallbacks.push(()=>{
                    setTimeout(()=>{
                        try {
                            let x = onRejected(self.reason);
                            resolvePromise(promise2,x,resolve,reject)
                        } catch (error) {
                            reject(error)
                        }
                    },0)
                })
            }
        })
        return promise2;
    };
    static resolve(value){
        return new Promise((resolve,reject)=>{
            resolve(value)
        })
    };
    static reject(reason){
        return new Promise((resolve,reject)=>{
            reject(reason)
        })
    }
    catch(onRejected){
        return this.then(null,onRejected)
    }
    static all(promises){
        return new Promise((resolve,reject)=>{
            let results = [];
            let index = 0;
            const pushData = (value,i)=>{
                results[i] = value;
                if(++index >= promises.length){
                    resolve(results)
                }
            }
            for(let i = 0 ; i < promises.length ; i++){
                promises[i].then(value=>{
                    pushData(value,i)
                },reject)
            }
        })
    }
    static race(promises){
        return new Promise((resolve,reject)=>{
            for(let i = 0 ; i < promises.length ; i++){
                promises[i].then(resolve,reject)
            }
        })
    }
    static defer(){
        let dfd = {};
        dfd.promise = new Promise((resolve,reject)=>{
            dfd.resolve = resolve;
            dfd.reject = reject;
        })
        return dfd;
    }
    static deferred(){
        let dfd = {};
        dfd.promise = new Promise((resolve,reject)=>{
            dfd.resolve = resolve;
            dfd.reject = reject;
        })
        return dfd;
    }
}

module.exports = Promise;