const express = require("express");
const router = express.Router();
const registrarController = require("../../controllers/controllersLoginRegistro/registrarController");

router.get("/registroCliente", registrarController.getSingUp);
router.post("/registroCliente", registrarController.PostClienteSingUp);

module.exports = router;