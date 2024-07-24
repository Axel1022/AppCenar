const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/controllersLoginRegistro/loginController");

router.get("/activate/:token", loginController.getActivation);
router.get("/login", loginController.getLogin);
router.get("/logOut", loginController.LogOut);
router.post("/login", loginController.PostLogin);

module.exports = router;
