/**
 * 实现一个求最大值最小值的函数
 * @param {string} str 
 * @example
 * highAndLow("1 2 3 4 5")
 * returns '5 1'
 * @returns {string} "最大值 最小值"
 */
const highAndLow = (str) => {
    // 类型检测
    if(typeof str !== 'string') return new TypeError("参数类型错误");
    let results = [];
    for(let value of str.split(' ')){
        let newOne = Number(value);
        if(isNaN(newOne)) return new TypeError('字符串中含有非数字项')
        results.push(value)
    }
    return `${Math.max.apply(Math,results)} ${Math.min.apply(Math,results)}`
}

// test
console.log(highAndLow())
console.log(highAndLow("x1 2 3 4 5"))
console.log(highAndLow("1 2 3 4 5"));
console.log(highAndLow("1 2 -3 4 5"));
console.log(highAndLow("1 9 3 4 -5"));