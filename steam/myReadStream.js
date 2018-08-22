let fs = require('fs');
let EventEmitter = require('events');
// 文件可读流继承了EventEmitter
class MyReadStream extends EventEmitter{
    /**
     * 构造函数
     * @param {String} path 读取的文件路径
     * @param {object} options 可选参数
     */
    constructor(path,options={}){
        super();
        this.path = path;

        this.flags = options.flags || 'r'; // 文件的读取标志 默认r
        this.encoding = options.encoding || null;// 按照什么编码读取 默认是null也就是buffer
        this.fd = options.fd || ''; // 文件描述符 一般不指定 读取文件的时候会拿到这个值再把结果赋给this.fd 如果文件被打开了 fd一定是一个数字类型
        this.mode = options.mode || 0o666;// 文件的权限 一般都是0o666
        this.autoClose = options.autoClose || true;// 文件是否自动关闭 默认true
        this.start = options.start || 0;// 从文件的哪个位置开始读取 默认是0
        this.end = options.end || null;// 读到文件的哪个位置结束 默认是null 需要注意这里是包前也包后的 也就是说 如果start=0 end=3 就是读取0 1 2 3 共四个位置
        this.highWaterMark = options.highWaterMark || 64*1024;// 一次性读取多少字节数据 默认64*1024

        this.flowing = false;//是否是流动状态
        this.pos = this.start;//记录读取时候的位置

        // 初始化的时候就会触发一次open open的回调我们会拿到文件的描述符也就是fd 不过open 是一个异步方法
        this.open();
        // 当用户监听了data事件后 我们就自动的源源不断的进行文件数据读取 也就是打开了阀门 
        // 因此在这里我们需要去利用eventEmitter中的newListener事件，判断如果当前监听了data 那么我们就执行read方法
        this.on('newListener',(type)=>{
            if(type === 'data'){
                this.flowing = true;
                this.read();
            }
        })
    }
    /**
     * 关闭文件方法
     * @description 关闭文件的时候可能文件被打开了 那么就要调用close方法 如果文件还没有打开就报错了 那么就直接发射close事件
     */
    destroy(){
        if(typeof this.fd === 'number'){
            fs.close(this.fd,()=>{
                this.emit('close')
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
                this.emit('error',err)
                if(this.autoClose){
                    this.destroy()
                }
                return
            }
            // 如果没有错误 那我们就拿到了fd并且把open事件发射 注意 这个过程是异步的
            this.fd = fd;
            this.emit('open');
        })
    }
    /**
     * 读取文件
     * @description 当用户监听了data就触发
     */
    read(){
        // 因为open是异步的方法 所以当read的时候可能还没有拿到fd 因此这个需要做一次处理
        if(typeof this.fd !== 'number'){
            // 当发现fd还没有读到的时候 我们监听open事件，因为我们当文件读取完毕的时候会触发一次open事件 所以我们在这里监听了open，那么触发的时候也会把我们这个监听器函数执行 为了重复执行 我们用once 保证只执行一次 那么就确保下次进来的时候一定是拿到fd的
            this.once('open',()=>{this.read()})
        }else{
            // 声明一个highWaterMark长度的buffer 用来存储读取到的数据
            let buffer = Buffer.alloc(this.highWaterMark)
            // 我们知道我们传入的参数中可能指定start和end 当指定end的时候 我们就需要判断我们读到那里结束 因此我们需要处理一次每次读取的长度 如果没有指定end 那么每次都读取highWaterMark长度就行了 指定了  我们就需要判断现在读取的位置距离end还有多少 如果小于highWaterMark那么就不能读highWaterMark长度了 如果大于 那么就继续读取highWaterMark长度
            let howMuchToRead = this.end? Math.min(this.highWaterMark,this.end-this.pos+1):this.highWaterMark;
            // this.pos 指定了从文件的那个位置读取
            fs.read(this.fd,buffer,0,howMuchToRead,this.pos,(err,bytesRead)=>{
                // 发生了错误就发射错误 并且关闭文件
                if(err){
                    this.emit('error',err)
                    if(this.autoClose){
                        this.destroy()
                    }
                    return
                }
                // bytesRead是每次实际读取的个数 大于0 说明读到了 等于0 说明读完了
                if(bytesRead>0){
                    // 读取了之后 移动pos
                    this.pos += bytesRead;
                    // 取出buffer有效长度
                    let r =buffer.slice(0,bytesRead);
                    // 如果有编码就返回编码后的值
                    r= this.encoding?r.toString(this.encoding):r;
                    this.emit('data',r);
                    if(this.flowing){
                        // 如果当前是流动状态就继续执行 不停读取
                        this.read();
                    }
                }else{
                    // 读取完毕 发射end事件 然后如果指定autoClose true就关闭文件
                    this.emit('end')
                    if(this.autoClose){
                        this.destroy();
                      }
                }
            })

        }
    }
    /**
     * 暂停
     */
    pause(){
        // 修改流动状态为flase 阻止不停读取
        this.flowing = false;
    }
    /**
     * 恢复
     */
    resume(){
        //修改流动状态为true 并且手动调用一次read 恢复读取
        this.flowing = true;
        this.read()
    }
    /**
     * 管道方法
     * @param {*} ws 可写流实例
     */
    pipe(ws){
        // this 是一个可读流实例 那么他监听了data之后就会打开阀门 不停的读取数据 我们将读取的数据写入到文件中
        this.on('data',function (data) {
            // 利用可写流返回的flag去判断当前是不是待写入的已经超过了我们设置的水位线 如果是的那我们就调用pause暂停读取
            let flag = ws.write(data);
            if(!flag){
              this.pause();
            }
          });
        //   当待写入数据全部清空触发drain事件 这时候通知可读流继续读取 
        ws.on('drain', () => {
            this.resume();
        });
    }
}

module.exports = MyReadStream


