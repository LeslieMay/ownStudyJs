let http = require('http');
let context = require('./context');
let request = require('./request');
let response = require('./response');
let EventEmitter = require('events');

class Koa extends EventEmitter{
    constructor(){
        super();
    }
}

module.exports = Koa;