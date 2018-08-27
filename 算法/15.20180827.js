//写一个函数flat展平一个数组

//flat([1,[2,'a',[5,6]],8]) // [1,2,'a',5,6,8]


const flat = (arr)=>{
    let tmp = [];
    arr.map(one=>{
        if(one instanceof Array){
            tmp = tmp.concat(flat(one))
        }else{
            tmp.push(one)
        }
    })
    return tmp
}
console.log(flat([1,[2,'a',[5,6]],8]))