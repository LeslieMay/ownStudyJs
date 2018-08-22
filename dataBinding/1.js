var obj = {
    name:'leslie',
    detail:{
        age:"1"
    }
}
Object.defineProperty(obj,'test',{
    get(){
        return value
    },
    set(newValue){
        console.log(newValue)
        value = newValue
    }
})
obj.test = '123'



let obj = {name:'leslie'};
let proxy = new Proxy(obj,{
    set(target,key,value){
        console.log('111')
        target[key] = value
    }
})
proxy.name = '123'