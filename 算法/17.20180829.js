// 柯里化函数curry是这样一个函数，它将一个接受多参数的函数，转换成为接收连续单参数的高阶函数（可以被连续调用）。

// 例如：

// function _add(a, b, c, d){
//   return a + b + c + d
// }

// const add = curry(add)

// console.log( add(1) ) // 函数
// console.log( add(1)(2) ) // 函数
// console.log( add(1)(2)(3) ) // 函数
// console.log ( add(1)(2)(3)(4) ) // 10
// 再比如:

// const pow = curry(Math.pow)

// pow(10)(2) // 100

const curry = (fn,params = [])=>{
    let len = fn.length;
    return function _fn(...args){
        args = [...params,...args]
        if(args.length < len){
            return curry(fn, args)
        }
        return fn(...args)
    }
}
function _add(a, b, c, d){
  return a + b + c + d
}
const add = curry(_add)
console.log(add(1))// 函数
console.log(add(1)(2))// 函数
console.log(add(1)(2)(3)) // 函数
console.log(add(1)(2)(3)(4))// 10

const pow = curry(Math.pow)
console.log(pow(10)(2))