// 定义数组的旋转操作rotate(A, amount)，让数尾部amount个元素移动到头部。

// 例如数组: A=[1,2,3,4,5,6,7]

// rotate(A, 1) // [7,1,2,3,4,5,6] rotate(A, 2) // [6,7,1,2,3,4,5] rotate(A, 3) // [5,6,7,1,2,3,4] // 以此类推

const rotate = (arr , num)=>{
    let front = arr.slice(0,arr.length-num);
    let after = arr.slice(arr.length-num);
    return [...after,...front];
}

const rotate = (arr , num)=>{
    return arr.map((one,index)=>arr[(arr.length-num+index)%arr.length])
}

console.log(rotate([1,2,3,4,5,6,7], 1))
console.log(rotate([1,2,3,4,5,6,7], 2))
console.log(rotate([1,2,3,4,5,6,7], 3))