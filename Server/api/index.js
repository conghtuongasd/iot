var http = require('http');
var WebSocket = require('ws');
const { Device } = require('../db');
const { requestHandler, broadcast } = require('../utils/routes');
require('dotenv').config();

var server = http.createServer(requestHandler);
var ws = new WebSocket.Server({
    server
});
var clients = [];

const onLoadData = async (socket) => {
    const devices = await Device.findAll();

    socket.send(JSON.stringify({
        type: 'ALL_PINS',
        data: devices
    }))
}

ws.on('connection', async (socket) => {
    clients.push(socket);
    await onLoadData(socket)

    socket.on('message', async (message) => {
        await broadcast(clients, socket, message.toString());
    });

    socket.on('close', function () {
        var index = clients.indexOf(socket);
        clients.splice(index, 1);
        console.log('disconnected');
    });
});

server.listen(process.env.PORT, () => {
    console.log(`Connected to port ${process.env.PORT}`);
})