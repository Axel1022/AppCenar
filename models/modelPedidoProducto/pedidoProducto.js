const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContext");

const Pedido = require("../modelCliente/pedido");
const Producto = require("../modelComercios/producto");

const PedidoProducto = sequelize.define("PedidoProducto", {
  pedidoId: {
    type: Sequelize.INTEGER,
    references: {
      model: Pedido,
      key: "id",
    },
  },
  productoId: {
    type: Sequelize.INTEGER,
    references: {
      model: Producto,
      key: "id",
    },
  },
  quantity:{
    type: Sequelize.INTEGER,
    allowNull: true,
    defaultValue: 0, 
 },
});


module.exports = PedidoProducto;
