## 解释下事件代理

事件代理就是 如果dom节点有多个子节点需要注册同一个事件，那么可以将该事件注册到这些子节点的父节点上，然后通过event.target去区分子节点，而且事件代理有一个好处就是可以为动态添加的子节点去注册事件

## js中的this是如何工作的

this是函数中自带的参数

* this会指向函数的调用者，如果函数是自调用的话那么this就指向undefined，在非严格模式下指向undefined的this会默认指向window

* 在一个构造函数中，如果用new声明的实例，如果构造函数return的值不是一个对象，那么this会指向这个实例，如果return的是一个对象，那么this就是指向这个对象

* 如果使用了call/apply/bind，this会指向手动绑定的对象中

* 定时器（匿名函数）中的this指向undefined

* 箭头函数没有this，他的this会根据变量作用域查找规则找到最近一层的this

## 实现一个new

```javascript
    function myNew(){
        var obj = new Object();
        let constructor = [].shift.call(arguments);
        obj.__proto__ = constructor.prototype;
        let result = constructor.apply(obj,arguments);
        return typeof result === 'object'?result:obj;
    }
```

new实现了：
* 创建一个新的object
* 将该对象的__proto__指向构造函数的原型
* 将this绑定到这个对象中，并且执行构造函数
* 如果构造函数返回了 对象那么就返回构造函数的结果 不然就返回创建的object

## call/apply/bind
call 和 apply 都是为了解决改变 this 的指向。第一个参数传入null或者不传默认指向window，作用都是相同的，只是传参的方式不同。
除了第一个参数外，call 可以接收一个参数列表，apply 只接受一个参数数组。

```javascript
    Function.prototype.myCall = function(context){
        var context = context || window; // 获取this指向
        context.fn = this;// 获取调用者 比如 getValue.call(a,1,2,3) 这里 就是a.fn = getValue
        var args = [...arguments].slice(1);// 获取剩余参数
        var result = context.fn(...args);// 执行函数
        delete context.fn // 删除属性
        return result
    }
```

```javascript
    Function.prototype.myApply = function(context){
        var context = context || window; // 获取this指向
        context.fn = this;// 获取调用者 比如 getValue.call(a,1,2,3) 这里 就是a.fn = getValue
        var result
        if(arguments[1]){
            result = context.fn(...arguments[1]);// 执行函数
        }else{
            result = context.fn()
        }
        delete context.fn // 删除属性
        return result
    }
```

```javascript
    Function.prototype.myBind = function(context){
        if(typeof this !== 'function'){
            throw new TypeError('Error')
        }
        var _this = this;
        var args = [...arguments].slice(1);
        return function F(){
            if(this instanceof F){
                return new _this(...args,...arguments)
            }else{
                return _this.apply(context,args.concat(...arguments))
            }
        }
    }
```

## 实现一个instanceof

```javascript
    function instanceof(left,right){
        let prototype = right.prototype;
        left = left.__proto__;
        while(true){
            if(left === null){
                return false
            }else if(prototype === left){
                return true
            }else{
                left = left.__proto__
            }
        }
    }
```

## 实现一个深拷贝

```javascript
    function deepClone(obj){
        if(typeof obj !=== 'object') return obj
        if(obj == null) return obj // 如果是undefined或者是null就直接返回
        if(obj instanceof Date) return new Date(obj);
        if(obj instanceof RegExp) return new RegExp(obj);
        let result = null;
        if(Object.prototype.toString.call(obj) === '[object Array]'){
            result = []
        }
        if(Object.prototype.toString.call(obj) === '[object Object]'){
            result = new obj.constructor()
        }
        for(let i in obj){
            if(typeof obj[i] !== 'object'){
                result[i] = obj[i]
            }else{
                result[i] = deepClone(obj[i])
            }
        }
        return result;
    }
```

## 跨域
1. jsonp 只能发get请求 不安全 xss攻击
```javascript
    function jsonp({url,params,cb}){
        return new Promise((resolve,reject)=>{
            let script = document.createElement('script');
            window[cb] = function(data){
                resolve(data)
                document.body.removeChild(script);
            }
            params = {...params,cb};
            let arrs = [];
            for(let key in params){
                arrs.push(`${key}=${params[key]}`)
            }
            
            script.src = `${url}?${arrs.join('&')}`;
            document.body.appendChild(script);
        })
    }
```

2. cors
Access-Control-Allow-Origin 允许来源
Access-Control-Allow-Headers 允许请求头
Access-Control-Allow-Methods 允许请求方法
Access-Control-Allow-Credentials 允许请求携带cookie
Access-Control-Max-Age  预检请求的存活时间
Access-Control-Expose-Headers  告诉客户端 服务器发来的header是安全的

3. postmessage
a页面iframe内嵌了b页面
window.onmessage 监听消息
postmessage去发送消息

4. domain
同一个主域下之间不同子域可以将domain上升到主域 就可以通信
document.domain

5. websocket
```javascript
// 客户端
    let socket = new WebSocket('ws://localhost:3000');
    socket.onopen = function(){
        socket.send('123')
    }
    socket.onmessage = function(e){
        console.log(e.data)
    }
```
```javascript
// server
let app = express();
let WebSocket - require('ws');
let wss = new WebSocket.Server({port:3000});
wss.on('connection',function(ws){
    wx.on('message',function(data){
        console.log(data)
        wx.send('ahahah')
    }
})
```

6. nginx
用nginx设置代理

## 封装一个ajax

```javascript
function ajax(params) { 
    params = params || {}; 
    params.data = params.data || {}; 
     // 请求方式，默认是GET
     params.type = (params.type || 'GET').toUpperCase();
     // 避免有特殊字符，必须格式化传输数据
     params.data = formatParams(params.data); 
     var xhr = null;  
   
     // 实例化XMLHttpRequest对象 
     if(window.XMLHttpRequest) { 
      xhr = new XMLHttpRequest(); 
     } else { 
      // IE6及其以下版本 
      xhr = new ActiveXObjcet('Microsoft.XMLHTTP'); 
     };
   
   
     // 监听事件，只要 readyState 的值变化，就会调用 readystatechange 事件
     xhr.onreadystatechange = function() { 
      // readyState属性表示请求/响应过程的当前活动阶段，4为完成，已经接收到全部响应数据
      if(xhr.readyState == 4) { 
       var status = xhr.status; 
       // status：响应的HTTP状态码，以2开头的都是成功
       if(status >= 200 && status < 300) { 
        var response = '';
        // 判断接受数据的内容类型
        var type = xhr.getResponseHeader('Content-type'); 
        if(type.indexOf('xml') !== -1 && xhr.responseXML) { 
         response = xhr.responseXML; //Document对象响应 
        } else if(type === 'application/json') { 
         response = JSON.parse(xhr.responseText); //JSON响应 
        } else { 
         response = xhr.responseText; //字符串响应 
        }; 
        // 成功回调函数
        params.success && params.success(response); 
      } else { 
        params.error && params.error(status); 
      } 
      }; 
     }; 
     
     // 连接和传输数据 
     if(params.type == 'GET') {
      // 三个参数：请求方式、请求地址(get方式时，传输数据是加在地址后的)、是否异步请求(同步请求的情况极少)；
      xhr.open(params.type, params.url + '?' + params.data, true); 
      xhr.send(null); 
     } else { 
      xhr.open(params.type, params.url, true); 
      //必须，设置提交时的内容类型 
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      // 传输数据
      xhr.send(params.data); 
     } 
    
    //格式化参数 
    function formatParams(data) { 
     var arr = []; 
     for(var name in data) {
      // encodeURIComponent() ：用于对 URI 中的某一部分进行编码
      arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name])); 
     }; 
     // 添加一个随机数参数，防止缓存 
     arr.push('v=' + random()); 
     return arr.join('&'); 
    }
    // 获取随机数 
    function random() { 
     return Math.floor(Math.random() * 10000 + 500); 
    }
   
   }
```

## 节流防抖

1. 防抖动
```javascript
    function debounce (func,wait = 50,immediate = true){
        let timer,context,args;
        
        const later = () => setTimeout(() => {
            if(!immediate){
                func.apply(context,args)
                context = args = null
            }
        },wait)

        return function(...params){
            if(!timer){
                timer = later()
                if(!immediate){
                    func.apply(this,params)
                }else{
                    context = this;
                    args = params;
                }
            }else{
                clearTimeout(timer)
                timer = later()
            }
        }
    }
```
2. 节流
```javascript
    /**
    option有三种情况 
    1. 不传
        默认是有头有尾 也就是在执行节流函数是 第一次和最后一次都会执行
    2.{leading:false}
        忽略第一次，只执行最后一次
    3.{trailing:false}
        忽略最后一次，只执行第一次
    **/
    function throttle(func, wait, options){
        var context,args,result;

        var timeout = null;// 定时器

        var previous = 0;// 上一次时间戳

        if(options) options = {};//置空options

        // 延迟执行的回调函数
        var later = function(){
            previous = options.leading === false? 0 : (new Date()).getTime();

            timeout = null;

            result = func.apply(context,args);

            context = args = null;
        }

        return function(){
            var now = (new Date()).getTime();
            if(!previous && options.leading === false){
                // 第一次执行的时候 如果设置了leading为false 则令previous = now,即忽略第一次的函数执行 
                previous = now
            }
            context = this;
            args = arguments;
            var remain = wait - (now - previous);// 如果option没有设置那么第一次进来remain<0；如果设置了leading=== false ，那么remain==wait，如果设置了trailing==false，reamain<0

            if(remain < 0 || remain > wait){
                // 当不忽略第一次执行或者是执行的周期以及大于了wait或者是用户手动调整了客户端时间
                if(timeout){
                    clearTimeout(timeout)
                    timeout = null
                }
                previous = now;
                result = func.apply(context,args)
                if(!timeout){
                    text = args = null
                }
            }else if(!timeout && options.trailing !== false){
                timeout = setTimeout(later,remain)
            }
            return result
        }

    }

    
```
## 浏览器渲染
1. 处理HTML并且构建DOM树
2. 处理CSS并且构建CSSOM树
3. 将DOM和CSSOM合并成一个渲染树
4. 根据渲染树来进行布局并且计算每一个节点的位置
5. 调用GPU进行绘制，合成图片，显示在屏幕上

注意：构建CSSOM树的时候，会阻塞渲染，知道CSSOM树构建完成，当 HTML 解析到 script 标签时，会暂停构建 DOM，完成后才会从暂停的地方重新开始。也就是说，如果你想首屏渲染的越快，就越不应该在首屏就加载 JS 文件。并且 CSS 也会影响 JS 的执行，只有当解析完样式表才会执行 JS，所以也可以认为这种情况下，CSS 也会暂停构建 DOM。

## Load 和 DOMContentLoaded 区别
Load 事件触发代表页面中的 DOM，CSS，JS，图片已经全部加载完毕。

DOMContentLoaded 事件触发代表初始的 HTML 被完全加载和解析，不需要等待 CSS，JS，图片加载。

## 图层
一般来说，可以把普通文档流看成一个图层。特定的属性可以生成一个新的图层。不同的图层渲染互不影响，所以对于某些频繁需要渲染的建议单独生成一个新图层，提高性能。但也不能生成过多的图层，会引起反作用。

通过以下几个常用属性可以生成新图层

* 3D 变换：translate3d、translateZ
* will-change
* video、iframe 标签
* 通过动画实现的 opacity 动画转换
* position: fixed

## 重绘和回流
回流必定发生重绘，重绘不一定触发回流，回流所需要的成本比重绘高

* 重绘是节点需要改变外观但是不需要改变布局的时候，比如改变color
* 回流是布局或者是几个属性发生改变称作回流

### 如何减少重绘和回流
1. 用translate去替代top之类的位置变换

2. 使用visible提取带display：none

3. 先将Dom离线修改完后再显示

4. 不要频繁的去修改dom节点的属性值

6. 动画实现的速度，速度越快回流次数越多，可以选择使用requestAnimationFrame

7. 将频繁变换的动画变成图层

## 冒泡捕获
1. window往事件触发的地方进行传播，这个过程叫捕获阶段
2. 传播到目标节点的时候，这个过程叫目标阶段
3. 从事件触发处往 window 传播，这个过程叫冒泡阶段

## 注册事件
注册事件的时候使用addEventListener注册，第三个参数可以使布尔值，也可以是对象，如果是布尔值，默认是false，决定注册事件是捕获事件还是冒泡事件
* capture，布尔值，和 useCapture 作用一样
* once，布尔值，值为 true 表示该回调只会调用一次，调用后会移除监听
* passive，布尔值，表示永远不会调用 preventDefault

如果我们希望事件只触发在目标上，这时候可以使用stopPropagation来阻止事件的传播，不管是冒泡还是捕获，stopImmediatePropagation也可以阻止，并且还能阻止目标执行别的注册事件
## react 生命周期
老的生命周期：
1. initialization
建立props和state
2. mounting
componentWillMount
render
componentDidMount
3. updating
componentWillReceiveProps
shouldComponentUpdate
componentWillUpdate
render
componentDidUpdate
4. unmounting
componentWillUnmount

新的生命周期：因为componentWillMount componentWillReceiveProps componentWillUpdate，这几个生命周期都有可能发生多次调用所以在新版本中将不使用这些生命周期

1. 创建时
constructor
getDerivedStateFromProps 在组件创建时和更新时的render方法之前调用，它应该返回一个对象来更新状态，或者返回null来不更新任何内容。
render
componentDidMount
2. 更新时
getDerivedStateFromProps
shouldComponentUpdate
getSnapshotBeforeUpdate
render
 被调用于render之前，state已经更新，可以读取但无法使用DOM的时候。它使您的组件可以在可能更改之前从DOM捕获一些信息（例如滚动位置）。此生命周期返回的任何值都将作为参数传递给componentDidUpdate（）。
componentDidUpdate
3. 卸载时
componentWillUnMount
## react 虚拟dom
react 会通过creatElement方法去创建虚拟dom，通过createElement方法创建出来的对象有三个属性，type，props，children，type指明这个dom的标签类型，props是属性，children是它的子节点

react操作虚拟dom为什么快：
1. 浏览器执行js的速度很快
2. 直接操作dom很慢
3. react通过diff算法找到需要更新的dom，直接更新他们
## react 算法
react的diff算法是通过createElement创建出来的虚拟dom树结构，进行对比，通过先序深度优先算法进行对比，将对比的结果通过一个patch对象展示出来，这个patch对象里面存储着需要更新的dom和更新内容，有几种情况：
1. 如果对比新旧节点发现，没有新节点，那么将这个信息记录到{type:'REMOVE',index:...}
2. 如果新旧节点都有，进行对比节点的type，如果type不同，那么直接记录这个新节点的信息，存储到{type:'REPLACE',newNode:...}
3. 如果type相同，再进行对比节点的属性，如果属性不同，那么记录这个节点的位置和改变的属性，存储到{type:'ATTR',attrs:{...}}中
4. 如果属性也相同，接着比较他们的子节点，如果子节点只是文本对象不同，那么记录到{type:'TEXT',text:...}，如果子节点只是调换了位置，那么会根据子节点的key去区分，然后对子节点进行重新调换位置而不是卸载，重复上述过程

最后会得到一个patch对象，然后会根据这个对象记录的更改信息，去修改真实的dom

## 组件类型
函数型组件：没有this 没有生命周期 没有state
类组件 

## react state更新
 1. setState有异步情况也有同步情况
 2. setState有两种更新模式，一种是批量更新（异步），一种是直接更新（同步）
 3. setState是否进行批量更新会根据isBatchingUpdates这个标志决定，这个标志位true的时候setState在遇到频繁调用的时候会把更新的state进行合并并且放到队列中，先运行主进程代码，当主进程代码执行到更新的时候，再进行更新，主进程代码执行完毕之后，isBatchingUpdates这个标志置为了false，因此在遇到setTimeout，setInterval这些异步代码的时候会选择直接更新的方法
 4. 在react生命周期和合成事件执行前后都有相应的钩子，分别是pre钩子和post钩子，pre钩子会调用batchedUpdate方法将isBatchingUpdates变量置为true，开启批量更新，而post钩子会将isBatchingUpdates置为false

## 组建通信
可以通过父组件共用属性方法传递 
也可以通过Context api {Provider,Consumer}来实现 Provider value属性 Consumer 
```javascript
    <Provider value={{a:xxx}}></Provider>
    <Consumer>
        {(value)=><div></div>}
    </Consumer>

```

## react 高阶组件

高阶组件就是指一个接受组件为参数并且返回另一个组件的函数，概念和高阶函数类似；

高阶组件好处：
1. 代码复用：可以将相似组件的重复部分进行抽离，再通过高阶组件扩展
2. 条件渲染：可以根据条件控制组件的渲染逻辑，比如鉴权
3. 生命周期捕获和劫持：根据父子组件生命周期规则捕获子组件的生命周期，比如打点

```javascript
    // 1. 直接返回一个无状态组件
    function EnhanceWrapper(WrapperComponent){
        const newProps = {
            source: 'app'
        }
        return props => <WrappedComponent {...props} {...newProps}/>
    }

    // 2. 在新组件的render函数中返回一个新的class component 
    function EnhanceWrapper(WrapperComponent){
        return class WrapperComponent extends React.Component{
            render(){
                return <WrapperComponent {...this.props}/>
            }
        }
    }

    // 3. 继承原组件后返回一个新的class component
    function EnhanceWrapper(WrappedComponent){
        render class WrappedComponent extends WrapperComponent{
            render(){
                return super.render()
            }
        }
    }
```

```javascript
    // 鉴权auth 高阶组件
    function AuthWrapper(WrappedComponent){
        return class AuthComponent extends React.Component{
            constructor(props){
                super(props);
                this.state = {
                    promission:false
                }
            }
            componentWillMount(){
                // ajax 请求获取是否有权限
                ...
                this.setState({
                    promission:true
                })
            }
            render(){
                if(this.state.promission){
                    return <WrappedComponent {...this.props}/>
                }else{
                    return <LoginComponent/>
                }
            }
        }
    }
```

常见问题：
1. 如何获取Ref
常规通过this是无法获取到ref的，需要通过ref的回调函数，在子组件的回调函数内部将ref的值通过props传给高阶组件
2. static
高阶组件对子组件包装之后就会返回一个容器组件，容器组件不包括任何子组件内部的静态方法，这时需要通过对子组件的静态方法拷贝到容器组件里，再将其返回
3. 不能再组件的render方法中使用高阶组件
高阶组件每次都会返回一个新的组件，再render中使用会导致每次渲染出来的组件都不相等，每次render组件都会卸载再重新挂载

## webpack相关

## 组件相关

## 说一个自己的项目

## 判断一个字符串是不是回文
```javascript
    function isHui(str){
        return str === str.split('').reverse().join('')
    }
```
## HTTP1.1和HTTP1.0的区别
1. 缓存处理 
HTTP1.0中主要使用expires 和 if-modified-since作为缓存判断 
HTTP1.1中新增了etag和if-none-match作为缓存判断

2. Http1.0不支持断点续传 HTTP1.1支持并且新增了206返回码

3. HTTP1.1新增了24个错误响应码 比如410 表示服务器上某个资源被永久性删除

4. HTTP1.0 并没有传递主机名 但是HTTP1.1必须要传主机名 否则会返回400错误

5. HTTP1.1支持了长链接，减少了建立和关闭链接的消耗和延迟

## HTTP缓存策略
1. 强制缓存 服务端设置响应头Cache-Control:max-age=xxx，并且设置Expires响应头过期时间，客户端自行判断是否读取缓存
2. 协商缓存 通过状态码304告诉客户端该走缓存
  * 修改时间：通过文件的最后修改时间判断该不该读取缓存，服务端设置响应头Last-Modified,客户端把上次服务端响应头中的Last-modified值通过if-modified-since 传递给服务端 ， 服务端通过比较当前文件的修改时间和上次修改时间(上次传给客户端的值),如果相等那么说明文件修改时间没变也就是没变化
  * 文件内容：通过文件的内容来判断该不该读取缓存，服务端通过把文件内容读取出来，通过md5进行base64加密得出hash值，把这个值设置响应头Etag，客户端下一次请求通过if-none-match带过来，服务端再比对当前文件内容加密得出的hash值和上次是否一样，如果一样说明文件内容没有发生改变，这种方式是最准确的方式，但是也是最耗性能

## 算法相关 
排序算法 复杂度：
O(n^2):插入排序 冒泡排序 比较排序
O(nlgn):合并排序 快速排序 分块排序
O(n)O(nk):桶排序 基数排序
1. 二分查找法

```javascript
    /**
     * A 查找的数组 x 要查找的值
     * */
    function bsearch(A,x){
        let left = 0 , right = A.length-1,center;
        while(left <= right){
            center = Math.floor( (left + right) / 2 );
            if(A[center] == x){
                return center
            }else if(A[center]>x){
                right = center - 1
            }else if(A[center]<x){
                left = center + 1
            }
        }
        return -1
    }

```

2. 插入排序
最好情况 O(n)  最坏O(n^2)空间复杂度O(1)
```javascript
    // A 排序数组 i代表 数组前i项是有序数组 x是被插入数据
    function insert(A, i, x){
        let p = i - 1;
        while(p >= 0 && A[p] > x){
            A[p+1] = A[p]
            p--
        }
        A[p+1] = x
    }
    function insert_sort(A){
        for(let i = 1 ; i < A.length ; i++){
            insert(A, i , A[i])
        }
    }
```
 
```javascript
    // 二分查找的方法去优化插入排序 经过优化插入排序的复杂度仍然是O(n^2)，常数执行时间也几乎没有变化（其实省略了一次比较）但太微乎其微。因此，这个优化没有意义。
    function insert(A, i, x) {
        let idx = bsearch(A,i,x)
        let p = i - 1
        while(p >= idx) {
            A[p+1] = A[p]
            p--
        }
        A[p + 1] = x
    }
    function insertion_sort(A){
        for(let i = 1; i < A.length; i++) {
            insert(A, i, A[i])
        }
    }
    function bsearch(A, i, x){
        let l = 0,
            r = i-1,
            guess

        while(l<=r) {
            guess = Math.floor( (l + r) / 2 )
            if(A[guess] === x) return guess
            if(A[guess] > x) {
                if(guess === 0 || A[guess - 1] < x) {
                    return guess
                }
                r = guess - 1
            } else {
                if(guess === i-1 || A[guess + 1] > x) {
                    return guess + 1
                }
                l = guess + 1
            }
        }
    }
```
3. 冒泡排序
时间复杂度是O(n^2)空间复杂度O(1)
```javascript
    function swap(A,i,j){
        let [A[i],A[j]] = [A[j],A[i]]
    }
    function bubble_sort(A){
        for(let i = A.length - 1 ; i >= 1; i --){
            for(let j = 1 ; j <= i; j++){
                A[j-1] > A[j] && swap(A,j,j-1)
            }
        }
    }
```

4. 合并排序
时间复杂度 O(nlgn)空间复杂度O(n)
```javascript
    function merge(A,p,q,r){
        let A1 = A.slice(p,q);
        let A2 = A.slice(q,r);
        A1.push(Number.MAX_SAFE_INTEGER)
        A2.push(Number.MAX_SAFE_INTEGER)
        for(let index = p,i = 0,j = 0;index < r ; index++){
            A[index] = A1[i] > A2[j] ?A2[j++] : A1[i++]
        }
    }
    function merge_sort(A,p,r){
        if(r-p<2) return
        let q = Math.ceil((p+r)/2);
        merge_sort(A,p,q);
        merge_sort(A,q,r);
        merge(A,p,q,r)
    }
```

5. 快速排序
最好情况O(nlgn) 最好O(n^2) 空间复杂度O(logn)
```javascript
    function swap(A,i,j){
        [A[i],A[j]] = [A[j],A[i]]
    }
    function partipation(A,lo,hi){
        const pivot = A[hi - 1];
        let i = lo,j = hi -1;
        // 小于pivot区间 [lo,i)
        // 未确定的区间 [i,j)
        // 大于pivot的区间 [j,hi)
        while(i!==j){
            A[i] > pivot? swap(A,i,j--):i++
        }
        swap(A,j,hi-1)
        return j
    }
    function qsort(A,lo = 0, hi = A.length){
        if(hi - lo <= 1) return
        let p = partipation(A,lo,hi);
        qsort(A,lo,p)
        qsort(A,p+1,hi)
    }
```

6. 计数排序
时间复杂度O(n+k) 空间复杂度O(n+k)
```javascript
    function counting_sort(A){
        const max = Math.max(...A);
        // 累计数组
        const B = Array(max+1).fill(0);
        const C = Array(A.length)
        A.forEach((_,i)=>{
            B[A[i]]++
        })
        for(let i = 1 ; i<B.length; i++){
            B[i]+=B[i-1]
        }
        for(let i = 0;i<A.length;i++){
            const p = B[A[i]] - 1;
            B[A[i]]--
            C[p] = A[i]
        }
        return C
    }
```

7. 基数排序
时间复杂度O(nk) 空间复杂度O(n+k)
```javascript 
    function radix_sort(A){
        const max = Math.max(...A);//取到最大值
        const buckets = Array.from({length:10},()=>[]);// 生成10个空数组
        let m = 1;//基数
        while(m < max){
            A.forEach(num => {
                const p = ~~ ((num % (m*10)) / m);//
                buckets[p].push(num)
            })
            let j = 0;
            buckets.forEach(arr=>{
                while(arr.length!=0){
                    A[j++] = arr.shift()
                }
            })
            m *= 10;
        }
    }
```

8. 桶排序
时间复杂度最坏情况O(n^2) 最好情况O(n+k)  空间复杂度O(n+k)
```javascript
    function insert_sort(A){
        for(let i = 1;i<A.length;i++){
            let p = i - 1;
            let x = A[p+1];
            while(p>=0 && A[p]>x){
                A[p+1] = A[p]
                p--
            }
            A[p+1] = x
        }
    }
    // A 需要排序的数组 k桶的数量 s每个桶的大小
    function buckets_sort(A,k,s){
        const buckets = Array.from({length:k},()=>[]);
        for(let i = 0 ; i < A.length ; i++){
            const p = ~~ (A[i] / s)
            buckets[p].push(A[i])
        }
        buckets.forEach(num=>{
            if(num.length!=0) insert_sort(num)
        })
        return [].concat(...buckets)
    }
```


### 数组去重

```javascript
    function reset(arr){
        return [...new Set(arr)]
    }
    function reset(arr){
        let tmp = [];
        for(let i = 0;i<arr.length;i++){
            (tmp.indexOf(arr[i]) === -1) && tmp.push(arr[i])
        }
        return tmp
    }
    function reset(arr){
        let obj = {},tmp=[];
        for(let i=0;i<arr.length;i++){
            if(!obj[arr[i]]){
                tmp.push(arr[i])
                obj[arr[i]] = 1
            }
        }
        return tmp
    }
    function reset(arr){
        arr.sort();
        let tmp = [];
        for(let i = 0; i<arr.length;i++){
            if(arr[i] !== arr[i+1]){
                tmp.push(arr[i])
            }
        }
        return tmp
    }
```


### promise async generator 原型继承

```javascript
    function co(it){
        return new Promise((resolve,reject)=>{
            function next(data){
                let {value,done} = it.next(data);
                if(!done){
                    value.then(data=>{
                        next(data)
                    },reject)
                }else{
                    resolve(data)
                }
            }
            next()
        })
    }
```


### __proto__和prototype的区别
1.对象有属性__proto__,指向该对象的构造函数的原型对象。
2.方法除了有属性__proto__,还有属性prototype，prototype指向该方法的原型对象。

### 闭包的应用场景
1. 可以做模块化设计
2. 可以将变量私有化
3. 可以再一些函数执行之前提前提供参数，比如给setTimeout ajax这样的一些回调函数
4. 为节点循环绑定click事件时候，包装每一次循环的i值


### 递归求和
```javascript
    function sum(n){
        if(n = 1) reutn 1
        return n+sum(n-1)
    }
```


### dva和react+redux比优势


### BFS算法遍历DOM树，叫广度优先算法
```javascript
    // 深度优先 递归
    function dfs(node){
        node.children.forEach(bfs)
    }
    // 深度优先 非递归
    function dfs(node){
        let stack = [node] ;
        while(stack.length>0){
            let n = stack.shift();
            n.children.slice().reverse().forEach(one=>{
                stack.unshift(one)
            })
        }
    }
    // 广度优先
    function bfs(node){
        let stack = [node];
        while(stack.length>0){
            let first = stack.shift();
            first.children.forEach(one=>{
                stack.push(one)
            })
        }
    }
```
### http的连接数考察之类的
http的连接数就是 允许同时并发多少个http请求，比如chrome内是6个的话，超过了6个请求就需要等待前6个请求中的一个结束才能发送下一个http请求
因此在html中我们需要减少http的连接数，css文件合并，js文件合并，图片合并，减少iframe
### 如何最快速度用promise下1000张图片，连接数在10个范围内

### chrome如何在performance里面调优

### webpack与gulp的区别
1. gulp是通过操作文件流来进行打包压缩，而webpack是通过loader函数去解析，再通过ast语法树去更新相应的node节点
2. gulp是一个自动化任务的工具，而webpack是一个文件打包的工具，你也可以通过gulp去执行webpack的插件，

### redux react

```javascript
    function createStore(reducer){
        let state;
        let listener = [];
        let getState = () => state
        let dispatch = (action) => {
            state = reducer(state,action);
            listener.forEach(fn=>fn())
        }
        let subscribe = (fn) => {
            listener.push(fn);
            return () => {
                listener = listener.filter(l=>fn!==l)
            }
        }
        dispatch({type:'@INIT'})
        return {
            getState,
            dispatch,
            subscribe
        }
    }
```
```javascript
    function combinReducer(reducers){
        return function(state={},action){
            let obj = {};
            for(let key in reducers){
                obj[key] = reducers[key](state[key],action)
            }
            return obj
        }
    }
    function bindActionCreators(actions,dispath){
        let obj = {};
        for(let key in actions){
            obj[key] = (...args)=>dispatch(actions[key](...args))
        }
        return obj
    }
```