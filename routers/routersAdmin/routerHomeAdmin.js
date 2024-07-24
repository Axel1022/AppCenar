const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/controllersAdmin/homeController");
router.get("/admin/home", homeController.getHome);
module.exports = router;
