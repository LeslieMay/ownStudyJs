// 学习「计数排序」一节，写一个函数sort，将计数排序改写成一个可以用来排序字符串算法，忽略大小写。
const sort = (str)=>{
    const len = str.length,
    strArr = [...str].map(one=>one.charCodeAt(0)),
    max = Math.max(...strArr),
    min = Math.min(...strArr),
    count = [],
    result = [];

    for( let i = 0 ; i < len ; i ++ ){
        count[strArr[i]] = count[strArr[i]]?count[strArr[i]]+1:1
    }
    for( let i = min ; i < max ; i++){
        count[i+1] = (count[i+1] || 0) + (count[i] || 0)
    }
    for( let i = 0 ; i < len ; i ++ ){
        result[count[strArr[i]]--] = str[i];
    }
    console.log(result.join(''))
    return result.join('')
}

sort('javascript') // aacijprstv
sort('dbca') // abcd