const express = require("express");
const router = express.Router();
const deliveryController = require("../../controllers/controllersDelivery/deliveryController");
router.get("/delivery/home", deliveryController.getHome);

module.exports = router;
