const Sequelize = require("sequelize");
const sequelize = require("/contexts/appContext");

const Delivery = sequelize.define("delivery", {
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
    status:{
        type: Sequelize.STRING,
        defaultValue: "Ocupado"
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0, 
    },
})

module.exports = Delivery;