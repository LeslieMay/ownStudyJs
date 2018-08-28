let crypto = require('crypto');

let str = 'zfpx';

let base = crypto.createHash('md5').update(str).digest('base64');
console.log(base)

let base1 = crypto.createHash('md5').update('zf').update('px').digest('base64');
console.log(base1)

// 同一字符串 如果拆分开来 多次update  那么和一次性update的结果一样
let crypto = require('crypto');
let hmac = crypto.createHmac('sha256','zfpx1');

let r = hmac.update('zfpx').digest('base64');
console.log(r)
