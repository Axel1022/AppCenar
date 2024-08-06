const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/controllersLoginRegistro/loginController");

router.get("/activate/:token", loginController.getActivation);
router.get("/login", loginController.getLogin);
router.get("/logOut", loginController.LogOut);
router.post("/login", loginController.PostLogin);
router.get("/search-password", loginController.searchPassword);
router.post("/search-password", loginController.searchPassword);
router.get("/recover-password/:token", loginController.getRecoverPasswordPage);
router.post("/recover-password", loginController.recoverPassword);

module.exports = router;
