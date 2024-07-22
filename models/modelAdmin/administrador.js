const Sequelize = require("sequelize");

const sequelize = require("/contexts/appContext");

const Administrador = sequelize.define("administrador", {
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
    lastName:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    identification:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    user:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false,
    },
})

module.exports = Administrador;