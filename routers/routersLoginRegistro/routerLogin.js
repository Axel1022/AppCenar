const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/controllersLoginRegistro/loginController");

router.get("/login", loginController.getLogin);
router.post("/login", loginController.PostLogin);

module.exports = router;
