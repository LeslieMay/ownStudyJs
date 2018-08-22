/**
 * 实现数组的一些方法 比如reduce forEach includes map filter some every  find findIndex
 */


let array = [1,2,3,4,5];

array.reduce((prev,current,currentIndex,array)=>{
    console.log(prev,current,currentIndex,array);
    return prev + current
},0)

/**
 * 数组reduce 实现
 */
let array = [1,2,3,4,5];//{age:8},{age:9},{age:2},{age:3}
Array.prototype.myReduce = function(callback,initial){
    for(let i = 0 ; i < this.length ; i ++) {
        if(typeof initial === 'undefined') {
            initial = callback(this[i],this[i+1],i+1,this)
            ++i
        }else{
            initial = callback(initial,this[i],i,this)
        }
    }
    return initial;
}
array.myReduce((prev,current,currentIndex,array)=>{
    console.log(prev,current,currentIndex,array);
    return prev + current
},0)

/**
 * 数组的forEach实现
 */
let array = [1,2,3,4,5];
array.forEach(function(value,index,array){
    console.log(value,index,array)
})
Array.prototype.myForEach = function(callback){
    for(let i = 0 ; i < this.length ; i ++){
        callback(this[i],i,this)
    }

}
array.myForEach(function(value,index,array){
    console.log(value,index,array)
})

/**
 * 数组的includes实现
 */
let a = {}
let array = [a,2,3];
Array.prototype.myIncludes = function (value,index){
    for(let i = (index || 0) ; i < this.length ; i ++){
        if(this[i] === value) {
            return true
        }
    }
    return false
}
console.log(array.myIncludes(a,1))

/**
 * 数组的map 实现
 */
let array = [1,2,3];
// console.log(array.map(function(value,index,array){console.log(value,index,array)}))
Array.prototype.myMap = function(callback){
    let result = [];
    for(let i = 0 ; i < this.length ; i ++) {
        result.push(callback(this[i],i,this))
    }
    return result
}
console.log(array.myMap(function(value,index,array){console.log(value,index,array)}))


/**
 * 数组的filter实现
 */
let array = [1,2,3];
let array2 = ['a','b']
Array.prototype.myFilter = function(callback){
    let result = [];
    for(let i = 0 ; i < this.length ; i ++) {
        if(callback(this[i],i,this)){
            result.push(this[i])
        }
    }
    return result
}
console.log(array.myFilter(function(value,index,array){console.log(value,index,array);return index==0}))


/**
 * 数组的some 实现 判断数组中是否有满足条件的值
 */
let array = [1,2,3]
Array.prototype.mySome = function(callback){
    for(let i = 0 ; i < this.length ; i ++) {
        if(callback(this[i],i,this)){
            return true
        }
    }
    return false
}
console.log(array.mySome(function(value,index,array){console.log(value,index,array);return value == 2}))


/**
 * every 实现 判断数组中所有的值都满足条件才返回true
 */
let array = [1,2,3]
Array.prototype.myEvery = function(callback){
    for(let i = 0 ; i < this.length ; i ++) {
        if(!callback(this[i],i,this)){
            return false
        }
    }
    return true
}
console.log(array.myEvery(function(value,index,array){console.log(value,index,array);return value < 2}))

/**
 * find实现 返回数组中满足条件的第一个值
 */
let array = [1,2,3]
Array.prototype.myFind = function(callback){
    for(let i = 0 ; i < this.length ; i ++) {
        if(callback(this[i],i,this)){
            return this[i]
        }
    }
}
console.log(array.myFind(function(value,index,array){console.log(value,index,array);return value < 2}))

/**
 * findIndex实现 返回数组中满足条件的第一个值的索引
 */
let array = [1,2,3]
Array.prototype.myFindIndex = function(callback){
    for(let i = 0 ; i < this.length ; i ++) {
        if(callback(this[i],i,this)){
            return i
        }
    }
    return -1
}
console.log(array.myFindIndex(function(value,index,array){console.log(value,index,array);return value == 2}))


let publishCenter = {
    subscribeArrays:{}, // 定义一个订阅者回调函数callback
    subscribe:function(key,callback){
        // 增加订阅者
        if(!this.subscribeArrays[key]){
            this.subscribeArrays[key] = [];
        }
        this.subscribeArrays[key].push(callback)
    },
    publish:function(){
        //发布 第一个参数是key
        let params = [...arguments];
        let key = params.shift();
        let callbacks = this.subscribeArrays[key];
        if(!callbacks || callbacks.length === 0){
            // 如果没人订阅 那么就返回
            return false
        }
        for( let i = 0 ; i < callbacks.length; i++ ){
            callbacks[i].apply( this, params );
        }
    }
};

// 订阅 一个wantWatermelon事件
publishCenter.subscribe('wantWatermelon',function(){console.log('恰西瓜咯~~')})

//触发wantWatermelon事件
publishCenter.publish('wantWatermelon')


- 函数的节流和防抖都是为了解决函数频繁调用影响页面性能的解决手段
触发scroll或者是resize事件的时候会十分频繁的去调用我们的函数，但是人眼所能感触到的变化远不及scroll和resize触发的那么频繁，为了能够减少函数调用，就会适应函数节流，实现方式有两种，一种是定时器，我们可以去设置一个定时器，在一定的延迟后执行，频繁调用的时候如果定时器存在那么就不做操作，在达到这个延迟后 再去清空定时器，一种是时间戳的方法，设置一个开始时间，当我们调用函数的时候比对时间差，如果满足了delay之后我们就执行函数，然后将开始时间重置，不满足就不执行，

函数的防抖主要是解决 键盘输入，去验证用户输入信息，如果不做限制那么用户每次输入都会进行验证从而错误提示就会十分频繁，用户的体验就会很差，实现主要也是通过闭包和定时器实现，设置一个定时器，当调用的时候发现定时器存在那么我们就重置定时器，直到操作结束后的满足一定的delay才执行函数

他们区别主要是，函数的节流是在规定时间内每次都执行，而防抖是在操作结束后只执行一次