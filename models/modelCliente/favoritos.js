const Sequelize = require("sequelize");
const sequelize = require("/contexts/appContext");

const Cliente = require("../modelCliente/cliente");
const Comercio = require("../modelComercios/comercio");

const Favorito = sequelize.define("favorito", {
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
    tradeId:{
        references: {
            model: Comercio,
            key: "id"
        },
    } 
})

module.exports = Favorito;