// 一个数组中有0,1,2三种数字，写一个针对这个数组的排序算法。

// 比如A=[0,1,2,0,1,1,2,1,1]排序完结果是[0,0,1,1,1,1,1,2,2]

// 要求：

// 尽可能节省内存空间
// 尽可能快
// 其他：

// 请按照下述步骤，最后给出自己算法在本地执行的时间：

// 生成1亿个0-2之间的随机数字
// 对他们进行排序
// 统计排序的时间（不包括生成数字的时间），以毫秒计算。
// 在作业最后标注一下自己的执行时间

function swap(arr ,i ,j){
    [arr[j],arr[i]] = [arr[i],arr[j]];
}
function sort(arr) {
    let zeroIndex = 0 ;
    let twoIndex = arr.length-1;
    let oneIndex = 0;
 while(oneIndex<=twoIndex){
     if(arr[oneIndex]===0){
        swap(arr,zeroIndex++,oneIndex++)
     }else if(arr[oneIndex] === 2){
         swap(arr,twoIndex--,oneIndex)
     }else{
         oneIndex++
     }
 }
 return arr
}
// const A = [0,1,2,0,1,1,2,1,1];

// console.log(sort(A))
let a = [];
for(let i = 0;i<100000000;i++){
    a.push(Math.floor(Math.random()*3))
}
console.time('a');
sort(a);
console.timeEnd('a')