const express = require("express");
const router = express.Router();
const registrarController = require("../../controllers/controllersLoginRegistro/registrarController");

router.get("/registrar", registrarController.getSingUp);
router.post("/registrar", registrarController.PostClienteSingUp);

module.exports = router;
