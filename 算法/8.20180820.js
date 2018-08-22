// 写一个函数solution，求比一个数字n小的所有3和5的整数倍数和。

// 比如10，比它小的3、5整数倍数有： 3,5,6,9， 所以和为23。 比如16， 比它小的3，5整数倍数有： 3,5,6,9,10,12,15，所以和为60（15只计算1次）

// 示例

// solution(10) // 23
// solution(16) // 60
// 注意，如果输入负数，返回0

const solution = (n)=>{
    if(typeof n !== 'number') return new TypeError('参数类型错误')
    if(n<0) return 0
    let max3 = (n-1)/3;
    let max5 = (n-1)/5;
    let arr3 = Array.from({ length: max3 }).map((one,index)=>(index+1)*3);
    let arr5 = Array.from({ length: max5 }).map((one,index)=>(index+1)*5);
    let arr = [...new Set([...arr3,...arr5])];
    return eval(arr.join('+'))
}
console.log(solution(10))
console.log(solution(16))