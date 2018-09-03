// 写一个函数bit_count返回一个数字中所有二进制位的和。 比如说1234的二进制表示是10011010010，总共有5个1，那么和是5。

const bit_count = (num)=>{
    let str = num.toString(2);
    let l = str.split('').filter(one=>one=='1').length;
    return l
}

console.log(bit_count(1234))