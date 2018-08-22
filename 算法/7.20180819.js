//将数字的每一位求平方，然后组合成新的数字（注意：请返回一个数字）

// squareDigits(9119) // 811181

const squareDigits = (num)=>{
    if(typeof num !== 'number' || num<0) return new Error('参数错误')
    return num.toString().split('').map(one=>one*one).join('')
}
console.log(squareDigits(9119))