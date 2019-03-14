
function _classCallCheck(instance,constructor){
    if(!(instance instanceof constructor)){
        // 说明不是通过new 调用
        throw new TypeError("不是new 调用")
    }
}
/**
 * 
 * @param {*} constructor 类 
 * @param {*} prototypePro 原型方法
 * @param {*} staticPro 类上的方法
 */
function _createClass(constructor,prototypePro,staticPro){
    if(prototypePro){
        definePro(constructor.prototype,prototypePro)
    }
    if(staticPro){
        definePro(constructor,staticPro)
    }
}
function definePro(obj,pro){
    for(let i = 0 ; i < pro.length;i++){
        Object.defineProperty(obj,pro[i].key,{
            value:pro[i].value
        })
    }
}
var Animal = function(){
    function Animal(type){
        _classCallCheck(this,Animal)
        this.type = type;
    }
    _createClass(Animal,[{key:'eat',value:function(){console.log('eat')}}],[{key:'flag',value:function(){console.log('flag')}}]);
    return Animal
}()
var a = new Animal();
console.log(a)
console.log(a.eat())
console.log(Animal.flag())


//子类继承
function inherits(child,parent){
    child.prototype = Object.create(parent.prototype,{constructor:{
        value:child
    }}) // 继承原型上的方法
    Object.setPrototypeOf(child,parent) // 继承静态方法
}
var Dog = function(Animal){
    // 原型继承
    inherits(Dog,Animal)
    function Dog(type){
        _classCallCheck(this,Dog);
        Animal.call(this,type); // 实例继承
    }
    return Dog
}(Animal)

var cat = new Dog('123');
console.log(cat)
console.log(cat.type)
console.log(cat.eat())
console.log(Dog.flag())