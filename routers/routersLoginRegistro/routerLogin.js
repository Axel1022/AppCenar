const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/controllersLoginRegistro/loginController");

router.get("/", loginController.getLogin);
router.post("/login", loginController.PostLogin);

module.exports = router;
