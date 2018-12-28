#! /usr/bin/env node
let Server = require('../src/index.js');

let commander = require('commander');
let {version} = require('../package.json');
commander
    .option('-p,--port <n>','config port')
    .option('-o,--host [value]','config hostname')
    .option('-d,--dir [value]','config directory')
    .version(version, '-v,--version').parse(process.argv);
    console.log(commander)
let server = new Server(commander);
server.start();