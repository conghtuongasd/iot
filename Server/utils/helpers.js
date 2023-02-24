const { scheduleJob } = require('node-schedule');

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const isJson = (str) => {
    try {
        JSON.parse(str)
        return true
    } catch (e) {
        return false
    }
}

const getDay = (date) => {
    const dayOfWeek = date.getDay();
    return days[dayOfWeek];
}

const stringify = (str) => JSON.stringify(str, null, 2)

const sendAll = (clients, socket, data) => {
    for (var i = 0; i < clients.length; i++) {
        if (clients[i] != socket) {
            clients[i].send(data);
        }
    }
}

const setSchedule = (clients, socket, job) => {
    const date = `0 ${job.minute} ${job.hour} * * ${job.weekDay}`
    scheduleJob(date, () => {
        sendAll(clients, socket, stringify({
            type: 'TOGGLE_PIN',
            pinCode: job.pinCode,
            state: job.state
        }))
    })
}

module.exports = {
    isJson,
    stringify,
    getDay,
    setSchedule,
    sendAll
}