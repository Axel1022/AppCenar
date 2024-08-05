const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContext");

const Comercio = require("../modelComercios/comercio");
const Categoria = require("../modelComercios/categoria");

const temProducto = sequelize.define("temProducto", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  tradeId: {
    type: Sequelize.INTEGER,
    references: {
      model: Comercio,
      key: "id",
    },
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.INTEGER,
    references: {
      model: Categoria,
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = temProducto;
