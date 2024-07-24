const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContext");

const Cliente = require("./cliente");

const Direccion = sequelize.define("direccion", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    clientId:{
        type: Sequelize.INTEGER,
        references: {
            model: Cliente,
            key: "id"
        }
    },
    identifier:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    direction:{
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Direccion;
