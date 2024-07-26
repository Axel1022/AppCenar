const express = require("express");
const router = express.Router();
const productosController = require("../../controllers/controllersProducto/productoController");

router.get("/comercios/productos", productosController.GetProducts);
router.get("/comercios/agregarProducto", productosController.GetAddProducts);
router.get("/comercios/editarProducto/:id", productosController.GetEditProducts);
router.get("/comercios/eliminarProducto/:id", productosController.GetDeleteProducts);
router.post("/comercios/agregarProducto", productosController.PostAddProducts);
router.post("/comercios/editarProducto", productosController.PostEditProducts);
router.post("/comercios/eliminarProducto", productosController.PostDeleteProducts);

module.exports = router;
