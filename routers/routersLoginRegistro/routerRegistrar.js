const express = require("express");
const router = express.Router();
const registrarController = require("../../controllers/controllersLoginRegistro/registrarController");
router.get("/registrar", registrarController.getRegistrar);
module.exports = router;
