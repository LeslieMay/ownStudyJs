let fs = require('fs');
let EventEmitter = require('events');
// 可写流也是继承EventEmitter
class MyWriteStream extends EventEmitter {
    /**
     * 构造函数
     * @param {String} path 读取的文件路径
     * @param {object} options 可选参数
     */
    constructor(path,options={}){
        super();
        this.path = path;

        this.flags = options.flags || 'w';// 文件的读取标志 默认w
        this.encoding = options.encoding || 'utf8';// 按照什么编码写入 默认是utf8
        this.fd = options.fd || '';// 文件描述符 一般不指定 打开文件的时候会拿到这个值再把结果赋给this.fd 如果文件被打开了 fd一定是一个数字类型
        this.mode = options.mode || 0o666;// 文件的权限 一般都是0o666
        this.autoClose = options.autoClose || true;// 文件是否自动关闭 默认true
        this.start = options.start || 0;// 从文件的哪个位置开始读取 默认是0
        this.highWaterMark = options.highWaterMark || 16*1024;// 期望写入的数据 默认16*1024字节

        this.cache = [];//缓存数组
        this.pos = this.start;//写入的位置
        this.needDrain = false;//默认下不触发drain事件 只有待写入的大于highWaterMark并且缓存清空了才会触发
        this.writing = false;//是否正在写入 如果是的话 其他的就放到缓存中待写入
        this.len = 0;// 当前正在写入和待写入的长度 用来和highWaterMark比较
        this.open();// 先打开文件
    }
    /**
     * 关闭文件方法
     * @description 关闭文件的时候可能文件被打开了 那么就要调用close方法 如果文件还没有打开就报错了 那么就直接发射close事件
     */
    destory(){
        if(typeof this.fd === 'number'){
            fs.close(this.fd,()=>{
                this.emit('close');
            })
        }else{
            this.emit('close')
        }
    }
    /**
     * 打开文件
     */
    open(){
        fs.open(this.path,this.flags,(err,fd)=>{
            // 打开文件如果出错了 就把错误发射出去 并且如果设置了自动关闭就调用destroy方法
            if(err){
                this.emit('error',err);
                if(this.autoClose){
                    this.destory();
                }
            }else{
                // 如果没有错误 那我们就拿到了fd并且把open事件发射 注意 这个过程是异步的
                this.fd = fd;
                this.emit('open')
            }
        })
    }
    /**
     * 外部调用的写入函数
     * @param {any} chunk 写入的数据
     * @param {string} encoding 编码
     * @param {function} callback 回调函数
     */
    write(chunk,encoding="utf8", callback=()=>{}){
        // 首先判断写入的数据是不是buffer 不是buffer就转换成buffer 
        chunk = Buffer.isBuffer(chunk)?chunk:Buffer.from(chunk);
        // 将写入的数据加到待写入的长度中
        this.len += chunk.length;
        // 判断现在待写入的长度是不是大于等于我们设置的highWaterMark 如果是 说明我们如果全部写完了就该发射drain
        if(this.len >= this.highWaterMark){
            // 达到水位线
            this.needDrain = true
        }
        // 如果当前没有正在写入的 那么就可以直接把该数据写入到文件中 如果有的话就先缓存下来
        if(!this.writing){
            // 将写入状态改成true  表示有正在写入的数据
            this.writing = true;
            //调用真正写入的方法 并且包装一下回调函数 如果写完了就该继续去缓存中查找 把缓存里的数据写入
            this._write(chunk,encoding,()=>{
                // 当一个写入完了之后 调用回调 然后取缓存中的继续写
                callback();
                // 清空缓存
                this.clearCache();
            })
        }else{
            // 放入缓存
            this.cache.push({
                chunk,encoding,callback
            })
        }
        // 返回当前待写入的长度 是不是小于我们设置的水位线
        return this.len < this.highWaterMark
    }
    /**
     * 清空缓存中的数据
     */
    clearCache(){
        // 取出缓存中的第一项 如果第一项有值说明缓存中有数据 没有值 说明 现在缓存空了 判读现在如果满足触发drain事件的条件就触发
        let data = this.cache.shift();
        if(data){
            // 同样 调用写入方法
            this._write(data.chunk,data.encoding,()=>{
                data.callback();
                this.clearCache();
            })
        }else{
            // 如果满足 就emit drain事件 并且将状态重置
            if(this.needDrain){
                this.writing = false;
                this.needDrain = false;
                this.emit('drain')
            }
        }
    }
    /**
     * 内部调用的写入函数 真正的写入
     * @param {any} chunk 写入的数据
     * @param {string} encoding 编码
     * @param {function} callback 回调函数
     */
    _write(chunk,encoding,callback){
        // 因为open是异步的方法 所以当_write的时候可能还没有拿到fd 因此这个需要做一次处理
        if(typeof this.fd !== 'number'){
            // 当发现fd还没有读到的时候 我们监听open事件，因为我们当文件读取完毕的时候会触发一次open事件 所以我们在这里监听了open，那么触发的时候也会把我们这个监听器函数执行 为了重复执行 我们用once 保证只执行一次 那么就确保下次进来的时候一定是拿到fd的
            return this.once('open',()=>this._write(chunk,encoding,callback))
        }
        // this.pos 写入的位置
        fs.write(this.fd,chunk,0,chunk.length,this.pos,(err,writeBytes)=>{
            // 发生了错误就发射错误 并且关闭文件
            if(err){
                this.emit('error',err);
                if(this.autoClose){
                    this.destory()
                }
                return
            }
            // 将位置移动当前写入数据长度
            this.pos += writeBytes;
            // 在待写入的长度中把 真正写入数据的长度 减去
            this.len -= writeBytes;
            // 执行回调
            callback();
        })
    }
}
module.exports = MyWriteStream;