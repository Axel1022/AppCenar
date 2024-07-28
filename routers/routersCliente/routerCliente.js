// Cliente > ?
const express = require("express");
const router = express.Router();
const clienteController = require("../../controllers/controllersCliente/clienteController");

router.get("/cliente/home", clienteController.getHome);
router.get("/cliente/direcciones", clienteController.getDirecciones);
router.get("/cliente/direcciones/add", clienteController.getDireccionesAdd);
router.post(
  "/cliente/direcciones/add/post",
  clienteController.postDireccionesAdd
);
router.get("/cliente/favoritos", clienteController.getFavoritos);
router.get("/cliente/perfil", clienteController.getPerfil);
router.get("/cliente/perfil/editar", clienteController.getEditPerfil);
router.post("/cliente/perfil/editar/post", clienteController.postEditPerfil);
router.post(
  "/cliente/direcciones/eliminar/post",
  clienteController.postEliminarDirrecion
);
router.get(
  "/cliente/direcciones/edit/:elemetnId",
  clienteController.getEditarDirrecion
);
router.post(
  "/cliente/direcciones/editar/post",
  clienteController.postEditarDirrecion
);

router.get("/cliente/pedidos", clienteController.getPedidos);
module.exports = router;
