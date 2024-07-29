const express = require("express");
const router = express.Router();
const deliveryController = require("../../controllers/controllersDelivery/deliveryController");
router.get("/delivery/home", deliveryController.getHome);

// Ruta para el home del delivery
router.get('/home', isAuthenticated, deliveryController.getDeliveryHome);

// Ruta para el detalle del pedido
router.get('/pedido/:id', isAuthenticated, deliveryController.getPedidoDetail);

// Ruta para el perfil del delivery
router.get('/perfil', isAuthenticated, deliveryController.getDeliveryProfile);
router.post('/perfil', isAuthenticated, deliveryController.postDeliveryProfile);

// Ruta para completar un pedido
router.post('/pedido/:id/completar', isAuthenticated, deliveryController.completePedido);

module.exports = router;
