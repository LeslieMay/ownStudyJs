// 写一个函数find_missing(A, low, high)，给定一个范围[low,high]，寻找一个数组中缺失的元素。

// find_missing([10, 12, 11, 15], 10, 15) // [13,14]
// // 注: low=10 high = 15

// find_missing([1, 14, 11, 51, 15],50, 55) // [50, 52, 53, 54]
// // 注：low = 50, hight = 55

const find_missing = (arr,low,high) => {
    let result = [];
    for(let i = low ; i < high ; i++){
        if(!arr.find(one=>one==i)){
            result.push(i)
        }
    }
    console.log(result)
    return result
}
const find_missing = (arr,low,high) => {
    let tmp = Array.from({length:high-low}).map((one,index)=>{return (index+low)});
    let result = [];
    arr.map(one=>{
        if(one >= low && one < high && !result.includes(one)){
            result.push(one)
        }
    })
    return tmp.filter(one=>!result.includes(one))
}
let a = find_missing([1, 14, 11, 51, 15],50, 55)
console.log(a)