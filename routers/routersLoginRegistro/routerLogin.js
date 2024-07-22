const express = require("express");
const router = express.Router();
const loginController = require("../../controllers/controllersLoginRegistro/loginController");

router.get("/viewLogin", loginController.getLogin);
router.post("/viewLogin", loginController.PostLogin);

module.exports = router;
