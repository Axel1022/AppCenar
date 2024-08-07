const express = require("express");
const router = express.Router();
const homeController = require("../../controllers/controllersAdmin/homeController");
const adminController = require("../../controllers/controllersAdmin/adminController");
router.get("/admin/home", homeController.getHome);
router.get("/admin/listadoCliente", adminController.getClientes);
router.get("/admin/listadoDelivery", adminController.getDeliveries);
router.get("/admin/listadoComercio", adminController.getComercios);
router.get("/admin/mantenimientoAdmin", adminController.getAdministradores);
router.post(
  "/admin/mantenimientoAdmin/crearAdmin",
  adminController.createAdministrador
);
router.put("/administradores/:id", adminController.updateAdministrador);
router.delete("/administradores/:id", adminController.deleteAdministrador);
router.get("/admin/itbis", adminController.getViewItebis);
router.post("/admin/editItbis", adminController.postEdidtViewItebis);
router.post("/logout", adminController.logout);
module.exports = router;
