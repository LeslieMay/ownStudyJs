// 素数是（不包括1）只能被自己1整除的数字，比如2、3、5、7、11、13……都是素数，写一个函数is_prime验证一个数字是否是素数。

// is_prime(1) // false
// is_prime(100) // false
// is_prime(13) // true
// is_prime(179426549) // true
// is_prime(22801763489) // true

const is_prime = (num) => {
    if(num === 1) return false //过滤1
    if(num === 2) return true //过滤2
    if(num % 2 === 0) return false //过滤偶数
    for(let i = 2;i<Math.sqrt(num);i++){
        if(num%i===0) return false 
    }
    return true
}

console.log(is_prime(1))
console.log(is_prime(100))
console.log(is_prime(13))
console.log(is_prime(179426549))
console.log(is_prime(22801763489))
console.log(is_prime(2280176348917))