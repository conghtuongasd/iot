const helpers = require('./helpers')
const routes = require('./routes')
const schedule = require('./schedule')
const db = require('./init-db')

module.exports = {
    ...helpers,
    ...routes,
    ...schedule,
    ...db
}