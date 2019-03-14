import { SSL_OP_CIPHER_SERVER_PREFERENCE } from "constants";
import { inspect, format } from "util";
import { stat } from "fs";
import { randomBytes } from "crypto";

// 写一个函数maxk(A, k)找到一个数组中最大的k个数字。 如：

// maxk([3,5,8,2,1,6],2) // 8, 6 或者 6,8 （结果不要求顺序)
// maxk([3,5,8,2,1,6],3) // 8,6,5

// 直接排序取前k大的值是O(nlgn)
// 可以考虑利用快速排序中的某一个步骤


function myNew(fn){
    var obj = new Object();
    var constructor = [].shift.apply(arguments)
    obj.__proto__ = constructor.prototype;
    var result = constructor.apply(obj,arguments)
    return typeof result == 'object' ? result : obj;
}
function Person(name){
    this.person = name
}

var p = myNew(Person,'leslie')
console.log(p)


Function.prototype.myCall = function(context){
    var context = context || window;
    context.fn = this;
    var args = [].slice.call(arguments,1)
    var result = context.fn(...args);
    delete context.fn
    return result
}

Function.prototype.myApply = function(context){
    var context = context || window;
    context.fn = this;
    var result;
    if(arguments[1]){
        result = context.fn(...arguments[1])
    }else{
        result = context.fn()
    }
    delete context.fn
    return result
}

Function.prototype.myBind =function(context){
    if(typeof this !== 'function') return new Error('error')
    var _this = this;
    var context = context || window;
    var args = [...arguments].slice(1);
    return function F(){
        if(this instanceof F){
            return new _this(...args,...arguments)
        }else{
            return _this.apply(context,args.concat(arguments))
        }
    }
}

function myInstanceOf(left,right){
    let left = left.__proto__
    while(left){
        if(left === right.prototype){
            return true
        }else{
            left = left.__proto__
        }
    }
    return false

}

function deepClone(obj){
    if(typeof obj !== 'object') return obj
    if(obj == null) return obj
    if(obj instanceof Date) return new Date(obj)
    if(obj instanceof RegExp) return new RegExp(obj);
    let result = null;
    if(Object.prototype.toString.call(obj) === '[object Array]'){
        result = []
    }
    if(Object.prototype.toString.call(obj) === '[object Object]'){
        result = new obj.constructor()
    }
    for(let i in obj){
        if(typeof obj[i] == 'object'){
            result[i] = deepClone(obj[i])
        }else{
            result[i] = obj[i]
        }
    }
    return result
}
console.log(typeof null)


function jsonp({url,params,cb}){
    return new Promise((resolve,reject)=>{
        var script = document.createElement('script');
        window[cb] = function(data){
            resolve(data)
            document.body.removeChild(script)
        }
        params = {...params,cb}
        let arr = []
        for(let i in params){
            arr.push(`${i}=${params[i]}`)
        }
        script.src = `${url}?${arr.join('&')}`;
        document.body.appendChild(script)
    })
}


function ajax(params){
    let params = params || {};
    params.data = params.data || {}
    params.type = (params.type || 'GET' ).toUpperCase();
    params.data = formatData(params.data);
    let xhr = null;
    if(window.XMLHttpRequest){
        xhr = new XMLHttpRequest()
    }else{
        xhr = nex ActiveXObject('Microsoft.XMLHTTP')
    }
    xhr.onreadystatechange = function(){
        if(xhr.readystate == 4 ){
            let status = xhr.status;
            if(status >=200 & status < 300){
                var resp = '';
                var type = xhr.getResponseHeader('Content-type');
                if(type.indexOf('xml') !== -1 && xhr.responseXML){
                    response = xhr.responseXML;
                }else if(type === 'application/json'){
                    response = JSON.parse(xhr.responseText)
                }else{
                    response = xhr.responseText
                }
                params.success && params.success(response)
            }else{
                params.error && params.error(status)
            }
        }
    }

    if(params.type === 'GET'){
        xhr.open(params.type,params.url+'?'+params.data,true)
        xhr.send(null); 
    }else{
        xhr.open(params.type,params.url,true)
        xhr.setHeader('Content-Type','application/x-www-form-urlencode;charset=UTF-8')
        xhr.send(params.data)
    }
    function formatData(data){
        let arr = []
        for(let i in data){
            arr.push(`${encodeURIComponent(i)}=${encodeURIComponent(data[i])}`)
        }
        arr.push(`v=${random()}`)
        return arr.join('&')
    }
    function random(){
        return Math.floor(Math.random() * 10000 + 500); 
    }
}

function debounce(func,wait = 50,immediate = true){
    let timer,args,context;
    var later = () => setTimeout(()=>{
        timer = null
        if(!immediate){
            func.apply(context,args)
            context = args = null;
        }
    },wait)
    return function(...params){
        if(!timer){
            timer = later();
            if(immediate){
                func.apply(this,params)
            }else{
                context = this;
                args = params
            }
        }else{
            clearTimeout(timer)
            timer = later()
        }
        
    }
}


function throttle(func,wait = 50,options){
    var context,args,result;
    var timer = null;
    var previous = 0;
    var later = () => {
        previous = options.leading===false?0 : (new Date()).getTime();
        result = func.apply(context,args)
        context = args = null;
        timer = null;
    }
    return function(){
        var now = (new Date()).getTime();
        if(!previous && options.leading === false){
            previous = now;
        }
        context = this;
        args = arguments;
        var remain = wait - (now-previous);
        if(remain < 0 || remain > wait){
            if(!timer){
                clearTimeout(timer)
                timer = null
            }
            result = func.apply(context,args)
            previous = now;
            context = args = null;
        }else if(!timer && options.trailing !== false){
            timer= setTimeout(later,remain)
        }
        return result
    }
}

function bsearch(A,x){
    let l = 0,r = A.length - 1,g;
    while(l<=r){
        g = Math.floor((l+r)/2);
        if(A[g] === x){
            return g
        }else if(A[g]>x){
            r = g -1;
        }else{
            l = g +1'
        }
    }
    return -1
}


function insert_order(A){
    for(let i = 1 ;i<A.length;i++){
        let p = i -1;
        let x = A[p+1];
        while(i>=0 && A[p]>x){
            A[p+1] = A[p]
            p--
        }
        A[p+1] = x
    }
}

function bubble_sort(A){
    for(let i = A.length-1;i>=1;i--){
        for(let j = 1;j<=i;j++){
            A[j-1]>A[j] && swap[A,j,j-1]
        }
    }
}

function merge(A,p,q,r){
    let A1 = A.slice(p,q);
    let A2 = A.slice(q,r);
    A1.push(Number.MAX_SAFE_INTEGER);
    A2.push(Number.MAX_SAFE_INTEGER);
    for(let k=p,i=0,j=0;k<r;k++){
        A[k] = A1[i]>A2[j]?A2[j++]:A1[i++]
    }
}
function merge_sort(A,p,r){
    if(r-p<2)return
    let q = Math.ceil((p+r)/2);
    merge_sort(A,p,q);
    merge_sort(A,q,r);
    merge(A,p,q,r)
}

function partipation(A,lo,hi){
    const pivot = A[hi-1];
    let i = lo,j = hi-1;
    while(i!==j){
        A[i]>pivot?swap(a,i,j--):i++
    }
    swap(A,j,hi-1)
    return j
}
function qsort(A,lo = 0,hi = A.length){
    if(hi - lo <= 1) return
    let  p = partipation(A,lo,hi);
    qsort(A,lo,p)
    qsort(A,p+1,hi)
}


function counting_sort(A){
    let max = Math.max(...A);
    const B = Array.from(max+1).fill(0);
    const C = Array.from(A.length);
    A.forEach((_,i)=>{
        B[A[i]]++
    })
    for(let i = 1;i<B.length;i++){
        B[i]  = B[i]+B[i-1]
    }
    for (let i = 0; i < A.length;i++);{
        const p = B[A[i]]-1;
        B[A[i]]--
        C[p] = A[i]
    }
    return C
}


function radix_sort(A){
    const max = Math.max(...A);
    const buckets = Array.from({length:10},()=>[]);
    let m = 1;
    while(m<max){
        A.forEach(num=>{
            const p = ~~((num % (m*10))/m)
            buckets[p].push(num)
        })
        let j = 0;
        buckets.forEach(arr=>{
            while(arr.length!=0){
                A[j++] = arr.shift();
            }
        })
        m*=10
    }
}

function insert_sort(A){
    for (let index = 1; index < A.length; index++) {
        let p = index - 1;
        let x = A[p+1];
        while(p>=0 && A[p]>x){
            A[p+1] = A[p]
            p--
        }
        A[p+1]=x 
    }
}
function buckets_sort(A,k,s){
    let buckets = Array.from({length:k},()=>[]);
    for(let i = 0;i<A.length;i++){
        const p = ~~(A[i]/s)
        buckets[p].push(A[i])
    }
    buckets.forEach(num=>{
        if(num.length!=0) insert_sort(num)
    })
    return [].concat(...buckets)
}