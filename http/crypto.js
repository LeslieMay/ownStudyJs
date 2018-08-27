let crypto = require('crypto');

let r = crypto.createHash('md5').update('123456').digest('base64');

console.log(r)
r = crypto.createHash('md5').update('123456789').digest('base64');

console.log(r)