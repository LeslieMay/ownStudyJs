
let name = 'leslie';
let age = '22';
let str = 'hello world,this is ${name},my age is ${age}.';
/**
 * 实现模板字符串的功能 
 * @param  {string} str - 模板字符串传入参数
 * @returns - 返回转化后的字符串
 */
function testTemplates(str){
    let reg = /\$\{([^\}]+)\}/g; // 匹配正则
    let results = str.replace(reg,function(){
        return eval(arguments[1])
    })
    return results
}
console.log(testTemplates(str))


/**
 * 实现为模板字符串前后加上*
 * @description - 例如my age is ${age}. 转化为my age is *22*.
 */
function addOtherStrTemplates(){
    let [strArr,...restArgs] = arguments;
    console.log(strArr,restArgs)
    let str = '';
    for(let i in restArgs){
        str += strArr[i] + '*' + restArgs[i] + '*'
    }
    str += strArr[strArr.length - 1];
    console.log(str)
    return str
}
let name = 'leslie';
let age = '22';
addOtherStrTemplates`hello world,this is ${name},my age is ${age}.`