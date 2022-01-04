const socket = require('socket.io');
const http = require('http');
const path = require("path");
const fs = require("fs");
const server = http.createServer((req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    const readStream = fs.createReadStream(indexPath);

    readStream.pipe(res);
});
const io = socket(server);
let countClient = 0;
let listClient = [];
io.on('connection', client => {
    console.log('connected', client.auth || client.id);
    countClient++;
    listClient.push(client.id);
    const info = {
        id: client.auth || client.id,
        count: countClient,
        list: listClient
    }
    client.broadcast.emit('connect-client', info);

    client.on('set-name', (data) => {
        client.auth = data;
        const userInfo = {
            id: client.id,
            auth: client.auth
        }
        client.broadcast.emit('changed-name', userInfo);
    })

    client.on('client-message', data => {
        const payload = {
            message: data.message,
            id: client.auth || client.id,
        };
        client.broadcast.emit('server-message', payload);
        client.emit('server-message', payload);
    });
    client.on('reconnect', () => {
        console.log('reconnect', client.auth || client.id);
        client.broadcast.emit('reconnect-client', client.auth || client.id);
    })
    client.on('disconnect', (reason) => {
        console.log('disconnect', client.auth || client.id);
        countClient--;
        listClient = listClient.filter(item => item !== client.id);
        console.log(listClient);
        const dataDisconnect = {
            id: client.auth || client.id,
            count: countClient,
            list: listClient
        }
        client.broadcast.emit('disconnect-client', dataDisconnect);

    });
})

server.listen(3000);
