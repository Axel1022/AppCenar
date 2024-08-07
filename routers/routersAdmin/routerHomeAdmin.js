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
router.get("/admin/editar/:adminId", adminController.adminEditar);
router.get("/admin/itbis", adminController.getViewItebis);
router.post("/admin/editItbis", adminController.postEdidtViewItebis);
router.post("/admin/activarDesactivar", adminController.postActDes);
router.post("/editarAdminPost", adminController.editarAdminPost);
router.post("/logout", adminController.logout);
module.exports = router;
