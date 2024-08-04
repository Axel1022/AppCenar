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
// router.get(
//   "/comercios/pedido/realizar/:id",
//   comerciosController.getViewListProductsAndConfirmar
// );
router.get(
  "/comercios/pedido/realizar/:id/:idProduct",
  comerciosController.getViewListProductsAndConfirmar
);
router.get("/producto/:id/:idProduct", comerciosController.getAddProduct);
module.exports = router;
