const express = require("express");
const router = express.Router();
const comerciosController = require("../../controllers/controllersComercios/comerciosController");

router.get("/comercios/home", comerciosController.getHome);
router.get("/comercios/bebidas", comerciosController.getViewBebidas);
router.get("/comercios/mercados", comerciosController.getViewMercados);
router.get("/comercios/postres_cafe", comerciosController.getViewPostres_Cafe);
router.get("/comercios/restaurantes", comerciosController.getViewRestaurantes);
router.get("/comercios/salud", comerciosController.getViewSalud);
router.get("/comercios/tiendas", comerciosController.getViewTiendas);
router.get("/comercios/perfil", comerciosController.getPerfil);
router.get("/comercios/perfil/editar", comerciosController.getEditPerfil);
router.post("/comercios/perfil/editar/post", comerciosController.PostEditPerfil);
module.exports = router;
