/**
 * 深拷贝函数
 * @param  {Object} obj - 拷贝的对象
 * @description - 通过递归实现对象的深拷贝
 */
function deepClone (obj) {
    if(typeof obj !== 'object') return obj; // 如果是基本类型 那么直接返回
    if(obj == null) return obj; // 如果是undefined或者null直接返回
    if(obj instanceof Date) return new Date(obj); // 如果是date引用类型 则实例化一个新的date
    if(obj instanceof RegExp) return new RegExp(obj); // 如果是reg正则 则实例化一个新的正则
    let result = null;
    if(Object.prototype.toString.call(obj)==='[object Array]'){
        // 如果是数组则声明一个数组
        result = []
    }
    if(Object.prototype.toString.call(obj)==='[object Object]'){
        // 如果是对象则用对象的构造函数申明对象
        result = new obj.constructor()
    }
    for(let i in obj){
        if(typeof obj[i] !== 'object'){
            result[i] = obj[i]
        }else{
            result[i] = deepClone(obj[i])
        }
    }
    return result
}

var a = {
    name: 'qiu',
    birth: new Date(),
    pattern: /qiu/gim,
    hobbys: ['book', new Date(), /aaa/gim, 111]
};
function A() {
    this.a = a;
}
var c = new A();
var b = deepClone(c);
console.log(c.a === b.a);
console.log(c, b);

const toChineseNum = (num) => {
  // TODO
  const mapChar = ['一','二','三','四','五','六','七','八','九'];
  const mapUnit = ['','十','百','千','万'];
  if(isNaN(num)) return '';
  const arr = num.toString().split('');
  const {length} = arr;
  if(length==0)return mapChar[parseInt(arr[0])-1];
  let str = '';
  for(let i = 0 ; i < length ; i++){
    str =mapChar[parseInt(arr[i])-1]+mapUnit[i];
  }
  return str
}