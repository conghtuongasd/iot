const allTable = require("../db");
const initData = require('../data/initialData.json')
const initDatabase = async () => {
    const tables = Object.keys(initData);
    for (let index = 0; index < tables.length; index++) {
        const tableName = tables[index]
        const data = initData[tableName];
        await allTable[tableName].bulkCreate(data);
    }
}

module.exports = {
    initDatabase
}