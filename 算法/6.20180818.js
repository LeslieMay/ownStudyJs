// rowSumOddNumbers(1) // 1
// rowSumOddNumbers(2) // 3+5=8
// rowSumOddNumbers(3) // 7+9+11=27
// rowSumOddNumbers(42) // 74088

const rowSumOddNumbers = (n) => {
    // 第n行 有n个数 第一个数是 n*n-(n-1) 最后一个数是 n*n-(n-1)+2*(n-1)
    let sum = (n*n-(n-1)+n*n-(n-1)+2*(n-1))*n/2; // 结果n*n*n
    return sum
}
console.log(rowSumOddNumbers(1))
console.log(rowSumOddNumbers(2))
console.log(rowSumOddNumbers(3))
console.log(rowSumOddNumbers(42))