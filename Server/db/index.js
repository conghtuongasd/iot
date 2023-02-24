const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    username: process.env.ROOT_USER,
    password: process.env.PASSWORD,
    port: 3306
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

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    weekDay: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    hour: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    minute: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    state: {
        type: DataTypes.INTEGER,
        defaultValue: true,
    },
    isLoop: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    deviceID: {
        type: DataTypes.INTEGER,
        references: {
            model: Device,
            key: 'id'
        }
    }
});

sequelize.sync()

module.exports = {
    sequelize,
    User,
    Device,
    UserDevice,
    Schedule
}