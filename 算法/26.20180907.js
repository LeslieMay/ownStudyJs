// 一个组已经几乎被排序好了，除了部分数字外。 写一个排序算法对他们进行排序。

// function sort(A) {

// }

const sort = (arr) => {
    for( let i = 1 ; i < arr.length ; i ++ ){
        let key = arr[i];
        let j = i-1;
        while(arr[j] > key){
            arr[j+1] = arr[j]
            j--
        }
        arr[j+1] = key
    }
    console.log(arr)
}
sort([1,2,3,4,8,3,5,6,7])