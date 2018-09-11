// 写一个函数sort按照元素出现的频率排序一个数组。如果数字出现频率一样，那么从小到大排序。

// 例如：

// sort([1,2,3,1,1,0,5,5,5,5,7]) // [5,5,5,5,1,1,1,0,2,3,7]\

const sort = (arr) => {
    let map = {};
    arr.forEach(element => {
        if(map[element]){
            map[element]++
        }else{
            map[element] = 1;
        }
    });
    return arr.sort((a,b)=>{
        if((map[a]-map[b])==0){
            return a-b
        }else{
            return (map[b]-map[a])
        }
    })
}
console.log(sort([1,2,3,1,1,0,5,5,5,5,7]))