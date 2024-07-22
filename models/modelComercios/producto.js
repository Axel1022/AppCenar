const Sequelize = require("sequelize");
const sequelize = require("/contexts/appContext");

const Comercio = require("../modelComercios/comercio");
const Producto = sequelize.define("producto", {
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
    image:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    price:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    tradeId:{
        references: {
            model: Comercio,
            key: "id"
        },
    }
})

module.exports = Producto;