// 有同学去普华永道，面试官给了这样一道面试题：写一个函数traverse(A)螺旋状遍历一个二维数组。 比如

// // 遍历3*3
// traverse([1,2,3,4,5,6,7,8,9], 3) // [1,2,3,6,9,8,7,4,5])

// // 遍历4*4
// traverse([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], 4)
// // [1,2,3,4,8,12,16,15,14,13,9,5,6,7,11,10]

const traverse = (arr,num)=>{
    let direction = 0;
    let tmp = [];
    let index = 0;
    while(tmp.length < arr.length){
        let count,param;
        for(let i = 0 ; i < num ; i ++){
            if(direction%4 == 0){
                param = 1
            }else if(direction%4 == 1){
                param = num
            }else if(direction%4 == 2){
                param = -1
            }else if(direction%4 == 3){
                param = -num
            }
            if(!tmp.includes(arr[index+param*i]) && arr[index+param*i] !== undefined){
                count = index+param*i;
                tmp.push(arr[index+param*i])
            }
        }
        index = count;
        direction++
    }
    return tmp
}

console.log(traverse([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16], 4))