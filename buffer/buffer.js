// Buffer.from 
// Buffer.of
// Buffer.alloc
// Buffer.allocUnsafe
// Buffer.allocUnsafeSlow
// Buffer.isBuffer
// Buffer.compare
// Buffer.isEncoding
// Buffer.concat
// Buffer.byteLength
console.log(Buffer.from([1,2,3,4,5]).length)
console.log(Buffer.alloc(7))
console.log(Buffer.allocUnsafe(7))
console.log(Buffer.byteLength('祝福', 'utf8'))
console.log(Buffer.concat([Buffer.from('hello'),Buffer.from('world')]))
console.log(Buffer.from('祝福').indexOf('福'))

Buffer.prototype.copy = function(targetBuffer,targetStart,sourceStart,SourceEnd){
    sourceStart = sourceStart?sourceStart:0
    SourceEnd = SourceEnd? SourceEnd:this.length;
    for(let i=sourceStart;i<SourceEnd;i++){
        // 把内容考到对应的buffer的身上
        targetBuffer[targetStart++] = this[i];
    }
}

Buffer.concat = function(arr){
    let num = arr.forEach(buf => {
        num+=buf.length
    });
    let buffer = Buffer.alloc(num);
    let pos = 0;
    for(let i in arr){
        arr[i].copy(buffer,pos);
        pos += arr[i].length
    }
    return buffer
}


var array1 = Array(3);
array1[0] = 2;
var result = array1.map(elem => '1');
console.log(result)