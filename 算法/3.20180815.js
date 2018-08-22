// 写一个函数判断字符串中x的数量和o的数量是否相等（忽略大小写）：

// XO("ooxx") => true
// XO("xooxx") => false
// XO("ooxXm") => true
// XO("zpzpzpp") => true // 没有x也没有o，所有相等，都为0
// XO("zzoo") => false

const XO = (str) => {
    let strArr = str.toLowerCase().split('');
    let o = strArr.filter(one=>one==='o').length;
    let x = strArr.filter(one=>one==='x').length;
    return o == x
}

console.log(XO("ooxx"))
console.log(XO("xooxx"))
console.log(XO("ooxXm"))
console.log(XO("zpzpzpp"))
console.log(XO("zzoo"))