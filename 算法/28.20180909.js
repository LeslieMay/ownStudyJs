// 某AI创业公司前端团队面试题，写一个函数sort，对一个只有字符的数组进行排序，比如说['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd']

// 要求：

// 大写在前，小写在后
// 大小写字母之间的顺序不能改变，比如AaBbCcDd排序后应该是ABCDabcd。
// 不能使用额外空间。
const sort = (arr) => {
    return arr.sort((a,b)=>{
        if((a === a.toUpperCase() && b === b.toUpperCase()) || (a !== a.toUpperCase() && b !== b.toUpperCase())){
            return a > b
        }else if(a !== a.toUpperCase()){
            return 1
        }else{
            return -1
        }
    })
}
console.log(sort(['A', 'a', 'B', 'b', 'C', 'c', 'D', 'd']))