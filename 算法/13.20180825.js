//请实现一个递归版本的reverse函数，反转一个数组。

const reverse = (arr,index = 0)=>{
    let half = Math.floor(arr.length/2)-1;
    let len = arr.length;
    if(index>half) return arr
    let tmp = arr[index];
    arr[index] = arr[len-index-1];
    arr[len-index-1] = tmp;
    return reverse(arr,++index)
}

console.log(reverse([5,4,9,8,7,6,3,2,1,0]))