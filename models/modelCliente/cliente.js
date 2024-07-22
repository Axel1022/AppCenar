const Sequelize = require("sequelize");
const sequelize = require("/contexts/appContext");

const Usuario = sequelize.define("usuario", {
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
    phone:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageProfile:{
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
    role:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    active:{
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

module.exports = Usuario;