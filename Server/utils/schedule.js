const { Device } = require('../db');
const { setSchedule } = require('./helpers');

const onloadSchedules = async (socket, schedules, clients) => {
    for (let index = 0; index < schedules.length; index++) {
        const item = schedules[index];
        const device = await Device.findOne({
            where: {
                id: item.deviceID
            }
        })
        if (device) {
            setSchedule(clients, socket, {
                ...item,
                pinCode: device.pinCode
            });
        }
    }
}

module.exports = {
    onloadSchedules
}