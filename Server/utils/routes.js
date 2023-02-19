const { readFile } = require('fs');
const { Device } = require('../db');
const { isJson } = require('./helpers');

function requestHandler(request, response) {
    switch (request.url) {
        case '/':
            readFile('./index.html', function (error, content) {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(content);
            });
            break;

        default:
            response.end("No data");
            break;
    }
}

const broadcast = async (clients, socket, data) => {
    if (isJson(data)) {
        let dataJson = JSON.parse(data);
        if (dataJson && dataJson.type === "TOGGLE_PIN") {
            const dv = await Device.findOne({ where: { pinCode: dataJson.pinCode } })
            if (dv) {
                await Device.update({ state: dataJson.state }, {
                    where: { pinCode: dataJson.pinCode },
                    individualHooks: true
                })
            }
        }

        for (var i = 0; i < clients.length; i++) {
            if (clients[i] != socket) {
                clients[i].send(data);
            }
        }
    }
}

module.exports = {
    requestHandler,
    broadcast
}