let fs = require('fs');
let EventEmitter = require('events');

class WriteStream extends EventEmitter {
  constructor(path, options) {
    super();
    this.path = path;
    this.flags = options.flags || 'w';
    this.encoding = options.encoding || 'utf8';
    this.highWaterMark = options.highWaterMark || 16 * 1024
    this.mode = options.mode || 0o666;
    this.autoClose = options.autoClose || true;
    this.start = options.start || 0;
    this.pos = this.start;
    this.writing = false;
    // 当文件正在被写入的时候 要将其他写入的内容放到缓存区中
    this.cache = [];
    // 默认情况下不会触发drain事件 只有当写入的长度等于highWaterMark时才会触发
    this.needDrain = false;
    this.len = 0;
    this.open(); // fd
  }
  destroy() {
    if (typeof this.fd === 'number') {
      fs.close(this.fd, () => {
        this.emit('close');
      })
    } else {
      this.emit('close');
    }
  }
  open() {
    fs.open(this.path, this.flags, (err, fd) => {
      if (err) {
        this.emit('error');
        if (this.autoClose) {
          this.destroy();
        }
        return;
      }
      this.fd = fd;
      this.emit('open', this.fd);
    })
  }
  write(chunk, encoding="utf8", callback=()=>{}) {
    // 先判断没有写入的内容和highWater来比较
    chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    this.len += chunk.length;
    if (this.len >= this.highWaterMark) {
      this.needDrain = true;
    }
    if (this.writing) {
      this.cache.push({
        chunk,
        encoding,
        callback
      });
    } else {
      // 没有正在写入
      this.writing = true;
      this._write(chunk, encoding, () => {
        callback();
        this.clearBuffer(); // 清空数组里的下一项
      });
    }
    // 第一次往文件里写入，第二次放到缓存区中

    return this.len < this.highWaterMark
  }
  clearBuffer(){
    let obj = this.cache.shift();
    if(obj){
      this._write(obj.chunk, obj.encoding,()=>{
        obj.callback();
        this.clearBuffer();
      })
    }else{
      if(this.needDrain){ // 是否需要触发drain
        this.writing = false; // 触发drain后下次再次写入时 往文件里写入
        this.emit('drain'); // 触发drain事件
      }
    }
  }
  _write(chunk, encoding, callback) {
    if (typeof this.fd !== 'number') {
      return this.once('open', () => this._write(chunk, encoding, callback));
    }
    fs.write(this.fd, chunk, 0, chunk.length, this.pos, (err, byteWritten) => {
      this.pos += byteWritten; // 移动写入的偏移量
      this.len -= byteWritten; // 减少没有写入的个数
      callback();  // 清空缓存区的内容
    });
  }
}
module.exports = WriteStream;