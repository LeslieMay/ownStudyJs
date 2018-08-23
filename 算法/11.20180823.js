// 写一个函数reverse反转一个数组A

// 要求：

// 不可以使用Array.reverse 请不要创建新数组

const reverse = (arr) => {
    let total = arr.length;
    let len = Math.floor(arr.length/2);
    for(let i = 0 ; i < len ; i ++ ){
        let tmp = arr[total - i -1];
        arr[total - i -1] = arr[i];
        arr[i] = tmp;
    }
    return arr
}

console.log(reverse([5,4,9,8,7,6,3,2,1,0]))