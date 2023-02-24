const { readFile } = require('fs');
const { Device, Schedule } = require('../db');
const { isJson, stringify, setSchedule, sendAll } = require('./helpers');

async function requestHandler(request, response) {
    switch (request.url) {
        case '/':
            readFile('./index.html', function (error, content) {
                response.writeHead(200, {
                    'Content-Type': 'text/html'
                });
                response.end(content);
            });
            break;
        case '/load-data':
            const devices = await Device.findAll();
            response.writeHead(200, {
                'Content-Type': 'application/json'
            });
            response.end(stringify({
                devices: devices
            }))
            break;
        default:
            response.end("No data");
            break;
    }
}

const broadcast = async (clients, socket, data) => {
    if (isJson(data)) {
        let dataJson = JSON.parse(data);
        if (dataJson) {
            if (dataJson.type === "TOGGLE_PIN") {
                const dv = await Device.findOne({ where: { pinCode: dataJson.pinCode } })
                if (dv) {
                    await Device.update({ state: dataJson.state }, {
                        where: { pinCode: dataJson.pinCode },
                        individualHooks: true
                    })
                }
            } else if (dataJson.type === "SET_ALARM") {
                const dv = await Device.findOne({ where: { pinCode: dataJson.data.pinCode } })
                if (dv) {
                    await Schedule.upsert({
                        ...dataJson.data,
                        deviceID: dv.id
                    });

                    setSchedule(clients, socket, dataJson.data);
                }
            }
        }
    }

    sendAll(clients, socket, data)
}

module.exports = {
    requestHandler,
    broadcast
}