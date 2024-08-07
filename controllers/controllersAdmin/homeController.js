const ModelCliente = require("../../models/modelCliente/cliente");
const ModelDelivery = require("../../models/modelDelivery/delivery");
const ModelComercio = require("../../models/modelComercios/comercio");
const ModelAdministrador = require("../../models/modelAdmin/administrador");
const ModelProducto = require("../../models/modelComercios/producto");
const ModelPedido = require("../../models/modelCliente/pedido");
const verific = require("../../utils/verificUserLog");

exports.getHome = async (req, res, next) => {
  const role = req.session.user.role;
  console.log("El rol del admin: " + role);
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  verific(req, res, next);
  const clientes = await ModelCliente.findAll();
  const comercios = await ModelComercio.findAll();
  const delivery = await ModelDelivery.findAll();
  const productos = await ModelProducto.findAll();
  const pedidos = await ModelPedido.findAll();

  //Numeric
  const now = new Date();
  now.setDate(now.getDate() - 1);
  const formattedDate = now.toISOString().split("T")[0];
  const pedidosHoy = pedidos.filter(
    (pedido) => pedido.date === formattedDate
  ).length;
  const clientesActivos = clientes.filter(
    (cliente) => cliente.active === true
  ).length;
  const clientesInactivos = clientes.filter(
    (cliente) => cliente.active === false
  ).length;
  const comerciosActivos = comercios.filter(
    (comercio) => comercio.active === true
  ).length;
  const comerciosInactivos = comercios.filter(
    (comercio) => comercio.active === false
  ).length;
  const deliveryActivos = delivery.filter(
    (deli) => deli.active === true
  ).length;
  const deliveryInactivos = delivery.filter(
    (deli) => deli.active === false
  ).length;

  res.render("viewsAdmin/home", {
    pageTitle: "Food Rush | Admin",
    layout: "layoutAdmin",
    ClientesActivos: clientesActivos,
    ClientesInactivos: clientesInactivos,
    ComerciosActivos: comerciosActivos,
    ComerciosInactivos: comerciosInactivos,
    DeliveryActivos: deliveryActivos,
    DeliveryInactivos: deliveryInactivos,
    CatidadProducto: productos.length,
    CatidadPedidos: pedidos.length,
    CatidadPedidosHoy: pedidosHoy,
  });
};
