const express = require("express");
const router = express.Router();
const categoriaController = require("../../controllers/controllersComercios/categoriaController");

router.get("/comercios/Categorias", categoriaController.GetCategoria);
router.get("/comercios/AgregarCategoria", categoriaController.GetAddCategoria);
router.get("/comercios/EditarCategoria/:id", categoriaController.GetEditCategoria);
router.get("/comercios/EliminarCategoria/:id", categoriaController.GetDeleteCategoria);
router.post("/comercios/AgregarCategoria", categoriaController.PostAddCategorias);
router.post("/comercios/EditarCategoria", categoriaController.PostEditCategoria);
router.post("/comercios/DeleteCategoria", categoriaController.PostDeleteCategoria)