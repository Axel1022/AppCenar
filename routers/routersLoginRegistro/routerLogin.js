const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/controllersLoginRegistro/loginController");
router.get("/login", loginController.getLogin);
module.exports = router;
