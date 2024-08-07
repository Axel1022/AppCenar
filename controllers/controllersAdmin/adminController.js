const ModelCliente = require("../../models/modelCliente/cliente");
const ModelDelivery = require("../../models/modelDelivery/delivery");
const ModelComercio = require("../../models/modelComercios/comercio");
const ModelAdministrador = require("../../models/modelAdmin/administrador");
const ModelItebis = require("../../models/modelAdmin/itebis");
const ModelProducto = require("../../models/modelComercios/producto");
const ModelPedido = require("../../models/modelCliente/pedido");
const verific = require("../../utils/verificUserLog");
const bcrypt = require("bcryptjs");

exports.getClientes = async (req, res, next) => {
  const role = req.session.user.role;
  console.log("El rol del admin: " + role);
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  verific(req, res, next);
  //   el nombre, el apellido,
  // la cantidad de pedidos que ha realizado ese cliente, el teléfono y el correo.

  const items = await ModelCliente.findAll();
  const clientes = items.map((cliente) => {
    data = cliente.dataValues;
    data.isActivo = cliente.active;
    return data;
  });

  res.render("viewsAdmin/listadoCliente", {
    pageTitle: "Food Rush | Admin",
    layout: "layoutAdmin",
    Clientes: clientes,
    has: clientes.length,
  });
};
exports.getViewItebis = async (req, res, next) => {
  const role = req.session.user.role;
  console.log("El rol del admin: " + role);
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
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

exports.adminEditar = async (req, res, next) => {
  const role = req.session.user.role;
  console.log("El rol del admin: " + role);
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const adminId = req.params.adminId;

  const admin = await ModelAdministrador.findOne({ where: { id: adminId } });

  res.render("viewsAdmin/viewEditarAdmin", {
    pageTitle: "Food Rush | Ediat",
    layout: "layoutAdmin",
    Admin: admin.dataValues,
  });
};
exports.editarAdminPost = async (req, res, next) => {
  const role = req.session.user.role;
  console.log("El rol del admin: " + role);
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const {
    name,
    lastName,
    identification,
    email,
    user,
    password,
    confirmPassword,
    adminId,
  } = req.body;

  if (password !== confirmPassword) {
    req.flash("errors", "Passwords do not match");
    console.log("Passwords do not match");
    return res.redirect("back");
  }

  try {
    const existingUser = await ModelAdministrador.findOne({
      where: { user: user },
    });

    const hashedPassword = await bcrypt.hash(password, 12);

    await ModelAdministrador.update(
      {
        name,
        lastName,
        identification,
        email,
        user,
        password: hashedPassword,
      },
      { where: { id: adminId } }
    );

    console.log("Registro correcto");
    return res.redirect("/Admin/mantenimientoAdmin");
  } catch (err) {
    console.log("Este es el error ", err);
    req.flash("errors", "Something went wrong, please try again later");
    return res.redirect("back");
  }
};

exports.postEdidtViewItebis = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
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
exports.postActDes = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const id = req.body.id;
  const rol = req.body.rol;

  switch (rol) {
    case "cliente":
      const clienteitem = await ModelCliente.findOne({ where: { id: id } });
      if (clienteitem.dataValues.active == true) {
        await ModelCliente.update({ active: false }, { where: { id: id } });
      } else await ModelCliente.update({ active: true }, { where: { id: id } });

      break;
    case "delivery":
      const deliveryitem = await ModelDelivery.findOne({ where: { id: id } });
      if (deliveryitem.dataValues.active == true) {
        await ModelDelivery.update({ active: false }, { where: { id: id } });
      } else
        await ModelDelivery.update({ active: true }, { where: { id: id } });
      break;
    case "administrador":
      const adminitem = await ModelAdministrador.findOne({ where: { id: id } });
      if (adminitem.dataValues.active == true) {
        await ModelAdministrador.update(
          { active: false },
          { where: { id: id } }
        );
      } else
        await ModelAdministrador.update(
          { active: true },
          { where: { id: id } }
        );
      break;
    case "comercio":
      const comercioitem = await ModelComercio.findOne({ where: { id: id } });
      if (comercioitem.dataValues.active == true) {
        await ModelComercio.update({ active: false }, { where: { id: id } });
      } else
        await ModelComercio.update({ active: true }, { where: { id: id } });
      break;
  }

  return res.redirect("back");
};

exports.getDeliveries = async (req, res) => {
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    //     el nombre, el apellido,
    // la cantidad de pedidos que ha entregado ese delivery, el teléfono y el correo.
    const items = await ModelDelivery.findAll();
    console.log("El items: ", items);
    const deliveries = items.map((deli) => {
      data = deli.dataValues;
      data.isActivo = deli.active;
      return data;
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
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
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

exports.getAdministradores = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    const idAdmin = verific(req, res, next);
    const items = await ModelAdministrador.findAll();
    const admis = items.map((admin) => {
      data = admin.dataValues;
      data.isActivo = admin.active;
      data.im = admin.id === idAdmin;
      console.log("Es el mismo? ", data.im);
      return data;
    });

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
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
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
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
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
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    const { id } = req.params;
    await Administrador.destroy({ where: { id } });
    res.redirect("/admin/administradores");
  } catch (error) {
    res.status(500).send("Error al eliminar el administrador");
  }
};
exports.logout = (req, res) => {
  const role = req.session.user.role;
  if (role != "administrador") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  req.session.destroy();
  res.redirect("/login");
};
