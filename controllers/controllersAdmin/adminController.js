const ModelCliente = require("../../models/modelCliente/cliente");
const ModelDelivery = require("../../models/modelDelivery/delivery");
const ModelComercio = require("../../models/modelComercios/comercio");
const ModelAdministrador = require("../../models/modelAdmin/administrador");
const ModelItebis = require("../../models/modelAdmin/itebis");
const ModelProducto = require("../../models/modelComercios/producto");
const ModelPedido = require("../../models/modelCliente/pedido");
const verific = require("../../utils/verificUserLog");

exports.getClientes = async (req, res, next) => {
  verific(req, res, next);
  //   el nombre, el apellido,
  // la cantidad de pedidos que ha realizado ese cliente, el teléfono y el correo.

  const items = await ModelCliente.findAll();
  const clientes = await items.map((cliente) => cliente.dataValues);
  res.render("viewsAdmin/listadoCliente", {
    pageTitle: "Food Rush | Admin",
    layout: "layoutAdmin",
    Clientes: clientes,
    has: clientes.length,
  });
};
exports.getViewItebis = async (req, res, next) => {
  // const idAdmin = verific(req, res, next);
  const itbis = await ModelItebis.findOne();
  console.log(" El itbis ", itbis);

  res.render("viewsAdmin/viewConfi", {
    pageTitle: "Food Rush | Itbis",
    layout: "layoutAdmin",
    Itbis: itbis.dataValues,
    editMode: false,
  });
};
exports.postEdidtViewItebis = async (req, res, next) => {
  const idAdmin = verific(req, res, next);
  const itbis = req.body.itbis;
  await ModelItebis.update(
    { itbis: itbis, adminId: idAdmin },
    {
      where: { id: 1 },
    }
  );
  return res.redirect("back");
};

exports.getDeliveries = async (req, res) => {
  try {
    //     el nombre, el apellido,
    // la cantidad de pedidos que ha entregado ese delivery, el teléfono y el correo.
    const items = await ModelDelivery.findAll();
    console.log("El items: ", items);
    const deliveries = items.map((deli) => deli.dataValues);
    deliveries.forEach((element) => {
      console.log("El delivery: ", element);
    });

    res.render("viewsAdmin/listadoDelivery", {
      pageTitle: "Food Rush | Admin",
      layout: "layoutAdmin",
      Deliveries: deliveries,
      has: deliveries.length,
    });
  } catch (error) {
    res.status(500).send("Error al obtener el listado de node");
  }
};

exports.getComercios = async (req, res, next) => {
  //   el nombre del
  // comercio, el logo del comercio, la cantidad de pedidos de ese comercio que hay, el teléfono,
  // la hora de apertura, la hora de cierre y el correo.
  verific(req, res, next);

  const items = await ModelComercio.findAll();
  const comercios = items.map((comercio) => {
    data = comercio.dataValues;
    data.isActivo = comercio.active;
    return data;
  });

  res.render("viewsAdmin/listadoComercio", {
    pageTitle: "Food Rush | Admin",
    layout: "layoutAdmin",
    Comercios: comercios,
    has: comercios.length,
  });
};

exports.getAdministradores = async (req, res) => {
  try {
    const items = await ModelAdministrador.findAll();
    const admis = items.map((admin) => admin.dataValues);

    res.render("viewsAdmin/listadoAdmins", {
      pageTitle: "Food Rush | Admin",
      layout: "layoutAdmin",
      Admins: admis,
      has: admis.length,
      // isActivo: admis,.
    });
  } catch (error) {
    res.status(500).send("Error al obtener el listado de administradores");
  }
};
// exports.getComercios = async (req, res, next) => {
//   verific(req, res, next);

//   const items = await ModelComercio.findAll();
//   const comercios = items.map((comercio) => comercio.dataValues);

//   res.render("viewsAdmin/listadoComercio", {
//     pageTitle: "Food Rush | Admin",
//     layout: "layoutAdmin",
//     Comercios: comercios,
//     has: comercios.length,
//   });
// };

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
