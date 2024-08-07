const express = require("express");
const router = express.Router();
const deliveryController = require("../../controllers/controllersDelivery/deliveryController");

router.get("/delivery/home",deliveryController.getHome);
router.get('/pedido/:id',deliveryController.getPedidoDetail);
router.get('/delivery/perfil/',deliveryController.getDeliveryProfile);
router.post('/perfil',deliveryController.postDeliveryProfile);
router.post('/pedido/:id/completar',deliveryController.completePedido);
router.get("/delivery/perfil/editar", deliveryController.getEditPerfil);
router.post("/delivery/perfil/editar/post", deliveryController.postEditPerfil);

module.exports = router;
