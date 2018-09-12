// 封装一个函数sequence对一个无限序列求值。函数接收一个lambda表达式代表一个无限序列，然后提供两个操作take和takeWhile。

// 例如：

// sequence( n => n * n ).take(5) // [0, 1, 4, 9, 16]
// sequence( n => n * 4 ).takeWhile( n => n < 20 ) // [0, 4, 8, 12, 16]

const sequence = ( fn ) => {
    return {
        take: (k) => {
            return Array(k).fill(0).map((one,i)=>fn(i))
        },
        takeWhile: (condi) => {
            let i = 0;
            let result = [];
            while(condi(fn(i))){
                result.push(fn(i))
                i++
            }
            return result
        }
    }
} 

console.log(sequence( n => n * n ).take(5))// [0, 1, 4, 9, 16]
console.log(sequence( n => n * 4 ).takeWhile( n => n < 20 )) // [0, 4, 8, 12, 16]