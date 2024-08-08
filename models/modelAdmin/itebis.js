const Sequelize = require("sequelize");

const sequelize = require("../../contexts/appContext");
const Admin = require("./administrador");

const Itbis = sequelize.define("itbis", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  itbis: {
    type: Sequelize.FLOAT,
    defaultValue: 0.0,
  },
  adminId: {
    type: Sequelize.INTEGER,
    references: {
      model: Admin,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = Itbis;
