// 在一个数组中大部分都是奇数(或偶数），只有1个可能是偶数（或奇数），写一个函数special找到这个不一样的值。

//     special( [2, 4, 0, 100, 4, 11, 2602, 36] ) // 11 唯一的奇数
    
//     special( [160, 3, 1719, 19, 11, 13, -21] ) // 160 唯一的偶数

const special = (arr)=>{
    let even = arr.filter(one=>one%2===0).length;
    return even===1?arr.find(one=>one%2===0):arr.find(one=>one%2!==0)
}
console.log(special( [2, 4, 0, 100, 4, 11, 2602, 36] ))
console.log(special( [160, 3, 1719, 19, 11, 13, -21] ))