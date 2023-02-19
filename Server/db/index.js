const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.ROOT_USER
});

const User = sequelize.define('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER
    },
    firstName: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    },
    lastName: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: ''
    }
});

const Device = sequelize.define('Device', {
    id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    pinCode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    state: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
})

const UserDevice = sequelize.define('UserDevice', {
    deviceId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: Device,
            key: 'id'
        }
    },
    userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: User,
            key: 'id'
        }
    }
});

// device.bulkCreate([
//     {
//         name: 'D1',
//         pinCode: 5,
//         state: 0
//     },
//     {
//         name: 'D2',
//         pinCode: 4,
//         state: 0
//     },
//     {
//         name: 'D3',
//         pinCode: 0,
//         state: 0
//     },
//     {
//         name: 'D4',
//         pinCode: 2,
//         state: 0
//     },
//     {
//         name: 'D5',
//         pinCode: 14,
//         state: 0
//     },
//     {
//         name: 'D6',
//         pinCode: 12,
//         state: 0
//     },
//     {
//         name: 'D7',
//         pinCode: 13,
//         state: 0
//     },
//     {
//         name: 'D8',
//         pinCode: 15,
//         state: 0
//     }
// ]);

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    scheduledDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    scheduledTime: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('Chưa kích hoạt', 'Đã kích hoạt'),
        defaultValue: 'Chưa kích hoạt',
    },
});

Device.hasMany(Schedule, { foreignKey: 'id' });
Schedule.belongsTo(Device, { foreignKey: 'deviceID' });

sequelize.sync()

module.exports = {
    sequelize,
    User,
    Device,
    UserDevice,
    Schedule
}