// 写一个二分查找函数bsearch，和之前学习的二分查找函数有一定的变化。

// function bsearch(A, x) {
//   /// TODO
// }

// A是一个已排序的数组，x是目标值。

// 如果找到目标值，返回目标值在数组中的序号。
// 如果没有找到目标值，返回目标值应该被插入的位置
// 比如数组: A=3,5,7,13,22,25

// bsearch(A,5) // 1
// bsearch(A,13) // 3
// bsearch(A,4) // 1
// bsearch(-1) // 0
// bsearch(-10000) // 0
// bsearch(30) // 6

const bsearch = (arr , target) => {
    let l = 0,
        r = arr.length - 1,
        guess;
    if( target < arr[0]) return 0
    if( target > arr[r]) return r + 1
    while(l <= r){
        guess = Math.floor( (l + r) / 2 );
        if(arr[guess] === target) return guess
        else if(arr[guess] > target) r = guess -1
        else l = guess + 1;
    }
    return l
}
const A = [3,5,7,13,22,25]
console.log(bsearch(A,5)) // 1
console.log(bsearch(A,13)) // 3
console.log(bsearch(A,4)) // 1
console.log(bsearch(A,-1)) // 0
console.log(bsearch(A,-10000)) // 0
console.log(bsearch(A,30)) // 6