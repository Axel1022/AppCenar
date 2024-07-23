const express = require("express");
const router = express.Router();
const registrarController = require("../../controllers/controllersLoginRegistro/registrarController");

router.get("/registroCliente", registrarController.getClienteSingUp);
router.post("/registroClientePost", registrarController.PostClienteSingUp);

router.get("/registroComercio", registrarController.getComercioSingUp);
router.post("/registroComercioPost", registrarController.PostComercioSingUp);

router.get("/registroAdmin", registrarController.getAdminSingUp);
router.post("/registroAdminPost", registrarController.PostAdminSingUp);

module.exports = router;
