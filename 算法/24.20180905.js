// Codewars上面的一道最短代码训练，要求代码长度不能超过120个字符，可以去https://www.codewars.com/kata/shortest-code-father-and-son提交。

// 给定一个字符串，例如'AabBc'，其中大小写如果不能配对，就删除这个字符。 比如AabBc中缺少c的大写，就删除c，返回AaBb

// 例如: sc("Aab") 返回 "Aa"

// sc("AabBc") 返回 "AabB"

// sc("AaaaAaab") 返回 "AaaaAaa"

// sc("aAAAaAAb") 返回 "aAAAaAA"

const sc = (s)=>{
    let t = s.split('');
    return t.filter(o=>t.includes(o.toUpperCase()) && t.includes(o.toLowerCase())).join('')
}
console.log(sc("Aab"))
console.log(sc("AabBc"))
console.log(sc("AaaaAaab"))
console.log(sc("aAAAaAAb"))