const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContext");

const Cliente = require("./cliente");
const Direccion = require("./direccion");
const Comercio = require("../modelComercios/comercio");
const Delivery = require("../modelDelivery/delivery");

const Pedido = sequelize.define("pedido", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  clientId: {
    type: Sequelize.INTEGER,
    references: {
      model: Cliente,
      key: "id",
    },
  },
  directionId: {
    type: Sequelize.INTEGER,
    references: {
      model: Direccion,
      key: "id",
    },
  },
  tradeId: {
    type: Sequelize.INTEGER,
    references: {
      model: Comercio,
      key: "id",
    },
  },
  deliverId: {
    type: Sequelize.INTEGER,
    references: {
      model: Delivery,
      key: "id",
    },
  },
  subTotal: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  date: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hour: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  total: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  status: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Pedido;
