// 插入排序的子过程会向一个有序数组中插入一个元素，请 利用训练9中写的bsearch方法，对这个过程进行优化：

// 直接利用bsearch找到需要插入元素的位置，然后执行插入

// 然后回答问题:

// 请给出变化后的插入排序代码？ 请说明这种变化后，请支持新插入排序的算法复杂度？ 请说明这样是变快还是变慢了？
const insert = (arr,i,x)=>{
    let idx = bsearch(arr,i,x)
    let p = i-1;
    while(p >= idx){
        arr[p+1] = arr[p]
        p--
    }
    arr[p+1] = x
}
const insert_sort = (arr) => {
    for( let i = 1 ; i < arr.length ; i ++ ){
        insert(arr,i,arr[i])
    }
    return arr
}
const bsearch = (arr , right,target) => {
    let l = 0,
        r = right - 1,
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
console.log(insert_sort([3,5,22,25,7,13]))