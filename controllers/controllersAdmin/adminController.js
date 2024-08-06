const ModelCliente = require("../../models/modelCliente/cliente");
const ModelDelivery = require("../../models/modelDelivery/delivery");
const ModelComercio = require("../../models/modelComercios/comercio");
const ModelAdministrador = require("../../models/modelAdmin/administrador");
const ModelProducto = require("../../models/modelComercios/producto");
const ModelPedido = require("../../models/modelCliente/pedido");
const verific = require("../../utils/verificUserLog");

exports.getClientes = async (req, res, next) => {
  verific(req, res, next);


    const clientes = await items.map((cliente) => {

        const itemsPedidos = ModelPedido.findAll({ where: { id: cliente.id } });

    });
  res.render("viewsAdmin/listadoCliente", {
    pageTitle: "Food Rush | Admin",
    layout: "layoutAdmin",
    Clientes: clientes,
    has: clientes.length,
  });
};

exports.getDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.findAll();

    res.render("viewsAdmin/listadoDelivery", { deliveries });
  } catch (error) {
    res.status(500).send("Error al obtener el listado de deliveries");
  }
};

exports.getComercios = async (req, res) => {
  try {
    const comercios = await Comercio.findAll();

    res.render("viewsAdmin/listadoComercio", { comercios });
  } catch (error) {
    res.status(500).send("Error al obtener el listado de comercios");
  }
};

exports.getAdministradores = async (req, res) => {
  try {
    const administradores = await Administrador.findAll();
    res.render("viewsAdmin/mantenimientoAdmin", { administradores });
  } catch (error) {
    res.status(500).send("Error al obtener el listado de administradores");
  }
};

exports.createAdministrador = async (req, res) => {
  try {
    const { name, lastName, identification, email, user, password } = req.body;
    await Administrador.create({
      name,
      lastName,
      identification,
      email,
      user,
      password,
    });
    res.redirect("/viewsAdmin/crearAdmin");
  } catch (error) {
    res.status(500).send("Error al crear el administrador");
  }
};

exports.updateAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, identification, email, user, password } = req.body;
    await Administrador.update(
      { name, lastName, identification, email, user, password },
      { where: { id } }
    );
    res.redirect("/admin/administradores");
  } catch (error) {
    res.status(500).send("Error al actualizar el administrador");
  }
};

exports.deleteAdministrador = async (req, res) => {
  try {
    const { id } = req.params;
    await Administrador.destroy({ where: { id } });
    res.redirect("/admin/administradores");
  } catch (error) {
    res.status(500).send("Error al eliminar el administrador");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};
