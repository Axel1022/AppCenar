const Sequelize = require("sequelize");
const sequelize = require("../../contexts/appContext");

const Pedido = require("../modelCliente/pedido");
const Producto = require("../modelComercios/producto");


const PedidoProducto = sequelize.define("pedidoProducto", {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
    },
    pedidoId:{
        type: Sequelize.INTEGER,
        references: {
            model: Pedido,
            key: "id"
        },
        allowNull: false
    },
    productId:{
        type: Sequelize.INTEGER,
        references: {
            model: Producto,
            key: "id"
        },
        allowNull: false
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0, 
    },
});


module.exports = PedidoProducto;
