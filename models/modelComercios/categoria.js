const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContext");
const Comercio = require("./comercio");

const Categoria = sequelize.define("categoria", {

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
    description:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0, 
    },
    tradeId:{
        type: Sequelize.INTEGER,
        references: {
            model: Comercio,
            key: "id"
        },
    }
});

module.exports = Categoria;