const Pedido = require("../../models/modelCliente/pedido");
const Comercio = require("../../models/modelComercios/comercio");
const modelDireccion = require("../../models/modelCliente/direccion");
const modelProducto = require("../../models/modelComercios/producto");
const Delivery = require("../../models/modelDelivery/delivery");
const PedidoProducto = require("../../models/modelPedidoProducto/pedidoProducto");
const verificUser = require("../../utils/verificUserLog");
const { Op } = require("sequelize");
const { Sequelize } = require("sequelize");

exports.getHome = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  const deliverId = req.session.user.id;

  try {
    const delivery = await Delivery.findByPk(deliverId);

    if (!delivery) {
      throw new Error("Delivery no encontrado");
    }

    const pedidos = await Pedido.findAll({
      where: { deliverId: deliverId },
      order: [
        ["date", "DESC"],
        ["hour", "DESC"],
      ],
    });

    const pedidosData = await Promise.all(
      pedidos.map(async (pedido) => {
        const data = pedido.dataValues;
        const comercio = await Comercio.findOne({
          where: { id: data.tradeId },
        });
        if (comercio) {
          data.comercio = comercio.dataValues;
          data.isIncompleto = data.status == "En Proceso";
        }
        const pedidoProducto = await PedidoProducto.findAll({
          where: { pedidoId: data.id },
        });
        const cantidadProducto = pedidoProducto.map(
          (producto) => producto.dataValues.productoId
        );
        data.cantidad = cantidadProducto.length;
        return data;
      })
    );

    res.render("viewsDelivery/home", {
      pageTitle: "Food Rush | Delivery",
      layout: "layoutDelivery",
      delivery: delivery.dataValues,
      pedidos: pedidosData,
      hasPedidos: pedidosData.length > 0,
    });
  } catch (error) {
    console.error("Error al obtener los pedidos:", error);
    req.flash("errors", "Error al obtener los pedidos.");
    res.redirect("/login");
  }
};

// Obtener detalles del pedido
exports.getPedidoDetail = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    const deliverId = req.session.user.id;
    const pedidoId = req.params.idPedido;
    const delivery = await Delivery.findOne({ where: { id: deliverId } });

    if (!delivery) {
      throw new Error("Delivery no encontrado");
    }

    const pedido = await Pedido.findOne({
      where: { id: pedidoId },
    });

    const idComercio = pedido.dataValues.tradeId;
    const idDireccion = pedido.dataValues.directionId;

    const comercioFund = await Comercio.findOne({
      where: { id: idComercio },
    });
    const direccionFund = await modelDireccion.findOne({
      where: { id: idDireccion },
    });

    const idProductos = await PedidoProducto.findAll({
      where: { pedidoId: pedidoId },
    });

    // idProductos.forEach((element) => {
    //   console.log(element);
    // });

    const itemsProdctos = await Promise.all(
      idProductos.map(async (producto) => {
        const item = producto.dataValues;
        const productoBusc = await modelProducto.findOne({
          where: { id: item.productId },
        });
        return productoBusc.dataValues;
      })
    );

    res.render("viewsDelivery/viewDetallePedidoDelivery", {
      pageTitle: "Food Rush | Delivery",
      layout: "layoutDelivery",
      Productos: itemsProdctos,
      Comercio: comercioFund.dataValues,
      Pedido: pedido.dataValues,
      Direccion: direccionFund.dataValues,
      deliverId,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/error");
  }
};

// Completar el pedido
exports.completePedido = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  try {
    const deliveryId = req.session.user.id;
    const pedidoId = req.body.pedidoId;

    await Pedido.update({ status: "Completado" }, { where: { id: pedidoId } });

    // Cambiar estado del delivery a disponible
    await Delivery.update(
      { status: "Desocupado", cantidad: Sequelize.literal(`cantidad + ${1}`) },
      { where: { id: deliveryId } }
    );

    res.redirect("/delivery/home");
  } catch (err) {
    console.log(err);
    res.redirect("/error");
  }
};

// Obtener datos del delivery
exports.getDeliveryProfile = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }
  try {
    const deliveryId = req.session.user.id;
    const delivery = await Delivery.findByPk(deliveryId);

    res.render("viewsDelivery/perfil", {
      pageTitle: "Mi Perfil",
      layout: "layoutDelivery",
      Delivery: delivery.dataValues,
    });
  } catch (err) {
    console.log(err);
    res.redirect("/error");
  }
};

// Actualizar datos del perfil del delivery
exports.postDeliveryProfile = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  try {
    const deliveryId = req.session.user.id;
    const { name, phone, email } = req.body;

    await Delivery.update(
      { name, phone, email },
      { where: { id: deliveryId } }
    );

    res.redirect("/delivery/perfil");
  } catch (err) {
    console.log(err);
    res.redirect("/error");
  }
};

// Obtener el perfil del delivery
exports.getEditPerfil = async (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  const idDelivery = req.session.user.id;

  const delivery = await Delivery.findOne({ where: { id: idDelivery } });
  res.render("viewsDelivery/editPerfil", {
    pageTitle: "Food Rush | perfil",
    layout: "layoutDelivery",
    Cliente: delivery.dataValues,
  });
};
exports.postEditPerfil = (req, res, next) => {
  const role = req.session.user.role;
  if (role != "delivery") {
    req.flash("errors", "Usted no tiene acceso a esta area, buen loco.");
    return res.redirect("/login");
  }

  const name = req.body.name;
  const lastName = req.body.lastName;
  const phone = req.body.telefono;
  const imageProfile = req.file;
  const idDelivery = req.session.user.id;

  Delivery.update(
    { name, lastName, phone, imageProfile },
    { where: { id: idDelivery } }
  )
    .then(() => {
      return res.redirect("/delivery/perfil");
    })
    .catch((error) => {
      console.log(error);
    });
};
