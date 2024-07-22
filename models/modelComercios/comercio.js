const Sequelize = require("sequelize");
const sequelize = require("/contexts/appContext");

const Comercio = sequelize.define("comercio", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    role:{
        type: Sequelize.STRING,
        allowNull: false,
    }, 
    logo:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    openTime:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    closeTime:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    typeTrade:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    active:{
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    token:{
        type: Sequelize.STRING,
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0, 
    },
})

module.exports = Comercio;