const express = require("express");
const router = express.Router();
const productosController = require("../../controllers/controllersProducto/productoController");

router.get("/comercios/Productos", productosController.GetProducts);
router.get("/comercios/AgregarProducto", productosController.GetAddProducts);
router.get("/comercios/EditarProducto/:id", productosController.GetEditProducts);
router.get("/comercios/EliminarProducto/:id", productosController.GetDeleteProducts);
router.post("/comercios/AgregarProducto", productosController.PostAddProducts);
router.post("/comercios/EditarProducto", productosController.PostEditProducts);
router.post("/comercios/EliminarProducto/:id", productosController.GetDeleteProducts);
router.post("/comercios/EliminarProducto", productosController.PostDeleteProducts);

module.exports = router;
