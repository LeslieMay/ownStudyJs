//accum("abcd");    // "A-Bb-Ccc-Dddd"
//accum("RqaEzty"); // "R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy"
//accum("cwAt");    // "C-Ww-Aaa-Tttt"

/**
 * 处理字符串
 * @description 将字符串输出按照他的字符*位数
 * @example abc -> A-Bb-Ccc
 * @param {string} str 
 */
function accum(str) {
    // 检查类型
    if(typeof str !== 'string') return new TypeError('类型错误，请输入字符串');
    // 检查是否只有字母
    if(/[^a-z]/ig.test(str)) return new Error('字符串中只能含有字母')

    let strArr = str.toLowerCase().split('').map((one,index)=>{
        let transformStr = one.toUpperCase()+one.toLowerCase().repeat(index);
        return transformStr
    });
    return strArr.join('-')
}

// test 
console.log(accum())
console.log(accum(1))
console.log(accum(""))
console.log(accum("abcd123"))



console.log(accum("abcd"))
console.log(accum("RqaEzty"))
console.log(accum("cwAt"))