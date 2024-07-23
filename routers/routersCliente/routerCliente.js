// Cliente > ?
const express = require("express");
const router = express.Router();
const clienteController = require("../../controllers/controllersCliente/clienteController");

router.get("/cliente/home", clienteController.getHome);
router.get("/cliente/direcciones", clienteController.getDirecciones);
router.get("/cliente/favoritos", clienteController.getFavoritos);
router.get("/cliente/perfil", clienteController.getPerfil);
router.get("/cliente/pedidos", clienteController.getPedidos);
module.exports = router;