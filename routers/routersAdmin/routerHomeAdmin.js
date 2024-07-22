const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/controllersAdmin/homeController");
router.get("/homeAdmin", homeController.getHome);
module.exports = router;
