// l: 显示所有用户
// b: xxx 广播
// s:zs:xxx
// r:zs
// xxx: 命令不存在

let net = require('net');

let clients = {

}
let server = net.createServer((socket)=>{
    let key = socket.remoteAddress + socket.remotePort;
    clients[key] = {
        name:'匿名',
        socket
    }
    socket.setEncoding('utf8');
    server.getConnections(()=>{
        socket.write('欢迎来到聊天室\r\n')
    })
    socket.on('data',(data)=>{
        data = data.replace("\r\n",'');
        let char = data.split(':')[0];
        switch(char){
            case 'l':
            // 显示所有用户
                list(socket);
                break;
            case 'b':
            // 广播
                broad(key,data.split(':')[1])
                break;
            case 's':
            // 私信
                private(key,data.split(':')[1],data.split(':')[2])
                break;
            case 'r':
            // 改名
                rename(key,data.split(':')[1])
                break;
            default:
                socket.write(`无效指令\r\nl: 显示所有用户\r\nb: xxx 广播\r\ns:zs:xxx 私信某个用户 s:姓名:内容\r\nr:zs 改名 r:新名字\r\n`)
                break;
        }
    })
})
server.listen(3000);

function list(socket){
    let name = Object.values(clients).map(one=>one.name).join('\r\n');
    socket.write(`当前用户列表\r\n${name}\r\n`);
}
function broad(key,data){
    for(let i in clients){
        if(i!==key){
            clients[i].socket.write(`${clients[key].name}:${data}\r\n`)
        }
    }
}
function private(key,other,data){
    let socket = Object.values(clients).find(one=>one.name===other).socket;
    socket.write(`${clients[key].name}:${data}\r\n`)
}
function rename(key,newName){
    clients[key].name = newName;
    clients[key].socket.write(`修改成功，新名字是${newName}\r\n`);
}